import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/useNavigationStore';
import type { Sport } from '../types';
import TennisIcon from '../assets/buttons/Tennis.svg';
import PadelIcon from '../assets/buttons/Padel.svg';
import BadmintonIcon from '../assets/buttons/Badminton.svg';
import PingpongIcon from '../assets/buttons/Pingpong.svg';
import PickleIcon from '../assets/buttons/Pickle.svg';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const sports: Array<{ id: Sport; name: string; icon: string; svgIcon?: string }> = [
  { id: 'tennis', name: 'Tennis', icon: '🎾', svgIcon: TennisIcon },
  { id: 'padel', name: 'Padel', icon: '🎾', svgIcon: PadelIcon },
  { id: 'badminton', name: 'Badminton', icon: '🏸', svgIcon: BadmintonIcon },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', svgIcon: PingpongIcon },
  { id: 'pickleball', name: 'Pickleball', icon: '🥎', svgIcon: PickleIcon },
  { id: 'squash', name: 'Squash', icon: '🎾', svgIcon: TennisIcon }, // Using Tennis icon as fallback
];

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const { currentSport, setCurrentSport, endMatch } = useAppStore();
  const { setView } = useNavigationStore();

  const handleSportClick = (sport: Sport) => {
    // End current match if switching sports to reset timer and state
    if (currentSport !== sport) {
      endMatch();
    }
    setCurrentSport(sport);
    setView('dashboard');
    onClose();
  };

  const handleMenuClick = (view: 'history' | 'settings' | 'about' | 'statistics' | 'players') => {
    setView(view);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-900 bg-opacity-50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-navy-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-navy-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏸</span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                RacketScore
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sports List */}
          <nav className="flex-1 overflow-y-auto py-4">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportClick(sport.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  currentSport === sport.id
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {sport.svgIcon ? (
                  <img 
                    src={sport.svgIcon} 
                    alt={sport.name}
                    className="w-10 h-10"
                  />
                ) : (
                  <span className="text-2xl">{sport.icon}</span>
                )}
                <span className="font-medium">{sport.name}</span>
              </button>
            ))}

            <div className="border-t border-gray-200 dark:border-navy-700 my-2" />

            {/* Additional Menu Items */}
            <button
              onClick={() => handleMenuClick('statistics')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-2xl">📈</span>
              <span className="font-medium">Statistics</span>
            </button>

            <button
              onClick={() => handleMenuClick('history')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium">Match History</span>
            </button>

            <button
              onClick={() => handleMenuClick('players')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-2xl">👥</span>
              <span className="font-medium">Players</span>
            </button>

            <button
              onClick={() => handleMenuClick('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-2xl">⚙️</span>
              <span className="font-medium">Settings</span>
            </button>

            <button
              onClick={() => handleMenuClick('about')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-2xl">ℹ️</span>
              <span className="font-medium">About/Help</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
