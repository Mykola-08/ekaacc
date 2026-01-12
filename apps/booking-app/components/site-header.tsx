'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Menu, X, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setUser(null)
  }

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/business', label: 'Corporate' },
    { href: '/pricing', label: 'Plans' },
    { href: '/journal', label: 'Journal' },
  ]

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
        variants={headerVariants as any}
        initial='hidden'
        animate='visible'
        className='fixed top-6 left-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-border bg-background/80 shadow-xl shadow-black/20 backdrop-blur-xl'
      >
        <div className='flex h-14 items-center px-4 md:px-6'>
          <Link href='/' className='mr-6 flex items-center space-x-2 font-serif font-bold tracking-tight text-lg text-foreground'>
            <span>EKA BALANCE</span>
          </Link>

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
             <div className='hidden md:flex items-center gap-2'>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant='ghost' size='sm' className='rounded-full hover:bg-muted'>
                     <Link href='/login'>Sign In</Link>
                  </Button>
                )}
                
                <Button asChild size='sm' className='rounded-full px-6 shadow-md shadow-primary/10 hover:shadow-lg transition-all'>
                  <Link href='/services'>Book Now</Link>
                </Button>
             </div>

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

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className='fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 p-4 rounded-[1.5rem] bg-background/95 backdrop-blur-2xl border border-border shadow-2xl flex flex-col gap-2 md:hidden'
        >
             {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileMenuOpen(false)}
                className='px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium text-foreground transition-colors'
              >
                {route.label}
              </Link>
            ))}
            <div className='h-px bg-border my-2' />
            {user ? (
              <>
                <Link href='/' onClick={() => setMobileMenuOpen(false)} className='px-4 py-3 text-sm font-medium text-foreground'>Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className='text-left px-4 py-3 text-sm font-medium text-destructive'>Sign Out</button>
              </>
            ) : (
              <Link href='/login' className='px-4 py-3 text-sm font-medium text-foreground'>Sign In</Link>
            )}
            <Button className='rounded-full w-full shadow-lg' onClick={() => setMobileMenuOpen(false)}>
              Book Now
            </Button>
        </motion.div>
      )}
    </>
  )
}
