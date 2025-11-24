/* This file is required for Payload to work */
import configPromise from '@/payload.config'
import { RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

export default function Page({ params, searchParams }: { params: Promise<{ segments: string[] }>, searchParams: Promise<{ [key: string]: string | string[] }> }) {
  return <RootPage config={configPromise} params={params} searchParams={searchParams} importMap={importMap} />
}
