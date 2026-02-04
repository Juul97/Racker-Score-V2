import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TeamColor = 'navy' | 'blue' | 'green' | 'red' | 'purple';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (player1Name: string, player2Name: string, player3Name?: string, player4Name?: string, firstServer?: 1 | 2 | 3 | 4, secondServer?: 1 | 2 | 3 | 4, team1Color?: TeamColor, team2Color?: TeamColor) => void;
  sport: string;
  isDoubles: boolean;
  onModeChange?: (isDoubles: boolean) => void;
  supportsDoubles?: boolean;
}

export default function PlayerSetupModal({
  isOpen,
  onClose,
  onStart,
  sport: _sport,
  isDoubles,
  onModeChange,
  supportsDoubles = false,
}: PlayerSetupModalProps) {
  const [localIsDoubles, setLocalIsDoubles] = useState(isDoubles);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player3Name, setPlayer3Name] = useState('Player 3');
  const [player4Name, setPlayer4Name] = useState('Player 4');
  const [firstServer, setFirstServer] = useState<1 | 2 | 3 | 4>(1);
  const [secondServer, setSecondServer] = useState<1 | 2 | 3 | 4>(2);
  const [team1Color, setTeam1Color] = useState<TeamColor>('navy');
  const [team2Color, setTeam2Color] = useState<TeamColor>('blue');
  
  const availableColors: { value: TeamColor; label: string; gradient: string; solidColor?: string }[] = [
    { value: 'navy', label: 'Navy', gradient: 'from-navy-800 to-navy-900', solidColor: 'bg-navy-800' },
    { value: 'blue', label: 'Blue', gradient: 'from-blue-500 to-blue-700' },
    { value: 'green', label: 'Green', gradient: 'from-green-500 to-green-700' },
    { value: 'red', label: 'Red', gradient: 'from-red-500 to-red-700' },
    { value: 'purple', label: 'Purple', gradient: 'from-purple-500 to-purple-700' },
  ];

  const handleModeSelect = (doubles: boolean) => {
    setLocalIsDoubles(doubles);
    if (onModeChange) {
      onModeChange(doubles);
    }
  };

  // Get available second server options (must be from the opposite team)
  const getSecondServerOptions = (): Array<{ value: 1 | 2 | 3 | 4; label: string }> => {
    if (!localIsDoubles) return [];
    const firstServerTeam = firstServer <= 2 ? 1 : 2;
    // Second server must be from the other team
    if (firstServerTeam === 1) {
      // First server is from Team 1, second must be from Team 2
      return [
        { value: 2, label: player2Name || 'Team 2 P1' },
        { value: 4, label: player4Name || 'Team 2 P2' },
      ];
    } else {
      // First server is from Team 2, second must be from Team 1
      return [
        { value: 1, label: player1Name || 'Team 1 P1' },
        { value: 3, label: player3Name || 'Team 1 P2' },
      ];
    }
  };

  const handleStart = () => {
    onStart(
      player1Name || 'Player 1',
      player2Name || 'Player 2',
      localIsDoubles ? (player3Name || 'Player 3') : undefined,
      localIsDoubles ? (player4Name || 'Player 4') : undefined,
      localIsDoubles ? firstServer : undefined,
      localIsDoubles ? secondServer : undefined,
      team1Color,
      team2Color
    );
    onClose();
  };

  // Initialize localIsDoubles when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalIsDoubles(isDoubles);
    }
  }, [isOpen, isDoubles]);

  // Reset secondServer when firstServer changes to ensure it's from the opposite team
  useEffect(() => {
    if (localIsDoubles) {
      const options = getSecondServerOptions();
      if (options.length > 0 && !options.some(opt => opt.value === secondServer)) {
        // Current secondServer is invalid, reset to first available option
        setSecondServer(options[0].value);
      }
    }
  }, [firstServer, localIsDoubles, player1Name, player2Name, player3Name, player4Name]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Setup Match
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

            {/* Game Mode Selection */}
            {supportsDoubles && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Game Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModeSelect(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      !localIsDoubles
                        ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                    }`}
                  >
                    Singles (2 Players)
                  </button>
                  <button
                    onClick={() => handleModeSelect(true)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      localIsDoubles
                        ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                    }`}
                  >
                    Doubles (4 Players)
                  </button>
                </div>
              </div>
            )}

            {/* Player Names Form */}
            <div className="mb-6">
              {localIsDoubles ? (
                // Doubles: 4 players in 2x2 grid with colors under each team
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Team 1
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Player 1
                        </label>
                        <input
                          type="text"
                          value={player1Name}
                          onChange={(e) => setPlayer1Name(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Player 2
                        </label>
                        <input
                          type="text"
                          value={player3Name}
                          onChange={(e) => setPlayer3Name(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                    {/* Team 1 Color Selection */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Team 1 Color
                      </label>
                      <div className="flex gap-3 items-center justify-center">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setTeam1Color(color.value)}
                            className={`w-10 h-10 rounded-full transition-all ${
                              team1Color === color.value
                                ? `${color.solidColor || `bg-gradient-to-r ${color.gradient}`} shadow-lg ring-4 ring-white`
                                : `${color.solidColor || `bg-gradient-to-r ${color.gradient}`} hover:scale-105 opacity-60 hover:opacity-100`
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Team 2
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Player 1
                        </label>
                        <input
                          type="text"
                          value={player2Name}
                          onChange={(e) => setPlayer2Name(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Player 2
                        </label>
                        <input
                          type="text"
                          value={player4Name}
                          onChange={(e) => setPlayer4Name(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                    {/* Team 2 Color Selection */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Team 2 Color
                      </label>
                      <div className="flex gap-3 items-center justify-center">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setTeam2Color(color.value)}
                            className={`w-10 h-10 rounded-full transition-all ${
                              team2Color === color.value
                                ? `${color.solidColor || `bg-gradient-to-r ${color.gradient}`} shadow-lg ring-4 ring-white`
                                : `${color.solidColor || `bg-gradient-to-r ${color.gradient}`} hover:scale-105 opacity-60 hover:opacity-100`
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Singles: everything stacked vertically - Player 1, then Player 1 Color, then Player 2, then Player 2 Color
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Player 1
                    </label>
                    <input
                      type="text"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                      placeholder="Enter name"
                    />
                  </div>
                  {/* Player 1 Color Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Player 1 Color
                    </label>
                    <div className="flex gap-3 items-center justify-center">
                      {availableColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setTeam1Color(color.value)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            team1Color === color.value
                              ? `bg-gradient-to-r ${color.gradient} shadow-lg ring-4 ring-white`
                              : `bg-gradient-to-r ${color.gradient} hover:scale-105 opacity-60 hover:opacity-100`
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Player 2
                    </label>
                    <input
                      type="text"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                      placeholder="Enter name"
                    />
                  </div>
                  {/* Player 2 Color Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Player 2 Color
                    </label>
                    <div className="flex gap-3 items-center justify-center">
                      {availableColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setTeam2Color(color.value)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            team2Color === color.value
                              ? `bg-gradient-to-r ${color.gradient} shadow-lg ring-4 ring-white`
                              : `bg-gradient-to-r ${color.gradient} hover:scale-105 opacity-60 hover:opacity-100`
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* First Server Selection (for doubles) */}
              {localIsDoubles && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Who serves first?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Team 1: Player 1 and Player 3 together */}
                      <button
                        onClick={() => setFirstServer(1)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          firstServer === 1
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player1Name || 'Team 1 P1'}
                      </button>
                      <button
                        onClick={() => setFirstServer(3)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          firstServer === 3
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player3Name || 'Team 1 P2'}
                      </button>
                      {/* Team 2: Player 2 and Player 4 together */}
                      <button
                        onClick={() => setFirstServer(2)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          firstServer === 2
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player2Name || 'Team 2 P1'}
                      </button>
                      <button
                        onClick={() => setFirstServer(4)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          firstServer === 4
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player4Name || 'Team 2 P2'}
                      </button>
                    </div>
                  </div>
                  {/* Second Server Selection (for doubles) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Who serves second?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Show all 4 players in same order: Team 1 (1, 3) then Team 2 (2, 4) */}
                      {/* Team 1: Player 1 and Player 3 */}
                      <button
                        onClick={() => {
                          const firstServerTeam = firstServer <= 2 ? 1 : 2;
                          if (firstServerTeam !== 1) {
                            setSecondServer(1);
                          }
                        }}
                        disabled={firstServer <= 2}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          secondServer === 1
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : firstServer <= 2
                            ? 'bg-gray-100 dark:bg-navy-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player1Name || 'Team 1 P1'}
                      </button>
                      <button
                        onClick={() => {
                          const firstServerTeam = firstServer <= 2 ? 1 : 2;
                          if (firstServerTeam !== 1) {
                            setSecondServer(3);
                          }
                        }}
                        disabled={firstServer <= 2}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          secondServer === 3
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : firstServer <= 2
                            ? 'bg-gray-100 dark:bg-navy-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player3Name || 'Team 1 P2'}
                      </button>
                      {/* Team 2: Player 2 and Player 4 */}
                      <button
                        onClick={() => {
                          const firstServerTeam = firstServer <= 2 ? 1 : 2;
                          if (firstServerTeam !== 2) {
                            setSecondServer(2);
                          }
                        }}
                        disabled={firstServer > 2}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          secondServer === 2
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : firstServer > 2
                            ? 'bg-gray-100 dark:bg-navy-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player2Name || 'Team 2 P1'}
                      </button>
                      <button
                        onClick={() => {
                          const firstServerTeam = firstServer <= 2 ? 1 : 2;
                          if (firstServerTeam !== 2) {
                            setSecondServer(4);
                          }
                        }}
                        disabled={firstServer > 2}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
                          secondServer === 4
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : firstServer > 2
                            ? 'bg-gray-100 dark:bg-navy-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-navy-600'
                        }`}
                      >
                        {player4Name || 'Team 2 P2'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Start Match Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full px-6 py-4 bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Match
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
