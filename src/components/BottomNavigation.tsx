import { useNavigationStore } from '../store/useNavigationStore';

export default function BottomNavigation() {
  const { currentView, setView } = useNavigationStore();

  const handleNavigation = (view: 'homepage' | 'statistics' | 'history' | 'players') => {
    setView(view);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-navy-800 border-t border-gray-200 dark:border-navy-700 px-4 py-3 sm:py-4 z-40">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => handleNavigation('homepage')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'homepage' || currentView === 'dashboard'
              ? 'bg-navy-800 dark:bg-navy-700 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400'
          }`}
          aria-label="Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        {/* Statistics */}
        <button
          onClick={() => handleNavigation('statistics')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'statistics'
              ? 'bg-navy-800 dark:bg-navy-700 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400'
          }`}
          aria-label="Statistics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>
        {/* Match History */}
        <button
          onClick={() => handleNavigation('history')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'history'
              ? 'bg-navy-800 dark:bg-navy-700 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400'
          }`}
          aria-label="Match History"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        {/* Players */}
        <button
          onClick={() => handleNavigation('players')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'players'
              ? 'bg-navy-800 dark:bg-navy-700 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-400'
          }`}
          aria-label="Players"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>
      </div>
    </nav>
  );
}
