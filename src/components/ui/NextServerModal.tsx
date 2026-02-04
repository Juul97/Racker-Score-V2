import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NextServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (server: 1 | 2 | 3 | 4) => void;
  player1Name: string;
  player2Name: string;
  player3Name?: string;
  player4Name?: string;
  otherTeam: 1 | 2; // The team that didn't win (will serve first in next game)
}

export default function NextServerModal({
  isOpen,
  onClose,
  onSelect,
  player1Name,
  player2Name,
  player3Name,
  player4Name,
  otherTeam,
}: NextServerModalProps) {
  const [selectedServer, setSelectedServer] = useState<1 | 2 | 3 | 4 | null>(null);

  const isDoubles = !!(player3Name && player4Name);

  // Get the players from the other team
  const otherTeamPlayers = otherTeam === 1 
    ? [
        { number: 1 as const, name: player1Name },
        { number: 3 as const, name: player3Name || 'Team 1 Player 2' },
      ]
    : [
        { number: 2 as const, name: player2Name },
        { number: 4 as const, name: player4Name || 'Team 2 Player 2' },
      ];

  const handleConfirm = () => {
    if (selectedServer) {
      onSelect(selectedServer);
      onClose();
    }
  };

  if (!isOpen || !isDoubles) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-navy-900 bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select First Server
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="Close"
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

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Who will serve first in the next game?
            </p>

            {/* Player Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {otherTeamPlayers.map((player) => (
                <button
                  key={player.number}
                  onClick={() => setSelectedServer(player.number)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedServer === player.number
                      ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>

            {/* Confirm Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              disabled={!selectedServer}
              className="w-full px-6 py-4 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
