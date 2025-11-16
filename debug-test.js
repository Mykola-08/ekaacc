// Use ts-node to run TypeScript directly
require('ts-node/register');

const { simpleAI } = require('./src/ai/simple-ai-service');
const { tieredAI } = require('./src/ai/tiered-ai-service');

async function debugTest() {
  console.log('=== Debugging Tiered AI Service ===');
  
  // Test simple AI service directly
  console.log('\n1. Testing simple AI service directly:');
  const simpleRequest = {
    input: 'I need therapy support',
    context: { userId: 'test123' }
  };
  
  try {
    const simpleResponse = await simpleAI.generateResponse(simpleRequest);
    console.log('Simple AI response:', simpleResponse);
  } catch (error) {
    console.error('Simple AI error:', error);
  }
  
  // Test tiered AI service
  console.log('\n2. Testing tiered AI service:');
  const tieredRequest = {
    input: 'I need therapy support',
    context: { userId: 'test123' },
    tier: 'basic',
    priority: 'medium'
  };
  
  try {
    const tieredResponse = await tieredAI.generateResponse(tieredRequest);
    console.log('Tiered AI response:', tieredResponse);
  } catch (error) {
    console.error('Tiered AI error:', error);
  }
}

debugTest().catch(console.error);