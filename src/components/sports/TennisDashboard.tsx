import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout';
import Timer from '../Timer';
import PlayerButton from '../PlayerButton';
import { useAppStore } from '../../store/useAppStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { incrementTennisScore } from '../../utils/scoring';
import type { TennisMatchState } from '../../types';
import TennisIcon from '../../assets/buttons/Tennis.svg';
import PlayerSetupModal from '../ui/PlayerSetupModal';

export default function TennisDashboard() {
  const { currentMatch, updateMatchState, settings, endMatch } = useAppStore();
  const { goBack, setView } = useNavigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDoubles, setIsDoubles] = useState(false);
  const [stateHistory, setStateHistory] = useState<TennisMatchState[]>([]);

  if (!currentMatch || currentMatch.sport !== 'tennis' && currentMatch.sport !== 'padel') {
      return (
      <Layout title="Tennis">
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-md border border-gray-200 dark:border-navy-700"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">No active match</p>
            
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Game Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDoubles(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Singles (2 Players)
                </button>
                <button
                  onClick={() => {
                    setIsDoubles(true);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Doubles (4 Players)
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Player Setup Modal */}
        <PlayerSetupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onStart={(player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color) => {
            useAppStore.getState().startMatch('tennis', player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color);
          }}
          sport="tennis"
          isDoubles={isDoubles}
          onModeChange={setIsDoubles}
          supportsDoubles={true}
        />
      </Layout>
    );
  }

  const matchState = currentMatch.state as TennisMatchState;
  const setsWon = [
    matchState.sets.filter(s => s.games[0] > s.games[1]).length,
    matchState.sets.filter(s => s.games[1] > s.games[0]).length,
  ];

  const handlePoint = async (player: 1 | 2) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    // Save current state to history for undo
    setStateHistory(prev => [...prev, JSON.parse(JSON.stringify(matchState))]);
    
    // Haptic feedback
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const result = incrementTennisScore(matchState, player, settings);
    updateMatchState(result.newState);

    if (result.matchWon) {
      // Show match end screen
      setTimeout(() => {
        setIsAnimating(false);
        setView('match-summary');
      }, 1000);
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const formatTennisScore = (score: number | 'ad' | 'game'): string => {
    if (score === 'ad') return 'Ad';
    if (score === 'game') return 'Game';
    return String(score);
  };

  const currentGame = matchState.currentSet.currentGame;
  const isTiebreak = !!matchState.currentSet.tiebreak;

  return (
    <Layout 
      title={currentMatch.sport === 'tennis' ? 'Tennis' : 'Padel'}
      showBack={true}
      onBack={() => {
        endMatch();
        setStateHistory([]);
        goBack();
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Sets Won</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-800 dark:text-lime-400">{setsWon[0]}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Current Games</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-800 dark:text-lime-400">
              {matchState.currentSet.games[0]} - {matchState.currentSet.games[1]}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Match Time</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-navy-800 dark:text-lime-400">
              <Timer startTime={currentMatch.startTime} />
            </div>
          </motion.div>
        </div>

        {/* Tiebreak Score */}
        {isTiebreak && matchState.currentSet.tiebreak && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 text-center shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-sm font-semibold text-navy-800 dark:text-lime-400 mb-2">
              Tiebreak
            </div>
            <div className="text-2xl font-bold text-white">
              {matchState.currentSet.tiebreak.player1Score} - {matchState.currentSet.tiebreak.player2Score}
            </div>
          </motion.div>
        )}

        {/* Player Buttons */}
        <div className="space-y-4">
          <PlayerButton
            name={currentMatch.player1Name}
            score={isTiebreak && matchState.currentSet.tiebreak
              ? matchState.currentSet.tiebreak.player1Score
              : formatTennisScore(currentGame.player1Score)}
            serving={currentGame.serving === 1 || (isTiebreak && matchState.currentSet.tiebreak?.serving === 1)}
            servingIcon={TennisIcon}
            onClick={() => handlePoint(1)}
            disabled={isAnimating}
            color={currentMatch.team1Color || 'navy'}
          />

          <PlayerButton
            name={currentMatch.player2Name}
            score={isTiebreak && matchState.currentSet.tiebreak
              ? matchState.currentSet.tiebreak.player2Score
              : formatTennisScore(currentGame.player2Score)}
            serving={currentGame.serving === 2 || (isTiebreak && matchState.currentSet.tiebreak?.serving === 2)}
            servingIcon={TennisIcon}
            onClick={() => handlePoint(2)}
            disabled={isAnimating}
            color={currentMatch.team2Color || 'blue'}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={stateHistory.length === 0}
            className="flex-1 px-4 py-3 bg-white dark:bg-navy-800 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-navy-700 shadow-sm"
            onClick={() => {
              if (stateHistory.length > 0) {
                const previousState = stateHistory[stateHistory.length - 1];
                setStateHistory(prev => prev.slice(0, -1));
                updateMatchState(previousState);
              }
            }}
          >
            ↶ Undo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
            onClick={() => {
              const resetGame = () => {
                const resetState: TennisMatchState = {
                  ...matchState,
                  currentSet: {
                    ...matchState.currentSet,
                    currentGame: {
                      player1Score: 0,
                      player2Score: 0,
                      serving: matchState.currentSet.currentGame.serving,
                    },
                    tiebreak: undefined,
                  },
                };
                updateMatchState(resetState);
                setStateHistory([]); // Clear history when resetting
              };

              if (settings.confirmResets) {
                if (confirm('Reset current game to 0-0?')) {
                  resetGame();
                }
              } else {
                resetGame();
              }
            }}
          >
            🔄 Reset Game
          </motion.button>
        </div>
      </div>
    </Layout>
  );
}
