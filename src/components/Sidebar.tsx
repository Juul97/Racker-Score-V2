import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/useNavigationStore';
import type { Sport } from '../types';
import TennisIcon from '../assets/buttons/Tennis.svg';
import PadelIcon from '../assets/buttons/Padel.svg';
import BadmintonIcon from '../assets/buttons/Badminton.svg';
import PingpongIcon from '../assets/buttons/Pingpong.svg';
import PickleIcon from '../assets/buttons/Pickle.svg';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const sports: Array<{ id: Sport; name: string; icon: string; svgIcon?: string }> = [
  { id: 'tennis', name: 'Tennis', icon: '🎾', svgIcon: TennisIcon },
  { id: 'padel', name: 'Padel', icon: '🎾', svgIcon: PadelIcon },
  { id: 'badminton', name: 'Badminton', icon: '🏸', svgIcon: BadmintonIcon },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', svgIcon: PingpongIcon },
  { id: 'pickleball', name: 'Pickleball', icon: '🥎', svgIcon: PickleIcon },
  { id: 'squash', name: 'Squash', icon: '🎾', svgIcon: TennisIcon }, // Using Tennis icon as fallback
];

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: '🏠', view: 'dashboard' as const },
  { id: 'statistics', name: 'Statistics', icon: '📈', view: 'statistics' as const },
  { id: 'history', name: 'History', icon: '📊', view: 'history' as const },
  { id: 'players', name: 'Players', icon: '👥', view: 'players' as const },
  { id: 'settings', name: 'Settings', icon: '⚙️', view: 'settings' as const },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { currentSport, setCurrentSport } = useAppStore();
  const { currentView, setView } = useNavigationStore();

  const handleMenuClick = (view: typeof menuItems[number]['view']) => {
    setView(view);
  };

  const handleSportClick = (sport: Sport) => {
    setCurrentSport(sport);
    setView('dashboard');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gradient-to-b dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 z-50 border-r border-gray-200 dark:border-navy-700/50 flex flex-col shadow-lg dark:shadow-none"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-yellow-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            🏸
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-900 dark:text-white text-xl font-bold"
            >
              RacketScore
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleMenuClick(item.view)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all
                ${isActive
                  ? 'bg-primary-100 dark:bg-white/10 text-primary-700 dark:text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </motion.button>
          );
        })}

        <div className="border-t border-gray-200 dark:border-navy-700/50 my-4" />

        {/* Sports */}
        <div className={isCollapsed ? '' : 'px-2 mb-2'}>
          {!isCollapsed && (
            <div className="text-gray-500 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">
              Sports
            </div>
          )}
          {sports.map((sport) => {
            const isActive = currentSport === sport.id && currentView === 'dashboard';
            return (
              <motion.button
                key={sport.id}
                onClick={() => handleSportClick(sport.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 mb-1 rounded-lg transition-all
                  ${isActive
                    ? 'bg-primary-100 dark:bg-white/10 text-primary-700 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }
                `}
              >
                {sport.svgIcon ? (
                  <img 
                    src={sport.svgIcon} 
                    alt={sport.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-lg">{sport.icon}</span>
                )}
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm"
                  >
                    {sport.name}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-200 dark:border-navy-700/50">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-full h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white flex items-center justify-center transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.svg
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </motion.svg>
        </motion.button>
      </div>
    </motion.aside>
  );
}
