const { simpleAI } = require('./src/ai/simple-ai-service');

async function testSimpleAI() {
  try {
    console.log('Testing simple AI service...');
    
    const request = {
      input: 'I need therapy support',
      context: { userId: 'test-user' }
    };
    
    console.log('Request:', request);
    const response = await simpleAI.generateResponse(request);
    console.log('Response:', response);
    
    if (!response) {
      console.log('ERROR: Response is undefined!');
    } else {
      console.log('SUCCESS: Response received:', response);
    }
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
  }
}

testSimpleAI();