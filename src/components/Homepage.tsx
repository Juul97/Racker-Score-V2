import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/useNavigationStore';
import type { Sport } from '../types';
import TennisIcon from '../assets/buttons/Tennis.svg';
import PadelIcon from '../assets/buttons/Padel.svg';
import BadmintonIcon from '../assets/buttons/Badminton.svg';
import PingpongIcon from '../assets/buttons/Pingpong.svg';
import PickleIcon from '../assets/buttons/Pickle.svg';

const sports: Array<{ id: Sport; name: string; svgIcon: string }> = [
  { id: 'tennis', name: 'Tennis', svgIcon: TennisIcon },
  { id: 'padel', name: 'Padel', svgIcon: PadelIcon },
  { id: 'badminton', name: 'Badminton', svgIcon: BadmintonIcon },
  { id: 'table-tennis', name: 'Table Tennis', svgIcon: PingpongIcon },
  { id: 'pickleball', name: 'Pickleball', svgIcon: PickleIcon },
  { id: 'squash', name: 'Squash', svgIcon: TennisIcon }, // Using Tennis icon as fallback
];

export default function Homepage() {
  const { setCurrentSport, endMatch } = useAppStore();
  const { setView } = useNavigationStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const handleSportClick = (sport: Sport) => {
    // End current match if switching sports
    endMatch();
    setCurrentSport(sport);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy-800 to-navy-900 dark:from-navy-900 dark:to-navy-800 rounded-b-3xl shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Racket Score</h1>
            </div>
            <button
              onClick={() => setView('settings')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Greeting */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8"
        >
          {getGreeting()}
        </motion.h2>

        {/* Sport Cards Grid - 2 columns, 3 rows */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {sports.map((sport, index) => (
            <motion.button
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSportClick(sport.id)}
              className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 sm:gap-4 min-h-[120px] sm:min-h-[150px] border border-gray-200 dark:border-navy-700"
            >
              <img
                src={sport.svgIcon}
                alt={sport.name}
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {sport.name}
              </span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Bottom Navigation is handled by App.tsx */}
    </div>
  );
}
