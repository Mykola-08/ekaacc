import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SimpleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function SimpleButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}: SimpleButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }}
    >
      {children}
    </motion.button>
  );
}

interface SimpleLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
}

export function SimpleLink({ 
  children, 
  to, 
  href,
  onClick, 
  className = '',
  target,
  rel
}: SimpleLinkProps) {
  return (
    <motion.a
      href={href || to}
      onClick={onClick}
      className={className}
      target={target}
      rel={rel}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }}
    >
      {children}
    </motion.a>
  );
}
