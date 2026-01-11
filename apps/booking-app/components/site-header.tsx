'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/business', label: 'Corporate' },
    { href: '/pricing', label: 'Plans' },
    { href: '/journal', label: 'Journal' },
  ]

  // Animation for the header dropping in
  const headerVariants = {
    hidden: { y: -100, opacity: 0, x: '-50%' },
    visible: { 
      y: 0, 
      opacity: 1, 
      x: '-50%',
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20, 
        mass: 1 
      }
    }
  }

  return (
    <>
      <motion.header 
        variants={headerVariants}
        initial='hidden'
        animate='visible'
        className='fixed top-6 left-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-white/20 bg-white/70 shadow-xl shadow-black/5 backdrop-blur-xl dark:bg-slate-900/70 dark:border-slate-800'
      >
        <div className='flex h-14 items-center px-4 md:px-6'>
          {/* Logo */}
          <Link href='/' className='mr-6 flex items-center space-x-2 font-serif font-bold tracking-tight text-lg'>
            <span>EKA BALANCE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center space-x-6 text-sm font-medium'>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'relative transition-colors hover:text-foreground/80 py-2',
                  pathname === route.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {route.label}
                {pathname === route.href && (
                  <motion.div
                    layoutId='activeNav'
                    className='absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground rounded-full'
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className='flex flex-1 items-center justify-end gap-2'>
             {/* CTA Buttons - Desktop */}
             <div className='hidden md:flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='rounded-full hover:bg-slate-100/50'>
                   <Link href='/login'>Sign In</Link>
                </Button>
                <Button asChild size='sm' className='rounded-full px-6 shadow-md shadow-blue-900/10 hover:shadow-lg transition-all'>
                  <Link href='/book/general'>Book Now</Link>
                </Button>
             </div>

             {/* Mobile Menu Toggle */}
             <Button 
                variant='ghost' 
                size='icon' 
                className='md:hidden rounded-full'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
                {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
             </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className='fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 p-4 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col gap-2 md:hidden'
        >
             {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileMenuOpen(false)}
                className='px-4 py-3 rounded-xl hover:bg-slate-100/50 text-sm font-medium text-slate-700 transition-colors'
              >
                {route.label}
              </Link>
            ))}
            <div className='h-px bg-slate-100 my-2' />
            <Link href='/login' className='px-4 py-3 text-sm font-medium'>Sign In</Link>
            <Button className='rounded-full w-full shadow-lg' onClick={() => setMobileMenuOpen(false)}>
              Book Now
            </Button>
        </motion.div>
      )}
    </>
  )
}

