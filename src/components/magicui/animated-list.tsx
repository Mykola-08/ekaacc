"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedListProps {
  children: ReactNode
  className?: string
  delay?: number
}

interface AnimatedListItemProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedList({ children, className, delay = 0 }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className, delay = 0 }: AnimatedListItemProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}