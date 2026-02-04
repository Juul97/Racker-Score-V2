import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useNavigationStore } from './store/useNavigationStore';
import type { TennisMatchState } from './types';
import Homepage from './components/Homepage';
import TennisDashboard from './components/sports/TennisDashboard';
import BadmintonDashboard from './components/sports/BadmintonDashboard';
import TableTennisDashboard from './components/sports/TableTennisDashboard';
import SquashDashboard from './components/sports/SquashDashboard';
import PickleballDashboard from './components/sports/PickleballDashboard';
import MatchHistory from './components/MatchHistory';
import Settings from './components/Settings';
import MatchSummary from './components/MatchSummary';
import Statistics from './components/Statistics';
import PlayerProfile from './components/PlayerProfile';
import BottomNavigation from './components/BottomNavigation';

function App() {
  const { currentSport, settings } = useAppStore();
  const { currentView } = useNavigationStore();

  // Apply theme based on settings
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Service worker is automatically registered by vite-plugin-pwa

  // Render appropriate view
  const renderView = () => {
    if (currentView === 'homepage') {
      return <Homepage />;
    }
    if (currentView === 'statistics') {
      return <Statistics />;
    }
    if (currentView === 'history') {
      return <MatchHistory />;
    }
    if (currentView === 'settings') {
      return <Settings />;
    }
    if (currentView === 'players') {
      return <PlayerProfile />;
    }
    if (currentView === 'match-summary') {
      const match = useAppStore.getState().currentMatch;
      if (!match) {
        useNavigationStore.getState().setView('dashboard');
        return null;
      }
      const winner = match.sport === 'tennis' || match.sport === 'padel'
        ? (() => {
            const state = match.state as TennisMatchState;
            const setsWon = [
              state.sets.filter(s => s.games[0] > s.games[1]).length,
              state.sets.filter(s => s.games[1] > s.games[0]).length,
            ];
            return setsWon[0] > setsWon[1] ? 1 : 2;
          })()
        : 1; // Simplified for other sports
      return (
        <MatchSummary
          winner={winner}
          onRematch={() => {
            // Start rematch with same players
            useAppStore.getState().startMatch(
              match.sport,
              match.player1Name,
              match.player2Name,
              match.player3Name,
              match.player4Name
            );
          }}
          onNewMatch={() => {
            // Will be handled by MatchSummary
          }}
        />
      );
    }

    // Dashboard view (only when currentView is 'dashboard')
    if (currentView === 'dashboard') {
      switch (currentSport) {
      case 'tennis':
      case 'padel':
        return <TennisDashboard />;
      case 'badminton':
        return <BadmintonDashboard />;
      case 'table-tennis':
        return <TableTennisDashboard />;
      case 'squash':
        return <SquashDashboard />;
      case 'pickleball':
        return <PickleballDashboard />;
      default:
        return <TennisDashboard />;
      }
    }

    // Default fallback to homepage
    return <Homepage />;
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.3,
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentView}-${currentSport}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      <BottomNavigation />
    </div>
  );
}

export default App;
