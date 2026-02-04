import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout';
import Timer from '../Timer';
import PlayerButton from '../PlayerButton';
import { useAppStore } from '../../store/useAppStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { incrementRallyScore } from '../../utils/scoring';
import type { RallyScoreState } from '../../types';
import PlayerSetupModal from '../ui/PlayerSetupModal';
import NextServerModal from '../ui/NextServerModal';
import { getNextServerInCustomRotation } from '../../utils/servingRotation';

export default function BadmintonDashboard() {
  const { currentMatch, updateMatchState, settings, endMatch } = useAppStore();
  const { goBack } = useNavigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [gamesWon, setGamesWon] = useState<[number, number]>([0, 0]);
  const [currentGame, setCurrentGame] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isDoubles, setIsDoubles] = useState(false);
  const [stateHistory, setStateHistory] = useState<RallyScoreState[]>([]);
  const [showNextServerModal, setShowNextServerModal] = useState(false);
  const [pendingGameReset, setPendingGameReset] = useState<{ winningTeam: 1 | 2 } | null>(null);

  if (!currentMatch || currentMatch.sport !== 'badminton') {
      return (
      <Layout title="Badminton">
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-md border border-gray-200 dark:border-navy-700"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">No active match</p>
            
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Game Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDoubles(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Singles (2 Players)
                </button>
                <button
                  onClick={() => {
                    setIsDoubles(true);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Doubles (4 Players)
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Player Setup Modal */}
        <PlayerSetupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onStart={(player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color) => {
            useAppStore.getState().startMatch('badminton', player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color);
          }}
          sport="badminton"
          isDoubles={isDoubles}
          onModeChange={setIsDoubles}
          supportsDoubles={true}
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

    const isDoublesMatch = !!(currentMatch.player3Name && currentMatch.player4Name);
    const result = incrementRallyScore(matchState, player, 21, 30, isDoublesMatch);
    updateMatchState(result.newState);

    if (result.gameWon) {
      // Update games won
      const newGamesWon: [number, number] = [...gamesWon];
      if (player === 1) {
        newGamesWon[0]++;
      } else {
        newGamesWon[1]++;
      }
      setGamesWon(newGamesWon);

      // Check match win (best of 3)
      if (newGamesWon[0] >= 2 || newGamesWon[1] >= 2) {
        // Match won
        setTimeout(() => {
          setIsAnimating(false);
          // Navigate to match summary
        }, 1000);
      } else {
        // Start new game
        const isDoublesMatch = !!(currentMatch.player3Name && currentMatch.player4Name);
        if (isDoublesMatch) {
          // For doubles, use custom rotation if secondServer is defined
          if (matchState.firstServer && matchState.secondServer && matchState.currentServer) {
            // Use custom rotation
            const nextServer = getNextServerInCustomRotation(
              matchState.firstServer,
              matchState.secondServer,
              matchState.currentServer
            );
            const nextServingTeam = nextServer <= 2 ? 1 : 2;
            setCurrentGame(currentGame + 1);
            updateMatchState({
              ...matchState,
              player1Score: 0,
              player2Score: 0,
              serving: nextServingTeam,
              currentServer: nextServer,
            });
          } else {
            // Show modal to select who serves first from the other team
            setPendingGameReset({ winningTeam: player });
            setShowNextServerModal(true);
          }
        } else {
          // Singles: winner serves next
          setCurrentGame(currentGame + 1);
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
      title="Badminton"
      showBack={true}
      onBack={() => {
        endMatch();
        setStateHistory([]);
        goBack();
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Games Won</div>
            <div className="text-4xl font-bold text-navy-800 dark:text-lime-400">{gamesWon[0]}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Current Game</div>
            <div className="text-4xl font-bold text-navy-800 dark:text-lime-400">{currentGame}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Match Time</div>
            <div className="text-2xl font-bold text-navy-800 dark:text-lime-400">
              <Timer startTime={currentMatch.startTime} />
            </div>
          </motion.div>
        </div>

        {/* Side switch reminder at 11 points */}
        {(matchState.player1Score === 11 || matchState.player2Score === 11) && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 text-center shadow-md border border-gray-200 dark:border-navy-700"
          >
            <div className="text-sm font-semibold text-navy-800 dark:text-lime-400">
              Switch sides at 11 points
            </div>
          </motion.div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <PlayerButton
            name={currentMatch.player1Name}
            score={matchState.player1Score}
            serving={matchState.serving === 1}
            servingIcon="🏸"
            onClick={() => handlePoint(1)}
            disabled={isAnimating}
            color={currentMatch.team1Color || 'navy'}
          />

          <PlayerButton
            name={currentMatch.player2Name}
            score={matchState.player2Score}
            serving={matchState.serving === 2}
            servingIcon="🏸"
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

      {/* Next Server Selection Modal (for doubles when game ends) */}
      {currentMatch && pendingGameReset && (
        <NextServerModal
          isOpen={showNextServerModal}
          onClose={() => {
            setShowNextServerModal(false);
            setPendingGameReset(null);
          }}
          onSelect={(server) => {
            setCurrentGame(currentGame + 1);
            updateMatchState({
              ...matchState,
              player1Score: 0,
              player2Score: 0,
              serving: server <= 2 ? 1 : 2,
              currentServer: server,
            });
            setShowNextServerModal(false);
            setPendingGameReset(null);
          }}
          player1Name={currentMatch.player1Name}
          player2Name={currentMatch.player2Name}
          player3Name={currentMatch.player3Name}
          player4Name={currentMatch.player4Name}
          otherTeam={pendingGameReset.winningTeam === 1 ? 2 : 1}
        />
      )}
    </Layout>
  );
}
