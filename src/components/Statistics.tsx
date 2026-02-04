import Layout from './Layout';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

export default function Statistics() {
  const { matchHistory } = useAppStore();

  const totalMatches = matchHistory.length;
  const totalWins = {
    player1: matchHistory.filter(m => m.winner === 1).length,
    player2: matchHistory.filter(m => m.winner === 2).length,
  };

  const sportsPlayed = new Set(matchHistory.map(m => m.sport)).size;
  const totalDuration = matchHistory.reduce((sum, m) => sum + (m.duration || 0), 0);
  const avgDuration = totalMatches > 0 ? Math.floor(totalDuration / totalMatches / 60) : 0;

  const recentPlayers = new Set<string>();
  matchHistory.slice(0, 10).forEach(m => {
    recentPlayers.add(m.player1Name);
    recentPlayers.add(m.player2Name);
  });

  // Calculate streaks
  const calculateStreaks = () => {
    if (matchHistory.length === 0) {
      return { player1: { win: 0, loss: 0 }, player2: { win: 0, loss: 0 } };
    }

    // Sort by date (most recent first)
    const sorted = [...matchHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const streaks = { player1: { win: 0, loss: 0 }, player2: { win: 0, loss: 0 } };
    
    // Calculate current streak (from most recent match)
    for (const match of sorted) {
      if (match.winner === 1) {
        if (streaks.player1.win === 0 && streaks.player1.loss === 0) {
          streaks.player1.win = 1;
        } else if (streaks.player1.win > 0) {
          streaks.player1.win++;
        } else {
          break; // Streak broken
        }
        
        if (streaks.player2.loss === 0 && streaks.player2.win === 0) {
          streaks.player2.loss = 1;
        } else if (streaks.player2.loss > 0) {
          streaks.player2.loss++;
        } else {
          break;
        }
      } else {
        if (streaks.player2.win === 0 && streaks.player2.loss === 0) {
          streaks.player2.win = 1;
        } else if (streaks.player2.win > 0) {
          streaks.player2.win++;
        } else {
          break;
        }
        
        if (streaks.player1.loss === 0 && streaks.player1.win === 0) {
          streaks.player1.loss = 1;
        } else if (streaks.player1.loss > 0) {
          streaks.player1.loss++;
        } else {
          break;
        }
      }
    }

    return streaks;
  };

  const streaks = calculateStreaks();

  const stats = [
    { label: 'Total Matches', value: totalMatches, icon: '🎾' },
    { label: 'Sports Played', value: sportsPlayed, icon: '🏆' },
    { label: 'Avg Match Time', value: `${avgDuration} min`, icon: '⏱️' },
    { label: 'Total Players', value: recentPlayers.size, icon: '👥' },
  ];

  return (
    <Layout title="Statistics" showSettings={false}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md text-center border border-gray-200 dark:border-navy-700"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Win Statistics</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                <span>Player 1 Wins</span>
                <span className="font-semibold">{totalWins.player1}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalMatches > 0 ? (totalWins.player1 / totalMatches) * 100 : 0}%` }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 h-2 rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                <span>Player 2 Wins</span>
                <span className="font-semibold">{totalWins.player2}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalMatches > 0 ? (totalWins.player2 / totalMatches) * 100 : 0}%` }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-navy-800 dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-500 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streaks */}
        {matchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Current Streaks</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Player 1</span>
                  <div className="flex gap-4">
                    {streaks.player1.win > 0 && (
                      <span className="text-sm font-semibold text-navy-800 dark:text-green-400">
                        🔥 {streaks.player1.win} win streak
                      </span>
                    )}
                    {streaks.player1.loss > 0 && (
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        ❄️ {streaks.player1.loss} loss streak
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Player 2</span>
                  <div className="flex gap-4">
                    {streaks.player2.win > 0 && (
                      <span className="text-sm font-semibold text-navy-800 dark:text-green-400">
                        🔥 {streaks.player2.win} win streak
                      </span>
                    )}
                    {streaks.player2.loss > 0 && (
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        ❄️ {streaks.player2.loss} loss streak
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {matchHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No statistics available yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Play some matches to see your statistics
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
