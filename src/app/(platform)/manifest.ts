import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EKA Account',
    short_name: 'EKA',
    description: 'AI-assisted wellness and therapist platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/eka_logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}

