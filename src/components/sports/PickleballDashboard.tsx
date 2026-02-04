import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout';
import Timer from '../Timer';
import PlayerButton from '../PlayerButton';
import { useAppStore } from '../../store/useAppStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { incrementPickleballScore } from '../../utils/scoring';
import type { PickleballState } from '../../types';
import PlayerSetupModal from '../ui/PlayerSetupModal';

export default function PickleballDashboard() {
  const { currentMatch, updateMatchState, settings, endMatch } = useAppStore();
  const { goBack } = useNavigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [gamesWon, setGamesWon] = useState<[number, number]>([0, 0]);
  const [showModal, setShowModal] = useState(false);
  const [isDoubles, setIsDoubles] = useState(settings.pickleball.mode === 'doubles');
  const [stateHistory, setStateHistory] = useState<PickleballState[]>([]);

  // Check if doubles mode - needed in both no-match and active-match sections
  const isDoublesActive = settings.pickleball.mode === 'doubles';

  if (!currentMatch || currentMatch.sport !== 'pickleball') {
      return (
      <Layout title="Pickleball">
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
            useAppStore.getState().startMatch(
              'pickleball',
              player1Name,
              player2Name,
              isDoubles ? player3Name : undefined,
              isDoubles ? player4Name : undefined,
              firstServer,
              secondServer,
              team1Color,
              team2Color
            );
          }}
          sport="pickleball"
          isDoubles={isDoubles}
          onModeChange={setIsDoubles}
          supportsDoubles={true}
        />
      </Layout>
    );
  }

  const matchState = currentMatch.state as PickleballState;
  const targetScore = settings.pickleball.targetScore;

  const handlePoint = async (team: 1 | 2) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    // Save current state to history for undo
    setStateHistory(prev => [...prev, JSON.parse(JSON.stringify(matchState))]);
    
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const result = incrementPickleballScore(matchState, team, targetScore);
    updateMatchState(result.newState);

    if (result.gameWon) {
      const newGamesWon: [number, number] = [...gamesWon];
      if (team === 1) {
        newGamesWon[0]++;
      } else {
        newGamesWon[1]++;
      }
      setGamesWon(newGamesWon);

      if (newGamesWon[0] >= 2 || newGamesWon[1] >= 2) {
        setTimeout(() => {
          setIsAnimating(false);
          // Navigate to match summary
        }, 1000);
      } else {
        updateMatchState({
          serverScore: 0,
          receiverScore: 0,
          serverNumber: 1,
          serving: team === 1 ? 2 : 1, // Alternate serve
          isFirstServe: true,
        });
        setTimeout(() => setIsAnimating(false), 500);
      }
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const scoreCall = `${matchState.serverScore} - ${matchState.receiverScore}${isDoublesActive ? ` - ${matchState.serverNumber}` : ''}`;
  const servingTeam = matchState.serving === 1 ? currentMatch.player1Name : currentMatch.player2Name;
  const receivingTeam = matchState.serving === 1 ? currentMatch.player2Name : currentMatch.player1Name;

  return (
    <Layout 
      title="Pickleball"
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

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-navy-800 rounded-2xl p-4 text-center shadow-md border border-gray-200 dark:border-navy-700"
        >
          <div className="text-sm font-semibold text-navy-800 dark:text-lime-400">
            Score Call: {scoreCall}
          </div>
        </motion.div>

        <div className="space-y-4">
          <PlayerButton
            name={servingTeam}
            score={matchState.serverScore}
            serving={true}
            servingIcon="🥎"
            onClick={() => handlePoint(matchState.serving)}
            disabled={isAnimating}
            color={matchState.serving === 1 ? (currentMatch.team1Color || 'navy') : (currentMatch.team2Color || 'blue')}
          />

          <PlayerButton
            name={receivingTeam}
            score={matchState.receiverScore}
            onClick={() => handlePoint(matchState.serving === 1 ? 2 : 1)}
            disabled={isAnimating}
            color={matchState.serving === 1 ? (currentMatch.team2Color || 'blue') : (currentMatch.team1Color || 'navy')}
          />
        </div>

        {isDoublesActive && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Server #{matchState.serverNumber} serving
          </div>
        )}

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
                  serverScore: 0,
                  receiverScore: 0,
                  serverNumber: matchState.serverNumber,
                  serving: matchState.serving,
                  isFirstServe: true,
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
