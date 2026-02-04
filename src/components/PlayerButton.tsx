import { motion } from 'framer-motion';
import Ripple from './animations/Ripple';
import ScoreCounter from './animations/ScoreCounter';

interface PlayerButtonProps {
  name: string;
  score: string | number;
  serving?: boolean;
  servingIcon?: string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

export default function PlayerButton({
  name,
  score,
  serving = false,
  servingIcon = '🎾',
  onClick,
  color = 'primary',
  disabled = false,
}: PlayerButtonProps) {
  // Check if servingIcon is an SVG path (starts with / or contains .svg) or an emoji
  const isSvgIcon = typeof servingIcon === 'string' && (servingIcon.includes('.svg') || servingIcon.startsWith('/'));
  const colorGradients = {
    primary: 'from-navy-800 via-navy-800 to-navy-900',
    navy: 'from-navy-800 via-navy-800 to-navy-900',
    blue: 'from-blue-500 via-blue-600 to-blue-700',
    green: 'from-green-500 via-green-600 to-green-700',
    red: 'from-red-500 via-red-600 to-red-700',
    purple: 'from-purple-500 via-purple-600 to-purple-700',
  };

  const gradient = colorGradients[color as keyof typeof colorGradients] || colorGradients.primary;

  return (
    <Ripple className="rounded-2xl">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`
          w-full touch-target
          bg-gradient-to-br ${gradient}
          text-white
          rounded-2xl
          shadow-xl hover:shadow-2xl
          p-4 sm:p-6
          flex flex-col items-center justify-center
          transition-shadow duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          relative overflow-hidden
        `}
        style={{ borderRadius: '1rem' }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
        
        <motion.div
          className="text-lg font-semibold mb-2 relative z-10"
          animate={serving ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        >
          {name}
        </motion.div>
        
        <div className="score-display relative z-10 font-mono">
          <ScoreCounter value={score} />
        </div>
        
        {serving && (
          <motion.div
            className="mt-2 flex items-center gap-1 text-sm relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isSvgIcon ? (
              <motion.img
                src={servingIcon}
                alt="Serving"
                className="w-8 h-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              />
            ) : (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                {servingIcon}
              </motion.span>
            )}
            <span>Serving</span>
          </motion.div>
        )}
      </motion.button>
    </Ripple>
  );
}
