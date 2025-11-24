import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars BEFORE importing config
const vercelEnv = dotenv.config({ path: path.resolve(process.cwd(), '../../.env.vercel') })
const localEnv = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('Loaded .env.vercel:', vercelEnv.error ? 'Error' : 'Success')
console.log('Loaded .env.local:', localEnv.error ? 'Error' : 'Success')
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : 'Not Set')

async function init() {
  // Import config dynamically so env vars are loaded first
  const { default: config } = await import('../src/payload.config')
  
  console.log('Initializing Payload to force schema push...')
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized successfully.')
  } catch (error) {
    console.error('Failed to initialize Payload:', error)
    process.exit(1)
  }
  process.exit(0)
}

init()
