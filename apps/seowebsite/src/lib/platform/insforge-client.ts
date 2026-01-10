// @ts-expect-error - InsForge type definitions are missing - Module not available, using placeholder
// import { createClient } from '@insforge/js-client'

// InsForge configuration from your deployed instance
const insforgeUrl = 'https://3q92sfa9.us-east.insforge.app'
const insforgeApiKey = 'ik_9117db000434483d140bc688cb7c8abd'

// Placeholder client until module is available
const createPlaceholderClient = (config: any) => ({
  get: async (path: string) => ({ status: 'ok' }),
  post: async (path: string, data: any) => ({ status: 'ok' }),
  put: async (path: string, data: any) => ({ status: 'ok' }),
  delete: async (path: string) => ({ status: 'ok' })
})

// Create InsForge client
export const insforge = createPlaceholderClient({
  baseURL: insforgeUrl,
  apiKey: insforgeApiKey,
  headers: {
    'x-application-name': 'ekaacc-app',
  },
})

// Helper function to check InsForge connection
export const checkInsForgeConnection = async () => {
  try {
    const response = await insforge.get('/health')
    return response.status === 'ok'
  } catch (error) {
    console.error('InsForge connection failed:', error)
    return false
  }
}

export default insforge