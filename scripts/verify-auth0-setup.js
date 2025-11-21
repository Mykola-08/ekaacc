#!/usr/bin/env node

/**
 * Auth0 + Supabase Integration Verification Script
 * 
 * This script checks that all required configuration is in place
 * for the Auth0 + Supabase integration to work correctly.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const checkmark = '✓';
const crossmark = '✗';
const warning = '⚠';

let errors = [];
let warnings = [];
let success = [];

console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  Auth0 + Supabase Integration Verification                ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

// Check environment files
console.log(`${colors.blue}Checking environment files...${colors.reset}`);

const envFiles = ['.env', '.env.local'];
const requiredEnvVars = [
  // Development
  'NEXT_PUBLIC_AUTH0_DOMAIN',
  'NEXT_PUBLIC_AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // Production (custom domain)
  'PROD_AUTH0_DOMAIN',
  'PROD_AUTH0_CLIENT_ID',
  'PROD_AUTH0_CLIENT_SECRET',
  'PROD_AUTH0_AUDIENCE',
  // Organizations
  'DEV_AUTH0_ORG_ID',
  'PROD_AUTH0_ORG_ID',
  // Management API
  'AUTH0_MGMT_DOMAIN',
  'AUTH0_MGMT_CLIENT_ID',
  'AUTH0_MGMT_CLIENT_SECRET',
];

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    success.push(`${checkmark} ${file} exists`);
    
    // Check for required variables
    const content = fs.readFileSync(filePath, 'utf8');
    requiredEnvVars.forEach(varName => {
      if (content.includes(varName)) {
        const match = content.match(new RegExp(`${varName}=(.+)`));
        if (match && match[1] && match[1].trim() !== '') {
          success.push(`  ${checkmark} ${varName} is set`);
        } else {
          warnings.push(`  ${warning} ${varName} is empty in ${file}`);
        }
      } else {
        warnings.push(`  ${warning} ${varName} not found in ${file}`);
      }
    });
  } else {
    errors.push(`${crossmark} ${file} not found`);
  }
});

// Check required files
console.log(`\n${colors.blue}Checking required files...${colors.reset}`);

const requiredFiles = [
  'src/lib/auth0-provider.tsx',
  'src/hooks/useAuth0Supabase.ts',
  'src/app/api/auth/callback/route.ts',
  'src/app/api/auth/logout/route.ts',
  'supabase/migrations/20251121_auth0_integration.sql',
  'wiki/AUTH0_QUICKSTART.md',
  'wiki/PRODUCTION_AUTH0_SETUP.md',
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    success.push(`${checkmark} ${file}`);
  } else {
    errors.push(`${crossmark} ${file} not found`);
  }
});

// Check package.json for Auth0 dependencies
console.log(`\n${colors.blue}Checking dependencies...${colors.reset}`);

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    '@auth0/auth0-react',
    '@auth0/auth0-spa-js',
    '@supabase/supabase-js',
  ];
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      success.push(`${checkmark} ${dep} (${deps[dep]})`);
    } else {
      errors.push(`${crossmark} ${dep} not installed`);
    }
  });
} else {
  errors.push(`${crossmark} package.json not found`);
}

// Check Supabase config
console.log(`\n${colors.blue}Checking Supabase configuration...${colors.reset}`);

const configPath = path.join(process.cwd(), 'supabase/config.toml');
if (fs.existsSync(configPath)) {
  const content = fs.readFileSync(configPath, 'utf8');
  
  if (content.includes('[auth.third_party.auth0]')) {
    success.push(`${checkmark} Auth0 third-party provider section exists`);
    
    if (content.includes('enabled = true')) {
      success.push(`  ${checkmark} Auth0 provider is enabled`);
    } else {
      warnings.push(`  ${warning} Auth0 provider may not be enabled`);
    }
    
    if (content.includes('tenant = "ekabalance"')) {
      success.push(`  ${checkmark} Auth0 tenant is configured`);
    } else {
      warnings.push(`  ${warning} Auth0 tenant may not be configured correctly`);
    }
  } else {
    warnings.push(`${warning} Auth0 configuration not found in config.toml`);
  }
} else {
  warnings.push(`${warning} supabase/config.toml not found`);
}

// Additional dynamic checks
console.log(`\n${colors.blue}Checking action configuration...${colors.reset}`);
// We cannot query Auth0 tenant from this script; instruct manual verification
success.push(`${checkmark} Ensure Post-Login action 'Sync User to Supabase (Prod)' is added to Login Flow in Auth0 dashboard`);
success.push(`${checkmark} Ensure enhanced action 'Sync User + Roles to Supabase (Prod)' is active and older one disabled to avoid duplicate writes`);
success.push(`${checkmark} If using organizations, verify DEV_AUTH0_ORG_ID / PROD_AUTH0_ORG_ID values exist in Auth0 dashboard`);

// Print results
console.log(`\n${colors.cyan}════════════════════════════════════════════════════════════${colors.reset}\n`);

if (success.length > 0) {
  console.log(`${colors.green}✓ Success (${success.length}):${colors.reset}`);
  success.forEach(msg => console.log(`  ${colors.green}${msg}${colors.reset}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log(`${colors.yellow}⚠ Warnings (${warnings.length}):${colors.reset}`);
  warnings.forEach(msg => console.log(`  ${colors.yellow}${msg}${colors.reset}`));
  console.log('');
}

if (errors.length > 0) {
  console.log(`${colors.red}✗ Errors (${errors.length}):${colors.reset}`);
  errors.forEach(msg => console.log(`  ${colors.red}${msg}${colors.reset}`));
  console.log('');
}

// Final verdict
console.log(`${colors.cyan}════════════════════════════════════════════════════════════${colors.reset}\n`);

if (errors.length === 0 && warnings.length === 0) {
  console.log(`${colors.green}${checkmark} All checks passed! Your Auth0 + Supabase integration is ready.${colors.reset}\n`);
  console.log(`${colors.blue}Next steps:${colors.reset}`);
  console.log(`  1. Configure Supabase JWT settings (see wiki/SUPABASE_JWT_CONFIGURATION.md)`);
  console.log(`  2. Run database migration: supabase db push`);
  console.log(`  3. Add Auth0Provider to your app layout`);
  console.log(`  4. Test the integration\n`);
  console.log(`${colors.blue}Documentation:${colors.reset}`);
  console.log(`  - Quick Start: wiki/AUTH0_QUICKSTART.md`);
  console.log(`  - Full Guide: wiki/AUTH0_SUPABASE_INTEGRATION.md\n`);
} else if (errors.length === 0) {
  console.log(`${colors.yellow}${warning} Setup is mostly complete, but there are some warnings.${colors.reset}`);
  console.log(`${colors.yellow}Review the warnings above and consult the documentation.${colors.reset}\n`);
} else {
  console.log(`${colors.red}${crossmark} Setup is incomplete. Please fix the errors above.${colors.reset}`);
  console.log(`${colors.red}Consult AUTH0_SETUP_COMPLETE.md for detailed instructions.${colors.reset}\n`);
  process.exit(1);
}
