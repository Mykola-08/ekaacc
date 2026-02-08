import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/platform/utils/css-utils'
import { ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'

const premiumHeroVariants = cva(
  'relative overflow-hidden bg-linear-to-br',
  {
    variants: {
      variant: {
        default: 'from-primary-50 via-white to-secondary-50',
        dark: 'from-neutral-900 via-neutral-800 to-neutral-900',
        gradient: 'from-primary-600 via-primary-700 to-secondary-600',
        glass: 'from-white/10 via-white/5 to-transparent backdrop-blur-3xl',
        minimal: 'from-white to-neutral-50',
        premium: 'from-neutral-900 via-primary-900 to-neutral-900',
      },
      size: {
        sm: 'min-h-[50vh] py-16',
        md: 'min-h-[70vh] py-24',
        lg: 'min-h-[90vh] py-32',
        xl: 'min-h-[100vh] py-40',
        full: 'min-h-screen py-20',
      },
      layout: {
        centered: 'flex items-center justify-center text-center',
        left: 'flex items-center text-left',
        right: 'flex items-center justify-end text-right',
        split: 'grid lg:grid-cols-2 gap-12 items-center',
      },
      rounded: {
        true: 'rounded-3xl',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
      layout: 'centered',
      rounded: false,
    },
  }
)

const premiumHeroContentVariants = cva(
  'relative z-10 max-w-4xl mx-auto',
  {
    variants: {
      variant: {
        default: 'text-neutral-900',
        dark: 'text-white',
        gradient: 'text-white',
        glass: 'text-white',
        minimal: 'text-neutral-900',
        premium: 'text-white',
      },
      animation: {
        none: '',
        fadeIn: 'animate-[fadeIn_1s_ease-out]',
        slideUp: 'animate-[slideUp_0.8s_ease-out]',
        scaleIn: 'animate-[scaleIn_0.6s_ease-out]',
        stagger: 'animate-[stagger_1.2s_ease-out]',
      },
    },
    defaultVariants: {
      variant: 'default',
      animation: 'fadeIn',
    },
  }
)

const premiumHeroTitleVariants = cva(
  'font-bold tracking-tight bg-linear-to-r bg-clip-text text-transparent',
  {
    variants: {
      size: {
        sm: 'text-3xl md:text-4xl lg:text-5xl',
        md: 'text-4xl md:text-5xl lg:text-6xl',
        lg: 'text-5xl md:text-6xl lg:text-7xl',
        xl: 'text-6xl md:text-7xl lg:text-8xl',
      },
      gradient: {
        none: '',
        primary: 'from-primary-600 to-primary-800',
        secondary: 'from-secondary-600 to-secondary-800',
        accent: 'from-accent-600 to-accent-800',
        white: 'from-white to-neutral-200',
        black: 'from-neutral-900 to-neutral-700',
      },
      weight: {
        normal: 'font-bold',
        light: 'font-light',
        medium: 'font-medium',
        semibold: 'font-semibold',
        extrabold: 'font-extrabold',
      },
    },
    defaultVariants: {
      size: 'lg',
      gradient: 'primary',
      weight: 'extrabold',
    },
  }
)

export interface PremiumHeroProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumHeroVariants> {
  title?: string
  subtitle?: string
  description?: string
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  backgroundImage?: string
  backgroundVideo?: string
  backgroundPattern?: 'dots' | 'lines' | 'grid' | 'waves' | 'none'
  showMediaControls?: boolean
  particles?: boolean
  floatingElements?: boolean
  stats?: HeroStat[]
  features?: string[]
  trustIndicators?: TrustIndicator[]
  animationDelay?: number
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

export interface HeroAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

export interface HeroStat {
  value: string | number
  label: string
  suffix?: string
  prefix?: string
}

export interface TrustIndicator {
  text: string
  icon?: React.ReactNode
  image?: string
}

const PremiumHero = React.forwardRef<HTMLDivElement, PremiumHeroProps>(
  ({ 
    className, 
    variant, 
    size, 
    layout, 
    rounded,
    title = "Transform Your Digital Experience",
    subtitle,
    description = "Discover the perfect blend of premium design and cutting-edge technology that elevates your brand to new heights.",
    primaryAction,
    secondaryAction,
    backgroundImage,
    backgroundVideo,
    backgroundPattern = 'none',
    showMediaControls = false,
    particles = false,
    floatingElements = false,
    stats = [],
    features = [],
    trustIndicators = [],
    animationDelay = 0,
    onPrimaryAction,
    onSecondaryAction,
    children,
    ...props 
  }, ref) => {
    const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
    const [isMuted, setIsMuted] = React.useState(true)
    const [scrollProgress, setScrollProgress] = React.useState(0)
    const videoRef = React.useRef<HTMLVideoElement>(null)

    // Handle scroll progress
    React.useEffect(() => {
      const handleScroll = () => {
        const scrolled = window.scrollY
        const maxScroll = window.innerHeight
        const progress = Math.min(scrolled / maxScroll, 1)
        setScrollProgress(progress)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle video playback
    const toggleVideoPlayback = () => {
      if (videoRef.current) {
        if (isVideoPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsVideoPlaying(!isVideoPlaying)
      }
    }

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
    }

    // Background pattern
    const renderBackgroundPattern = () => {
      if (backgroundPattern === 'none') return null

      const patterns = {
        dots: (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        ),
        lines: (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(45deg, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>
        ),
        grid: (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        ),
        waves: (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path d="M0,200 Q250,100 500,200 T1000,200 V1000 H0 Z" fill="currentColor" />
            </svg>
          </div>
        ),
      }

      return patterns[backgroundPattern]
    }

    // Floating elements
    const renderFloatingElements = () => {
      if (!floatingElements) return null

      return (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary-400 rounded-full animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent-400 rounded-full animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary-300 rounded-full animate-float-delayed" />
        </>
      )
    }

    // Particles effect
    const renderParticles = () => {
      if (!particles) return null

      return (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-card/20 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <section
        ref={ref}
        className={cn(
          premiumHeroVariants({ variant, size, layout, rounded }),
          className
        )}
        {...props}
      >
        {/* Background Media */}
        {backgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/40 to-black/20" />
          </div>
        )}

        {backgroundVideo && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              src={backgroundVideo}
              autoPlay
              muted={isMuted}
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/50 to-black/30" />
            
            {showMediaControls && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleVideoPlayback}
                  className="p-2 bg-card/20 backdrop-blur-md rounded-full text-white hover:bg-card/30 transition-colors"
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 bg-card/20 backdrop-blur-md rounded-full text-white hover:bg-card/30 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Background Pattern */}
        {renderBackgroundPattern()}

        {/* Floating Elements */}
        {renderFloatingElements()}

        {/* Particles */}
        {renderParticles()}

        {/* Scroll Progress Indicator */}
        {scrollProgress > 0 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-card/10">
            <div 
              className="h-full bg-linear-to-r from-primary-500 to-secondary-500 transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className={cn(premiumHeroContentVariants({ variant }))}>
          <div className="space-y-6">
            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg md:text-xl font-medium text-primary-600 mb-4 animate-fade-in-up">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className={cn(
              premiumHeroTitleVariants({ gradient: variant === 'dark' || variant === 'premium' ? 'white' : 'primary' }),
              "animate-fade-in-up"
            )}>
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className={cn(
                "text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up",
                (variant === 'dark' || variant === 'premium' || variant === 'gradient') && "text-white/80"
              )}>
                {description}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-card/10 backdrop-blur-md rounded-full border border-white/20 text-sm"
                  >
                    <div className="w-2 h-2 bg-primary-400 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up">
                {primaryAction && (
                  <button
                    onClick={onPrimaryAction}
                    disabled={primaryAction.disabled || primaryAction.loading}
                    className={cn(
                      "inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform",
                      "bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl",
                      "focus:outline-none focus:ring-4 focus:ring-primary-500/30",
                      (primaryAction.disabled || primaryAction.loading) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {primaryAction.loading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>{primaryAction.label}</span>
                    {primaryAction.icon || <ArrowRight className="w-5 h-5" />}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={onSecondaryAction}
                    disabled={secondaryAction.disabled || secondaryAction.loading}
                    className={cn(
                      "inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform",
                      "border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-card/50",
                      "focus:outline-none focus:ring-4 focus:ring-neutral-500/20",
                      (secondaryAction.disabled || secondaryAction.loading) && "opacity-50 cursor-not-allowed",
                      (variant === 'dark' || variant === 'premium' || variant === 'gradient') && "border-white/30 text-white hover:bg-card/10"
                    )}
                  >
                    {secondaryAction.loading && (
                      <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    )}
                    <span>{secondaryAction.label}</span>
                    {secondaryAction.icon}
                  </button>
                )}
              </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20 animate-fade-in-up">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Trust Indicators */}
            {trustIndicators.length > 0 && (
              <div className="flex flex-wrap gap-6 justify-center items-center pt-8 animate-fade-in-up">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                    {indicator.icon}
                    {indicator.image && (
                      <Image
                        src={indicator.image}
                        alt={indicator.text}
                        width={60}
                        height={20}
                        className="opacity-70"
                      />
                    )}
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </div>
            )}

            {children}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-card/60 rounded-full mt-2 animate-scroll-indicator" />
          </div>
        </div>
      </section>
    )
  }
)

PremiumHero.displayName = 'PremiumHero'

export { PremiumHero, premiumHeroVariants, premiumHeroContentVariants, premiumHeroTitleVariants }

// Add custom animations to global styles
const heroStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

@keyframes stagger {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes particle {
  0% { 
    opacity: 0; 
    transform: translateY(0px) scale(0); 
  }
  10% { 
    opacity: 1; 
    transform: translateY(-10px) scale(1); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(-100px) scale(0); 
  }
}

@keyframes scroll-indicator {
  0% { transform: translateY(0); }
  100% { transform: translateY(8px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-particle {
  animation: particle 3s ease-out infinite;
}

.animate-fade-in-up {
  animation: slideUp 0.8s ease-out both;
}

.animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
.animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
.animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
.animate-fade-in-up:nth-child(4) { animation-delay: 0.4s; }
.animate-fade-in-up:nth-child(5) { animation-delay: 0.5s; }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = heroStyles
  document.head.appendChild(styleElement)
}
