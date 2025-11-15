// Security scanning script for production backend integrations
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔒 Conducting Security Scanning...\n');

// Security scan results
const securityIssues = [];
const recommendations = [];

// Scan 1: Environment Variables Security
function scanEnvironmentVariables() {
  console.log('1️⃣ Scanning Environment Variables Security...');
  
  const sensitivePatterns = [
    /sk_live_[a-zA-Z0-9]+/, // Stripe live keys
    /pk_live_[a-zA-Z0-9]+/, // Stripe publishable keys
    /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/, // JWT tokens
    /[a-f0-9]{64}/, // API keys, secrets
    /password[=:]\s*['"]?[^'"\s]+['"]?/i, // Password patterns
    /secret[=:]\s*['"]?[^'"\s]+['"]?/i, // Secret patterns
    /token[=:]\s*['"]?[^'"\s]+['"]?/i // Token patterns
  ];
  
  const envFiles = ['.env.local', '.env', '.env.production'];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.trim() && !line.startsWith('#')) {
          sensitivePatterns.forEach(pattern => {
            if (pattern.test(line)) {
              securityIssues.push({
                type: 'EXPOSED_SECRET',
                file,
                line: index + 1,
                description: `Potential exposed secret in environment file`,
                severity: 'HIGH'
              });
            }
          });
        }
      });
    }
  });
  
  console.log(`   ✅ Scanned ${envFiles.length} environment files`);
  
  // Check for hardcoded secrets in source code
  function scanSourceCodeForSecrets(dir) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    let foundSecrets = 0;
    
    function walk(currentDir) {
      const files = fs.readdirSync(currentDir);
      
      files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          walk(filePath);
        } else if (extensions.some(ext => file.endsWith(ext))) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for hardcoded API keys, secrets, etc.
          const patterns = [
            /['"]sk_live_[a-zA-Z0-9]+['"]/,
            /['"]pk_live_[a-zA-Z0-9]+['"]/,
            /process\.env\.[A-Z_]+\s*[=!]==?\s*['"][^'"]+['"]/,
            /const\s+\w*key\w*\s*=\s*['"][a-zA-Z0-9]{20,}['"]/i,
            /const\s+\w*secret\w*\s*=\s*['"][a-zA-Z0-9]{20,}['"]/i
          ];
          
          patterns.forEach(pattern => {
            if (pattern.test(content)) {
              foundSecrets++;
              securityIssues.push({
                type: 'HARDCODED_SECRET',
                file: filePath,
                description: `Potential hardcoded secret in source code`,
                severity: 'HIGH'
              });
            }
          });
        }
      });
    }
    
    walk(dir);
    return foundSecrets;
  }
  
  const foundSecrets = scanSourceCodeForSecrets('./src');
  console.log(`   ✅ Scanned source code for hardcoded secrets (${foundSecrets} found)`);
}

// Scan 2: API Security
function scanAPISecurity() {
  console.log('\n2️⃣ Scanning API Security...');
  
  const apiRoutes = [
    'src/app/api/checkout/route.ts',
    'src/app/api/webhooks/stripe/route.ts',
    'src/app/api/webhooks/square/route.ts',
    'src/app/api/square/bookings/route.ts'
  ];
  
  apiRoutes.forEach(route => {
    if (fs.existsSync(route)) {
      const content = fs.readFileSync(route, 'utf8');
      
      // Check for input validation
      if (!content.includes('validation') && !content.includes('validate')) {
        recommendations.push({
          type: 'INPUT_VALIDATION',
          file: route,
          description: 'Consider adding input validation for API endpoints',
          severity: 'MEDIUM'
        });
      }
      
      // Check for rate limiting
      if (!content.includes('rateLimit') && !content.includes('throttle')) {
        recommendations.push({
          type: 'RATE_LIMITING',
          file: route,
          description: 'Consider adding rate limiting for API endpoints',
          severity: 'MEDIUM'
        });
      }
      
      // Check for CORS configuration
      if (!content.includes('cors') && !content.includes('CORS')) {
        recommendations.push({
          type: 'CORS_CONFIG',
          file: route,
          description: 'Consider adding CORS configuration',
          severity: 'LOW'
        });
      }
    }
  });
  
  console.log(`   ✅ Scanned ${apiRoutes.length} API routes`);
}

// Scan 3: Database Security
function scanDatabaseSecurity() {
  console.log('\n3️⃣ Scanning Database Security...');
  
  const dbFiles = [
    'src/services/supabase-data-service.ts',
    'src/lib/supabase.ts'
  ];
  
  dbFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for SQL injection prevention
      if (content.includes('raw') || content.includes('query(')) {
        securityIssues.push({
          type: 'SQL_INJECTION_RISK',
          file,
          description: 'Raw SQL queries detected - ensure proper parameterization',
          severity: 'HIGH'
        });
      }
      
      // Check for proper connection security
      if (!content.includes('ssl') && !content.includes('SSL')) {
        recommendations.push({
          type: 'SSL_CONNECTION',
          file,
          description: 'Consider enforcing SSL connections for database',
          severity: 'MEDIUM'
        });
      }
    }
  });
  
  console.log(`   ✅ Scanned ${dbFiles.length} database configuration files`);
}

