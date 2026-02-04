import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAppStore } from '../store/useAppStore';
import type { Settings } from '../types';

export default function Settings() {
  const { settings, updateSettings } = useAppStore();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
  };

  const handleToggle = (key: keyof Settings, value: boolean) => {
    updateSettings({ [key]: value } as Partial<Settings>);
  };

  const handleVolumeChange = (volume: number) => {
    updateSettings({ volume });
  };

  return (
    <Layout title="Settings" showSettings={false}>
      <div className="space-y-4 sm:space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🎨</span>
            <span>Appearance</span>
          </h2>
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 border border-gray-200 dark:border-navy-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                {(['light', 'dark'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      settings.theme === theme
                        ? 'bg-gradient-to-r from-lime-400 to-yellow-400 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sound & Haptics */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔊</span>
            <span>Sound & Haptics</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 border border-gray-200 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sound Effects</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggle('soundEnabled', !settings.soundEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Vibration</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggle('vibrationEnabled', !settings.vibrationEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.vibrationEnabled ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </motion.button>
            </div>

            {settings.soundEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </motion.div>
        </section>

        {/* Match Defaults */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Match Defaults</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 border border-gray-200 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Auto-save matches</span>
              <button
                onClick={() => handleToggle('autoSaveMatches', !settings.autoSaveMatches)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoSaveMatches ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoSaveMatches ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Confirm resets</span>
              <button
                onClick={() => handleToggle('confirmResets', !settings.confirmResets)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.confirmResets ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.confirmResets ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Sport-specific settings */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Sport Settings</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-6 border border-gray-200 dark:border-navy-700"
          >
            {/* Tennis */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Tennis</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Match Format
                  </label>
                  <div className="flex gap-2">
                    {(['best-of-3', 'best-of-5'] as const).map((format) => (
                      <motion.button
                        key={format}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          updateSettings({
                            tennis: { ...settings.tennis, matchFormat: format },
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.tennis.matchFormat === format
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {format === 'best-of-3' ? 'Best of 3' : 'Best of 5'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scoring
                  </label>
                  <div className="flex gap-2">
                    {(['standard', 'no-ad'] as const).map((scoring) => (
                      <motion.button
                        key={scoring}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          updateSettings({
                            tennis: { ...settings.tennis, scoring },
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.tennis.scoring === scoring
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {scoring === 'standard' ? 'Standard' : 'No-Ad'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Tiebreak</span>
                  <button
                    onClick={() =>
                      updateSettings({
                        tennis: { ...settings.tennis, tiebreak: !settings.tennis.tiebreak },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.tennis.tiebreak ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.tennis.tiebreak ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Tennis */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Table Tennis</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Match Format
                </label>
                <div className="flex gap-2">
                  {(['best-of-3', 'best-of-5', 'best-of-7'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() =>
                        updateSettings({
                          tableTennis: { ...settings.tableTennis, matchFormat: format },
                        })
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        settings.tableTennis.matchFormat === format
                          ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {format === 'best-of-3' ? 'Best of 3' : format === 'best-of-5' ? 'Best of 5' : 'Best of 7'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Squash */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Squash</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Match Format
                </label>
                <div className="flex gap-2">
                  {(['best-of-3', 'best-of-5'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() =>
                        updateSettings({
                          squash: { ...settings.squash, matchFormat: format },
                        })
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        settings.squash.matchFormat === format
                          ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {format === 'best-of-3' ? 'Best of 3' : 'Best of 5'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pickleball */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Pickleball</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mode
                  </label>
                  <div className="flex gap-2">
                    {(['singles', 'doubles'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          updateSettings({
                            pickleball: { ...settings.pickleball, mode },
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.pickleball.mode === mode
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Score
                  </label>
                  <div className="flex gap-2">
                    {([11, 15, 21] as const).map((score) => (
                      <button
                        key={score}
                        onClick={() =>
                          updateSettings({
                            pickleball: { ...settings.pickleball, targetScore: score },
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.pickleball.targetScore === score
                            ? 'bg-navy-800 dark:bg-gradient-to-r dark:from-lime-400 dark:to-yellow-400 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            <span>About</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-3 border border-gray-200 dark:border-navy-700"
          >
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium mb-1 text-gray-900 dark:text-white">Version: 1.0.0</div>
              <div>Professional score tracking for racket sports</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Tutorial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Privacy Policy
            </motion.button>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (confirm('Reset all settings to defaults?')) {
                // Reset logic
              }
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Reset All Settings
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
