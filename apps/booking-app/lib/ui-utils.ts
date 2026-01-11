// Apple-like UI Utilities

/**
 * Returns a smooth spring transition for framer-motion that mimics iOS interactions
 */
export const iosSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

/**
 * Returns properties for a glassmorphism effect
 */
export const glassEffect = "bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/10";

/**
 * Returns properties for a subtle Apple-like shadow
 */
export const appleShadow = "shadow-[0_8px_30px_rgb(0,0,0,0.12)]";
