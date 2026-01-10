/* This file is required for Payload to work */
import configPromise from '@/payload.config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={null as any}>
      {children}
    </RootLayout>
  )
}
