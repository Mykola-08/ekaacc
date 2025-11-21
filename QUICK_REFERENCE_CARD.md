# Quick Reference Card 🚀

One-page reference for common operations.

---

## 🚀 Deployment

```powershell
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Deploy with force rebuild
vercel --prod --force
```

---

## 🔐 Environment Variables

```powershell
# List all variables
vercel env ls

# Add variable
echo "value" | vercel env add VAR_NAME production

# Remove variable
vercel env rm VAR_NAME production

# Download to .env.local
vercel env pull .env.local
```

---

## 📊 Monitoring

```powershell
# View deployments
vercel ls

# Get deployment details
vercel inspect <url>

# View real-time logs
vercel logs https://app.ekabalance.com --follow

# View specific deployment logs
vercel logs <deployment-url>
```

---

## 🧪 Testing

```powershell
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Run type check
npm run type-check

# Build production
npm run build
```

---

## 🔄 Git Workflow

```powershell
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "feat: your feature"

# Push to GitHub
git push origin feature/your-feature

# Create PR (GitHub CLI)
gh pr create

# Merge PR
gh pr merge
```

---

## 📦 Dependencies

```powershell
# Install dependencies
npm install

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🏷️ GitHub Actions

```powershell
# List workflows (GitHub CLI)
gh workflow list

# Run workflow manually
gh workflow run <workflow-name>

# View workflow runs
gh run list

# View specific run logs
gh run view <run-id> --log
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Production** | https://app.ekabalance.com |
| **Vercel Dashboard** | https://vercel.com/mykola-08s-projects/ekaacc-1 |
| **GitHub Repository** | https://github.com/Mykola-08/ekaacc |
| **Auth0 Dashboard** | https://manage.auth0.com/dashboard/eu/ekabalance |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/rbnfyxhewsivofvwdpuk |
| **Stripe Dashboard** | https://dashboard.stripe.com |

---

## 🆘 Emergency Commands

### Rollback Deployment
```powershell
# Find previous working deployment
vercel ls

# Promote to production
vercel promote <previous-url>
```

### Clear Cache
```powershell
# Force rebuild
vercel --prod --force

# Clear Next.js cache
rm -r .next
npm run build
```

### Reset Environment
```powershell
# Re-pull environment variables
vercel env pull --force

# Restart development server
npm run dev
```

---

## 📝 Common Issues

### Issue: "vercel: command not found"
```powershell
npm i -g vercel
```

### Issue: Auth0 login fails
1. Check callback URLs in Auth0
2. Verify AUTH0_* variables
3. Re-deploy: `vercel --prod --force`

### Issue: Build fails
1. Check logs: `vercel logs <url>`
2. Test locally: `npm run build`
3. Verify environment variables

### Issue: Tests fail in CI
1. Check GitHub Actions logs
2. Run locally: `npm test`
3. Verify Node version matches CI (20.x)

---

## 🎯 Quick Checks

```powershell
# Check if logged into Vercel
vercel whoami

# Check current project
vercel ls

# Check environment variables
vercel env ls

# Check latest deployment
vercel ls | Select-Object -First 5

# Check GitHub connection
gh auth status
```

---

## 📋 Pre-Deployment Checklist

- [ ] Tests passing: `npm test`
- [ ] Lint passing: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] Environment variables set: `vercel env ls`
- [ ] Auth0 configured correctly
- [ ] Changes committed to Git
- [ ] PR reviewed and approved

**Then:** `vercel --prod`

---

## 🔧 Scripts Reference

All scripts in `scripts/` directory:

```powershell
# Add Auth0 variables to Vercel
.\scripts\add-auth0-vars.ps1

# Verify environment variables
.\scripts\verify-vercel-env.ps1

# Setup GitHub labels
.\scripts\setup-github-labels.ps1

# Verify complete setup
.\scripts\verify-setup.ps1

# Make user admin
npm run make-admin

# Test Resend emails
npm run test-resend
```

---

## 📚 Documentation

- **Complete Guide:** `COMPLETE_AUTOMATION_SUMMARY.md`
- **Deployment:** `DEPLOYMENT_CHECKLIST.md`
- **Vercel Setup:** `VERCEL_CONFIGURATION_COMPLETE.md`
- **GitHub Automation:** `.github/AUTOMATION_SETUP.md`
- **Quick Reference:** `.github/QUICK_REFERENCE.md`

---

## 🎓 Tips & Tricks

### Use Aliases
```powershell
# Add to PowerShell profile
Set-Alias deploy-prod 'vercel --prod'
Set-Alias deploy-preview 'vercel'
Set-Alias logs 'vercel logs https://app.ekabalance.com --follow'
```

### Watch Logs
```powershell
# Terminal 1: Watch logs
vercel logs https://app.ekabalance.com --follow

# Terminal 2: Deploy
vercel --prod
```

### Preview Before Deploy
```powershell
# 1. Deploy to preview
vercel

# 2. Test preview deployment
# (opens in browser)

# 3. If good, deploy to production
vercel --prod
```

---

**Keep this handy!** 📌

Bookmark this file for quick access to common commands and troubleshooting.

---

*Version: 1.0*
*Last Updated: November 21, 2025*