// Scan 4: Authentication & Authorization
function scanAuthSecurity() {
  console.log('\n4️⃣ Scanning Authentication & Authorization...');
  
  const authFiles = [
    'src/lib/supabase-auth.tsx',
    'src/components/eka/role-guard.tsx'
  ];
  
  authFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for proper session management
      if (!content.includes('session') && !content.includes('token')) {
        recommendations.push({
          type: 'SESSION_MANAGEMENT',
          file,
          description: 'Ensure proper session management and timeout handling',
          severity: 'MEDIUM'
        });
      }
      
      // Check for role-based access control
      if (content.includes('role') && !content.includes('RBAC')) {
        recommendations.push({
          type: 'RBAC_IMPLEMENTATION',
          file,
          description: 'Consider implementing formal RBAC system',
          severity: 'MEDIUM'
        });
      }
    }
  });
  
  console.log(`   ✅ Scanned ${authFiles.length} authentication files`);
}

// Scan 5: Error Handling Security
function scanErrorHandling() {
  console.log('\n5️⃣ Scanning Error Handling Security...');
  
  const srcDir = './src';
  let errorHandlingIssues = 0;
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walk(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for error information disclosure
        if (content.includes('console.error') || content.includes('console.log')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if ((line.includes('console.error') || line.includes('console.log')) && 
                (line.includes('password') || line.includes('secret') || line.includes('token'))) {
              errorHandlingIssues++;
              securityIssues.push({
                type: 'ERROR_DISCLOSURE',
                file: filePath,
                line: index + 1,
                description: 'Potential sensitive information in error logs',
                severity: 'HIGH'
              });
            }
          });
        }
        
        // Check for generic error messages
        if (content.includes('throw new Error') && !content.includes('user-friendly')) {
          recommendations.push({
            type: 'GENERIC_ERROR_MESSAGES',
            file: filePath,
            description: 'Consider using user-friendly error messages',
            severity: 'LOW'
          });
        }
      }
    });
  }
  
  walk(srcDir);
  console.log(`   ✅ Scanned error handling (${errorHandlingIssues} issues found)`);
}

// Scan 6: Dependency Security
function scanDependencies() {
  console.log('\n6️⃣ Scanning Dependencies...');
  
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check for outdated or vulnerable packages
    const highRiskPackages = ['lodash', 'moment', 'jquery', 'bootstrap'];
    
    Object.keys(dependencies).forEach(dep => {
      if (highRiskPackages.includes(dep)) {
        recommendations.push({
          type: 'HIGH_RISK_DEPENDENCY',
          file: 'package.json',
          description: `Consider replacing ${dep} with more secure alternatives`,
          severity: 'MEDIUM'
        });
      }
    });
    
    console.log(`   ✅ Scanned ${Object.keys(dependencies).length} dependencies`);
  }
}

// Generate Security Report
function generateSecurityReport() {
  console.log('\n📋 Generating Security Report...');
  
  const criticalIssues = securityIssues.filter(issue => issue.severity === 'HIGH');
  const mediumIssues = securityIssues.filter(issue => issue.severity === 'MEDIUM');
  const lowIssues = securityIssues.filter(issue => issue.severity === 'LOW');
  
  const allRecommendations = [...recommendations];
  
  console.log('\n🔒 SECURITY SCAN RESULTS');
  console.log('==========================');
  console.log(`Critical Issues: ${criticalIssues.length}`);
  console.log(`Medium Issues: ${mediumIssues.length}`);
  console.log(`Low Issues: ${lowIssues.length}`);
  console.log(`Recommendations: ${allRecommendations.length}`);
  
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Must Fix):');
    criticalIssues.forEach(issue => {
      console.log(`   • ${issue.type}: ${issue.description}`);
      console.log(`     File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
    });
  }
  
  if (mediumIssues.length > 0) {
    console.log('\n⚠️  MEDIUM ISSUES (Should Fix):');
    mediumIssues.forEach(issue => {
      console.log(`   • ${issue.type}: ${issue.description}`);
      console.log(`     File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
    });
  }
  
  if (allRecommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    allRecommendations.slice(0, 10).forEach(rec => {
      console.log(`   • ${rec.type}: ${rec.description}`);
      console.log(`     File: ${rec.file}`);
    });
  }
  
  if (criticalIssues.length === 0 && mediumIssues.length === 0) {
    console.log('\n✅ No critical or medium security issues found!');
  }
  
  console.log('\n🔧 SECURITY BEST PRACTICES:');
  console.log('• Use environment variables for all secrets');
  console.log('• Implement input validation for all API endpoints');
  console.log('• Add rate limiting to prevent abuse');
  console.log('• Use HTTPS for all external communications');
  console.log('• Implement proper authentication and authorization');
  console.log('• Regularly update dependencies');
  console.log('• Use parameterized queries to prevent SQL injection');
  console.log('• Implement proper error handling without information disclosure');
  console.log('• Use Content Security Policy (CSP) headers');
  console.log('• Implement proper session management');
  
  return {
    critical: criticalIssues.length,
    medium: mediumIssues.length,
    low: lowIssues.length,
    recommendations: allRecommendations.length,
    totalIssues: securityIssues.length + allRecommendations.length
  };
}

// Run all security scans
async function runSecurityScan() {
  console.log('🔒 Starting comprehensive security scanning...\n');
  
  scanEnvironmentVariables();
  scanAPISecurity();
  scanDatabaseSecurity();
  scanAuthSecurity();
  scanErrorHandling();
  scanDependencies();
  
  const report = generateSecurityReport();
  
  console.log('\n🎯 Security Scanning Complete!');
  return report;
}

runSecurityScan().catch(console.error);