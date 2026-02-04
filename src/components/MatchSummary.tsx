import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import Confetti from './animations/Confetti';
import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/useNavigationStore';
import type { TennisMatchState } from '../types';
import { shareMatchAsImage, shareToSocial } from '../utils/share';

interface MatchSummaryProps {
  winner: 1 | 2;
  onRematch: () => void;
  onNewMatch: () => void;
}

export default function MatchSummary({ winner, onRematch, onNewMatch }: MatchSummaryProps) {
  const { currentMatch, addMatchHistory, endMatch } = useAppStore();
  const { setView } = useNavigationStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Celebration animation
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!currentMatch) return null;

  const formatResult = () => {
    if (currentMatch.sport === 'tennis' || currentMatch.sport === 'padel') {
      const state = currentMatch.state as TennisMatchState;
      return state.sets.map(s => `${s.games[0]}-${s.games[1]}`).join(', ');
    } else if (currentMatch.sport === 'badminton' || currentMatch.sport === 'table-tennis' || currentMatch.sport === 'squash') {
      // Would need to track games won - simplified for now
      return 'Match Complete';
    } else if (currentMatch.sport === 'pickleball') {
      // Would need to track games won - simplified for now
      return 'Match Complete';
    }
    return 'Match Complete';
  };

  const formatDuration = () => {
    const seconds = Math.floor((Date.now() - currentMatch.startTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Helper functions for the shareable card
  const getWinnerName = () => {
    return winner === 1 ? currentMatch.player1Name : currentMatch.player2Name;
  };

  const getLoserName = () => {
    return winner === 1 ? currentMatch.player2Name : currentMatch.player1Name;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatSport = () => {
    return currentMatch.sport.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleShare = async () => {
    const result = formatResult();
    const text = `${currentMatch.player1Name} vs ${currentMatch.player2Name}\n${result}\nMatch Duration: ${formatDuration()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Match Result',
          text,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  const handleShareAsImage = async () => {
    await shareMatchAsImage('match-result-card', `match-result-${Date.now()}.png`);
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const result = formatResult();
    const winnerName = winner === 1 ? currentMatch.player1Name : currentMatch.player2Name;
    const text = `🏆 ${winnerName} won! ${currentMatch.player1Name} vs ${currentMatch.player2Name} - ${result} | Match Duration: ${formatDuration()}`;
    shareToSocial(platform, text);
  };

  const handleRematch = () => {
    onRematch();
    setView('dashboard');
  };

  const handleNewMatch = () => {
    endMatch();
    setView('dashboard');
    onNewMatch();
  };

  const handleSaveMatch = () => {
    if (currentMatch && !isSaved) {
      const matchHistory = {
        id: Date.now().toString(),
        sport: currentMatch.sport,
        date: new Date().toISOString(),
        duration: Math.floor((Date.now() - currentMatch.startTime) / 1000),
        player1Name: currentMatch.player1Name,
        player2Name: currentMatch.player2Name,
        result: formatResult(),
        winner,
      };
      addMatchHistory(matchHistory);
      setIsSaved(true);
    }
  };

  return (
    <Layout title="Match Complete" showSettings={false}>
      <Confetti active={showConfetti} duration={5000} />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Celebration */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="text-6xl"
          >
            🎉
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            MATCH COMPLETE!
          </motion.h2>

          <motion.div
            id="match-result-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-gradient-to-br from-green-400 to-blue-500 p-8 rounded-2xl text-white max-w-md mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">🏆 Match Result</h2>
            <div className="text-center">
              <p className="text-5xl font-black mb-2">{getWinnerName()}</p>
              <p className="text-2xl mb-4">defeats {getLoserName()}</p>
              <p className="text-4xl font-bold mb-6">{formatResult()}</p>
              <div className="flex justify-around text-sm">
                <div>
                  <p className="opacity-80">Duration</p>
                  <p className="font-bold">{formatDuration()}</p>
                </div>
                <div>
                  <p className="opacity-80">Sport</p>
                  <p className="font-bold">{formatSport()}</p>
                </div>
                <div>
                  <p className="opacity-80">Date</p>
                  <p className="font-bold">{formatDate()}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm opacity-80">
              Tracked with RacketScore 🎾
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 w-full"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareAsImage}
              className="w-full px-6 py-3 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold hover:bg-navy-900 dark:hover:from-lime-500 dark:hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>📸</span>
              <span>Share as Image</span>
            </motion.button>

            {/* Social Media Share Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialShare('twitter')}
                className="px-4 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition-all shadow-md flex items-center justify-center gap-2"
                aria-label="Share on Twitter"
              >
                <span>🐦</span>
                <span className="hidden sm:inline">Twitter</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialShare('facebook')}
                className="px-4 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166fe5] transition-all shadow-md flex items-center justify-center gap-2"
                aria-label="Share on Facebook"
              >
                <span>📘</span>
                <span className="hidden sm:inline">Facebook</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialShare('whatsapp')}
                className="px-4 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#20ba5a] transition-all shadow-md flex items-center justify-center gap-2"
                aria-label="Share on WhatsApp"
              >
                <span>💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Copy Text</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveMatch}
              disabled={isSaved}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-navy-800 dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-600 text-white hover:bg-navy-900 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:shadow-xl'
              }`}
            >
              <span>{isSaved ? '✓' : '💾'}</span>
              <span>{isSaved ? 'Match Saved' : 'Save Match'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRematch}
              className="w-full px-6 py-3 bg-navy-800 dark:bg-gradient-to-r dark:from-green-500 dark:to-emerald-500 text-white rounded-lg font-semibold hover:bg-navy-900 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Rematch</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewMatch}
              className="w-full px-6 py-3 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold hover:bg-navy-900 dark:hover:from-lime-500 dark:hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              <span>New Match</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
