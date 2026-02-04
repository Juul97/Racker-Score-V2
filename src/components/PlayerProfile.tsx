import { useState } from 'react';
import Layout from './Layout';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

export default function PlayerProfile() {
  const { matchHistory } = useAppStore();
  const [playerName, setPlayerName] = useState('');
  const [savedPlayers, setSavedPlayers] = useState<string[]>(() => {
    const stored = localStorage.getItem('racket-score-players');
    return stored ? JSON.parse(stored) : [];
  });

  const addPlayer = () => {
    if (playerName.trim() && !savedPlayers.includes(playerName.trim())) {
      const newPlayers = [...savedPlayers, playerName.trim()];
      setSavedPlayers(newPlayers);
      localStorage.setItem('racket-score-players', JSON.stringify(newPlayers));
      setPlayerName('');
    }
  };

  const removePlayer = (name: string) => {
    const newPlayers = savedPlayers.filter(p => p !== name);
    setSavedPlayers(newPlayers);
    localStorage.setItem('racket-score-players', JSON.stringify(newPlayers));
  };

  // Get recent players from match history
  const recentPlayers = new Set<string>();
  matchHistory.slice(0, 20).forEach(m => {
    recentPlayers.add(m.player1Name);
    recentPlayers.add(m.player2Name);
  });

  return (
    <Layout title="Player Profiles" showSettings={false}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Player</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter player name"
              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-white/20"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addPlayer}
              className="px-6 py-2 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold hover:bg-navy-900 dark:hover:from-lime-500 dark:hover:to-yellow-500 transition-all shadow-lg"
            >
              Add
            </motion.button>
          </div>
        </motion.div>

        {savedPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Saved Players</h3>
            <div className="flex flex-wrap gap-2">
              {savedPlayers.map((player, index) => (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-100 dark:bg-gradient-to-r dark:from-lime-400/20 dark:to-yellow-400/20 border border-navy-300 dark:border-lime-400/30 rounded-lg"
                >
                  <span className="text-gray-900 dark:text-white">{player}</span>
                  <button
                    onClick={() => removePlayer(player)}
                    className="text-red-400 hover:text-red-300"
                    aria-label="Remove player"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {recentPlayers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Players</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(recentPlayers).slice(0, 10).map((player, index) => (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-white dark:bg-navy-800 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 shadow-sm"
                >
                  {player}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {savedPlayers.length === 0 && recentPlayers.size === 0 && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-md border border-gray-200 dark:border-navy-700"
            >
              <p className="text-gray-600 dark:text-gray-400 text-lg">No players saved yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Add players to quickly start matches
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
