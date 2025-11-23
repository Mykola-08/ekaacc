import { execSync } from 'child_process';

const envVars = {
  NEXT_PUBLIC_AUTH0_CLIENT_ID: 'N5gQvdJ13hYmjtyHBqJrmGG6rHGz8zun'
};

console.log('Updating Vercel Public Client ID...');

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
