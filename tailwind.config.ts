import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class', 'class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/keep-react/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			],
  			heading: [
  				'Inter',
  				'system-ui',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			],
  			display: [
  				'Inter',
  				'system-ui',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			gradient: {
  				primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  				secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  				accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  				glow: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)'
  			},
  			glow: {
  				pink: '#ff6b6b',
  				yellow: '#feca57',
  				blue: '#48dbfb',
  				purple: '#a55eea',
  				green: '#26de81'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
    		borderRadius: {
    			xl: 'calc(var(--radius) + 4px)',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 4px)',
    			sm: 'calc(var(--radius) - 8px)'
    		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem'
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					'max-width': 'none',
  					color: 'inherit',
  					'line-height': '1.6'
  				}
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-up': {
  				'0%': {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'gradient': {
  				'0%': {
  					'background-position': '0% 50%'
  				},
  				'50%': {
  					'background-position': '100% 50%'
  				},
  				'100%': {
  					'background-position': '0% 50%'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'shimmer-button': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'blur-in': {
  				'0%': {
  					filter: 'blur(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					filter: 'blur(0px)',
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s ease-out',
  			'slide-up': 'slide-up 0.3s ease-out',
  			'scale-in': 'scale-in 0.2s ease-out',
  			'gradient': 'gradient 3s ease infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'shimmer-button': 'shimmer-button 2s linear infinite',
  			'blur-in': 'blur-in 0.4s ease-out'
  		},
  		backdropBlur: {
  			xs: '2px',
  			sm: '4px',
  			md: '8px',
  			lg: '12px',
  			xl: '16px',
  			'2xl': '24px',
  			'3xl': '32px'
  		},
  		screens: {
  			xs: '475px',
  			'3xl': '1920px'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
