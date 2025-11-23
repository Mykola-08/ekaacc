import { execSync } from 'child_process';

const envVars = {
  AUTH0_CLIENT_ID: 'C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n',
  AUTH0_CLIENT_SECRET: 'z6ozyNNaE-x2FdeSZpTZYlaftphg0u9Y4hZzKM-XK_SUrccUyBuYw5NNi5DH-uhV',
  // Also set PROD_ variables just in case the client-side code needs them
  PROD_AUTH0_CLIENT_ID: 'C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n',
  PROD_AUTH0_CLIENT_SECRET: 'z6ozyNNaE-x2FdeSZpTZYlaftphg0u9Y4hZzKM-XK_SUrccUyBuYw5NNi5DH-uhV',
  PROD_AUTH0_DOMAIN: 'dev-adijdczrcqg13gp8.eu.auth0.com',
  PROD_AUTH0_SCOPE: 'openid profile email offline_access'
};

console.log('Updating Vercel Production Auth0 Credentials...');

for (const [key, value] of Object.entries(envVars)) {
  console.log(`\nProcessing ${key}...`);
  
  try {
    // Remove existing variable
    console.log(`Removing ${key}...`);
    try {
      execSync(`vercel env rm ${key} production -y`, { stdio: 'inherit' });
    } catch (e) {
      console.log(`Could not remove ${key} (maybe it doesn't exist), proceeding to add...`);
    }

    // Add variable with clean value
    console.log(`Adding ${key}...`);
    try {
      execSync(`vercel env add ${key} production`, {
        input: value,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      console.log(`✅ Successfully added ${key}`);
    } catch (e) {
      console.error(`❌ Failed to add ${key}`);
      console.error(e);
    }

  } catch (error) {
    console.error(`❌ Error processing ${key}:`, error);
  }
}

console.log('\nDone!');
