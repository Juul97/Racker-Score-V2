import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAppStore } from '../store/useAppStore';
import type { MatchHistory } from '../types';
import { exportMatchHistoryAsCSV, exportMatchHistoryAsPDF } from '../utils/share';
import TennisIcon from '../assets/buttons/Tennis.svg';
import PadelIcon from '../assets/buttons/Padel.svg';
import BadmintonIcon from '../assets/buttons/Badminton.svg';
import PingpongIcon from '../assets/buttons/Pingpong.svg';
import PickleIcon from '../assets/buttons/Pickle.svg';

const sportIcons: Record<string, string> = {
  tennis: '🎾',
  padel: '🎾',
  badminton: '🏸',
  'table-tennis': '🏓',
  squash: '🎾',
  pickleball: '🥎',
};

const sportSvgIcons: Record<string, string> = {
  tennis: TennisIcon,
  padel: PadelIcon,
  badminton: BadmintonIcon,
  'table-tennis': PingpongIcon,
  squash: TennisIcon, // Using Tennis icon as fallback
  pickleball: PickleIcon,
};

export default function MatchHistory() {
  const { matchHistory, clearMatchHistory } = useAppStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateAndTime = (dateString: string) => {
    return `${formatDate(dateString)} + ${formatTime(dateString)}`;
  };

  const getSportName = (sport: string) => {
    return sport.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPlayersText = (match: MatchHistory) => {
    return `${match.player1Name} vs ${match.player2Name}`;
  };

  const getWinnerName = (match: MatchHistory) => {
    return match.winner === 1 ? match.player1Name : match.player2Name;
  };

  return (
    <Layout title="Match History" showSettings={false}>
      <div>
        {matchHistory.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-md border border-gray-200 dark:border-navy-700"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">No match history yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start playing matches to see them here
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {matchHistory.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md"
              >
                {/* Date + time heading */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {formatDateAndTime(match.date)}
                </h3>

                {/* Four entries with icons */}
                <div className="space-y-3">
                  {/* 1. Sport (light green icon) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-200 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                      {sportSvgIcons[match.sport] ? (
                        <img 
                          src={sportSvgIcons[match.sport]} 
                          alt={match.sport}
                          className="w-6 h-6"
                        />
                      ) : (
                        <span className="text-lg">
                          {sportIcons[match.sport] || '🎾'}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {getSportName(match.sport)}
                    </span>
                  </div>

                  {/* 2. Players (light purple icon) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-200 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-purple-700 dark:text-purple-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {getPlayersText(match)}
                    </span>
                  </div>

                  {/* 3. Result (orange icon) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-200 dark:bg-orange-800 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-orange-700 dark:text-orange-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {match.result}
                    </span>
                  </div>

                  {/* 4. Winner (light blue icon) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-200 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-navy-700 dark:text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">
                      {getWinnerName(match)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => exportMatchHistoryAsCSV(matchHistory)}
                  className="px-4 py-3 bg-navy-800 dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-600 text-white rounded-lg font-semibold hover:bg-navy-900 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📊</span>
                  <span>Export CSV</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => exportMatchHistoryAsPDF(matchHistory)}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📄</span>
                  <span>Export PDF</span>
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (confirm('Clear all match history?')) {
                    clearMatchHistory();
                  }
                }}
                className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-lg"
              >
                Clear History
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
