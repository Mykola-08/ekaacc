// Apple-like UI Utilities

/**
 * Returns a smooth spring transition for framer-motion that mimics iOS interactions
 */
export const iosSpring = {
  type: "spring",
  stiffness: 500,
  damping: 30
};

/**
 * Returns properties for a glassmorphism effect
 * Updated for a cleaner, Apple-like aesthetic (white with blur)
 */
export const glassEffect = "bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm support-[backdrop-filter]:bg-white/60";

/**
 * Returns properties for a subtle Apple-like shadow
 */
export const appleShadow = "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300";

/**
 * Common motion variants for dashboard items
 */
export const dashboardItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: iosSpring 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  }
};

