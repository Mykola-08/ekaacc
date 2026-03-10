import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useScrollLock } from '@/marketing/hooks/useScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useScrollLock(isOpen);

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
    xl: 'max-w-2xl sm:max-w-4xl lg:max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div 
            className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8"
            onClick={onClose}
          >
            <motion.div
              className={`relative w-full ${sizeClasses[size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : size]} transform rounded-2xl bg-white border border-gray-200  `}
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0, 
                scale: 0.95,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: 20
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4
              }}
            >
              <div className="relative p-6 sm:p-8 lg:p-10">
                {title && (
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="rounded-full bg-gray-100 p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
                
                <div className="text-gray-600">
                  {children}
                </div>
                
                {!title && (
                  <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
