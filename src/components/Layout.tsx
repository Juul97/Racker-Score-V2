import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/useNavigationStore';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Layout({ children, title, showBack = false, onBack }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [_isTablet, setIsTablet] = useState(false);
  const [isSmartwatch, setIsSmartwatch] = useState(false);
  const { currentSport: _currentSport } = useAppStore();
  const { goBack, currentView, setView } = useNavigationStore();
  
  // Show back button if not on homepage and showBack is true or not explicitly set
  const shouldShowBack = showBack !== false && currentView !== 'homepage';
  
  // Use provided onBack or default to goBack from navigation store
  const handleBack = onBack || goBack;

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsSmartwatch(width < 320);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 ${isSmartwatch ? 'smartwatch-mode' : ''} pb-20 flex flex-col`}>
      {/* Main Content Area */}
      <div className="transition-all duration-300 flex flex-col flex-1">
        {/* Header */}
        <header className={`bg-gradient-to-r from-navy-800 to-navy-900 dark:from-navy-900 dark:to-navy-800 rounded-b-3xl shadow-lg ${
          isSmartwatch ? 'px-2 py-2' : isMobile ? 'px-4 py-4' : 'px-6 py-6 sm:px-8 sm:py-8'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back Button */}
              {shouldShowBack && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className={`flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ${
                    isSmartwatch ? 'w-8 h-8 p-1.5' : 'w-10 h-10 p-2'
                  }`}
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={isSmartwatch ? 'h-4 w-4' : 'h-6 w-6'}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
              )}
              <h1 className={`text-2xl sm:text-3xl font-bold text-white ${
                isSmartwatch ? 'text-lg' : ''
              }`}>
                {title}
              </h1>
            </div>
            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setView('settings')}
              className={`flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ${
                isSmartwatch ? 'w-8 h-8 p-1.5' : 'w-10 h-10 p-2'
              }`}
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={isSmartwatch ? 'h-4 w-4' : 'h-6 w-6'}
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
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 ${isSmartwatch ? 'p-2' : isMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-8'} px-4 sm:px-6 lg:px-8`}>{children}</main>
      </div>
    </div>
  );
}
