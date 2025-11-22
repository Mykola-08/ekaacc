#!/usr/bin/env node

/**
 * Vercel Deployment Health Check
 * Verifies production deployment is working correctly
 */

const https = require('https');

const DEPLOYMENT_URL = process.env.VERCEL_URL || process.argv[2];

if (!DEPLOYMENT_URL) {
  console.error('Usage: node verify-deployment.js <deployment-url>');
  console.error('Example: node verify-deployment.js ekaacc-git-main-mykola-08s-projects.vercel.app');
  process.exit(1);
}

const checks = [
  {
    name: 'Home Page',
    path: '/',
    expectedStatus: [200, 307, 308], // May redirect to auth
    critical: true
  },
  {
    name: 'Health Check API',
    path: '/api/health',
    expectedStatus: [200],
    critical: true
  },
  {
    name: 'Auth Login Endpoint',
    path: '/api/auth/login',
    expectedStatus: [307, 302], // Should redirect to Auth0
    critical: true
  },
  {
    name: 'Auth Me Endpoint',
    path: '/api/auth/me',
    expectedStatus: [200, 401], // 401 if not authenticated
    critical: true
  },
  {
    name: 'Public Route - Privacy',
    path: '/privacy',
    expectedStatus: [200],
    critical: false
  },
  {
    name: 'Public Route - Terms',
    path: '/terms',
    expectedStatus: [200],
    critical: false
  }
];

function checkEndpoint(url, check) {
  return new Promise((resolve) => {
    const options = {
      hostname: url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      path: check.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Deployment-Health-Check/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const success = check.expectedStatus.includes(res.statusCode);
      resolve({
        ...check,
        status: res.statusCode,
        success,
        headers: res.headers
      });
    });

    req.on('error', (error) => {
      resolve({
        ...check,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        ...check,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runHealthChecks() {
  const url = DEPLOYMENT_URL.startsWith('http') 
    ? DEPLOYMENT_URL 
    : `https://${DEPLOYMENT_URL}`;

  console.log('\n🔍 Vercel Deployment Health Check');
  console.log('================================\n');
  console.log(`Target: ${url}\n`);

  const results = [];
  
  for (const check of checks) {
    process.stdout.write(`Checking ${check.name}... `);
    const result = await checkEndpoint(url, check);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status}`);
    } else {
      console.log(`❌ ${result.status} (expected: ${check.expectedStatus.join(' or ')})`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }

  console.log('\n================================');
  console.log('Summary:\n');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const critical = results.filter(r => r.critical && !r.success).length;

  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (critical > 0) {
    console.log(`🚨 Critical failures: ${critical}`);
  }

  console.log('\nDetailed Results:');
  results.forEach(r => {
    if (!r.success) {
      console.log(`\n❌ ${r.name}:`);
      console.log(`   Path: ${r.path}`);
      console.log(`   Status: ${r.status}`);
      console.log(`   Expected: ${r.expectedStatus.join(' or ')}`);
      if (r.error) {
        console.log(`   Error: ${r.error}`);
      }
    }
  });

  console.log('\n================================\n');

  if (critical > 0) {
    console.log('❌ Deployment has critical issues!\n');
    process.exit(1);
  } else if (failed > 0) {
    console.log('⚠️  Deployment has non-critical issues.\n');
    process.exit(0);
  } else {
    console.log('✅ All checks passed! Deployment is healthy.\n');
    process.exit(0);
  }
}

runHealthChecks().catch(error => {
  console.error('\n❌ Health check failed:', error);
  process.exit(1);
});
