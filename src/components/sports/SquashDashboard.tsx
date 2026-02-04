import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout';
import Timer from '../Timer';
import PlayerButton from '../PlayerButton';
import { useAppStore } from '../../store/useAppStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { incrementRallyScore } from '../../utils/scoring';
import type { RallyScoreState } from '../../types';
import { getNextServerInCustomRotation } from '../../utils/servingRotation';
import PlayerSetupModal from '../ui/PlayerSetupModal';

export default function SquashDashboard() {
  const { currentMatch, updateMatchState, settings, endMatch } = useAppStore();
  const { goBack } = useNavigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [gamesWon, setGamesWon] = useState<[number, number]>([0, 0]);
  const [showModal, setShowModal] = useState(false);
  const [stateHistory, setStateHistory] = useState<RallyScoreState[]>([]);

  if (!currentMatch || currentMatch.sport !== 'squash') {
      return (
      <Layout title="Squash">
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-md border border-gray-200 dark:border-navy-700"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">No active match</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start New Match
            </motion.button>
          </motion.div>
        </div>

        {/* Player Setup Modal */}
        <PlayerSetupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onStart={(player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color) => {
            useAppStore.getState().startMatch('squash', player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color);
          }}
          sport="squash"
          isDoubles={false}
          supportsDoubles={false}
        />
      </Layout>
    );
  }

  const matchState = currentMatch.state as RallyScoreState;

  const handlePoint = async (player: 1 | 2) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    // Save current state to history for undo
    setStateHistory(prev => [...prev, JSON.parse(JSON.stringify(matchState))]);
    
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const result = incrementRallyScore(matchState, player, 11);
    updateMatchState(result.newState);

    if (result.gameWon) {
      const newGamesWon: [number, number] = [...gamesWon];
      if (player === 1) {
        newGamesWon[0]++;
      } else {
        newGamesWon[1]++;
      }
      setGamesWon(newGamesWon);

      const setsNeeded = settings.squash.matchFormat === 'best-of-3' ? 2 : 3;

      if (newGamesWon[0] >= setsNeeded || newGamesWon[1] >= setsNeeded) {
        setTimeout(() => {
          setIsAnimating(false);
          // Navigate to match summary
        }, 1000);
      } else {
        const isDoublesMatch = !!(currentMatch.player3Name && currentMatch.player4Name);
        if (isDoublesMatch && matchState.firstServer && matchState.secondServer && matchState.currentServer) {
          // Use custom rotation for doubles
          const nextServer = getNextServerInCustomRotation(
            matchState.firstServer,
            matchState.secondServer,
            matchState.currentServer
          );
          const nextServingTeam = nextServer <= 2 ? 1 : 2;
          updateMatchState({
            ...matchState,
            player1Score: 0,
            player2Score: 0,
            serving: nextServingTeam,
            currentServer: nextServer,
          });
        } else {
          // Singles or no custom rotation: winner serves next
          updateMatchState({
            ...matchState,
            player1Score: 0,
            player2Score: 0,
            serving: player,
          });
        }
        setTimeout(() => setIsAnimating(false), 500);
      }
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <Layout 
      title="Squash"
      showBack={true}
      onBack={() => {
        endMatch();
        setStateHistory([]);
        goBack();
      }}
    >
      <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{gamesWon[0]}</div>
              <div className="text-xs text-gray-500">Games</div>
            </div>
            <div className="text-gray-600 dark:text-gray-400">-</div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{gamesWon[1]}</div>
              <div className="text-xs text-gray-500">Games</div>
            </div>
          </div>
          <Timer startTime={currentMatch.startTime} />
        </div>

        <div className="space-y-4">
          <PlayerButton
            name={currentMatch.player1Name}
            score={matchState.player1Score}
            onClick={() => handlePoint(1)}
            disabled={isAnimating}
            color={currentMatch.team1Color || 'navy'}
          />

          <PlayerButton
            name={currentMatch.player2Name}
            score={matchState.player2Score}
            onClick={() => handlePoint(2)}
            disabled={isAnimating}
            color={currentMatch.team2Color || 'blue'}
          />
        </div>

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
                updateMatchState({
                  ...matchState,
                  player1Score: 0,
                  player2Score: 0,
                  serving: matchState.serving,
                });
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
