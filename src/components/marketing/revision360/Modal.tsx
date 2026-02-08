import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
    lg: 'max-w-xl sm:max-w-2xl lg:max-w-4xl',
    xl: 'max-w-2xl sm:max-w-4xl lg:max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              className={`relative w-full ${sizeClasses[size]} transform rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl shadow-amber-500/10`}
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 50,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Golden glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 blur-sm"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="relative p-6 sm:p-8 lg:p-10">
                {title && (
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-amber-100">{title}</h3>
                    <button
                      onClick={onClose}
                      className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {!title && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}

                <div className="text-zinc-300">{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
