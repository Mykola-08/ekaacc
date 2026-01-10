"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface BlurInProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  blurAmount?: number
}

export function BlurIn({ 
  children, 
  className, 
  duration = 0.6, 
  delay = 0,
  blurAmount = 8 
}: BlurInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blurAmount}px)` }}
      animate={isVisible ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}