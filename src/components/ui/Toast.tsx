import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${typeStyles[type]} flex items-center gap-2`}
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-80 transition-opacity"
            aria-label="Close"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
