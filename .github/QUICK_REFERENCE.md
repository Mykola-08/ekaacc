# GitHub & Vercel Automation - Quick Reference

## 🚀 Quick Commands

### GitHub CLI Setup
```bash
# Install GitHub CLI (if not already installed)
# Windows: winget install GitHub.cli
# Mac: brew install gh

# Login
gh auth login

# Check status
gh auth status
```

### Branch Protection Setup
```bash
# Apply branch protection to main
gh api repos/Mykola-08/ekaacc/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_conversation_resolution=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

### Labels Setup
```bash
# Run the PowerShell script
.\scripts\setup-github-labels.ps1

# Or manually create key labels
gh label create feature --color 0075ca
gh label create bug --color d73a4a
gh label create documentation --color 0075ca
```

### Create a Test PR
```bash
# Create test branch
git checkout -b test/ci-setup
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify CI/CD automation"
git push origin test/ci-setup

# Create PR
gh pr create --title "test: Verify automation setup" \
  --body "Testing the new CI/CD configuration"
```

### Vercel CLI
```bash
# Install
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# Pull env variables
vercel env pull
```

---

## 📋 Workflows Summary

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI** | Push, PR | Build, test, lint, type-check |
| **Security** | Push, PR, Daily | Vulnerability scans, secret detection |
| **Code Quality** | Push, PR | Prettier, ESLint, coverage, bundle size |
| **E2E Tests** | PR | Playwright end-to-end tests |
| **Deploy** | Push to main | Production deployment |
| **Vercel Preview** | PR | Preview deployment comments |
| **Release** | Tag v*.*.* | Create releases, changelog |
| **Auto Label** | PR open/edit | Auto-label based on content |
| **Stale** | Daily | Mark/close stale issues & PRs |
| **Dependabot Merge** | Dependabot PR | Auto-merge safe updates |
| **Performance** | 6h, PR | Lighthouse, load tests |

---

## 🔐 Required Secrets

### GitHub Secrets
Add in: `Settings → Secrets and variables → Actions`

**Optional but recommended:**
- `CODECOV_TOKEN` - Code coverage reporting
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI

**Already configured in your environment:**
- `GITHUB_TOKEN` - Automatically provided

### Vercel Environment Variables
Add in: `Vercel Dashboard → Settings → Environment Variables`

**Required:**
- `AUTH0_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

---

## ✅ Setup Checklist

- [ ] Install GitHub CLI (`gh`)
- [ ] Login to GitHub CLI (`gh auth login`)
- [ ] Apply branch protection rules
- [ ] Run label setup script (`.\scripts\setup-github-labels.ps1`)
- [ ] Enable GitHub Discussions (optional)
- [ ] Install Vercel GitHub App
- [ ] Link repository to Vercel
- [ ] Configure Vercel environment variables
- [ ] Create a test PR to verify workflows
- [ ] Review and customize CODEOWNERS
- [ ] Set up Codecov (optional)
- [ ] Configure notifications (Slack/Discord)
- [ ] Review all workflow files
- [ ] Update README with badges

---

## 🎯 Workflow Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/Mykola-08/ekaacc/workflows/CI/badge.svg)
![Security](https://github.com/Mykola-08/ekaacc/workflows/Security%20Scans/badge.svg)
![Deploy](https://github.com/Mykola-08/ekaacc/workflows/Deploy%20to%20Production/badge.svg)
```

---

## 🔄 Common Workflows

### Making Changes
```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes
# ... edit files ...

# 3. Commit with conventional format
git commit -m "feat: add new feature"

# 4. Push
git push origin feat/new-feature

# 5. Create PR
gh pr create --title "feat: Add new feature" --body "Description"

# 6. Wait for CI checks
# 7. Address review feedback
# 8. Merge when approved
```

### Creating a Release
```bash
# 1. Update version in package.json
npm version minor  # or major/patch

# 2. Push tag
git push --tags

# 3. Workflow automatically creates GitHub release
```

### Rolling Back
```bash
# Option 1: Revert commit
git revert <commit-sha>
git push

# Option 2: Via Vercel Dashboard
# Deployments → Previous deployment → Promote to Production
```

---

## 🛠️ Customization

### Adjust Workflow Triggers
Edit `.github/workflows/*.yml` files to change when workflows run.

### Modify Auto-labeling
Edit `.github/labeler.yml` to change file-to-label mappings.

### Change Stale Times
Edit `.github/workflows/stale.yml`:
- `days-before-issue-stale`: 60
- `days-before-pr-stale`: 30

### Update Code Owners
Edit `.github/CODEOWNERS` to change reviewers.

---

## 📚 Documentation Files

- **Main Guide**: `.github/AUTOMATION_SETUP.md`
- **Branch Protection**: `.github/BRANCH_PROTECTION.md`
- **Vercel Guide**: `.github/VERCEL_GUIDE.md`
- **This File**: `.github/QUICK_REFERENCE.md`

---

## 🆘 Troubleshooting

### Workflows not running
```bash
# Check workflow runs
gh run list

# View specific run
gh run view <run-id>

# Re-run failed workflow
gh run rerun <run-id>
```

### Failed CI
```bash
# Run tests locally
npm test
npm run test:e2e
npm run typecheck
npm run lint
```

### Vercel deployment failed
```bash
# Check logs
vercel logs <deployment-url>

# Deploy locally to test
npm run build
npm start
```

---

## 🎓 Best Practices

1. **Use conventional commits**: `feat:`, `fix:`, `docs:`, `chore:`
2. **Keep PRs small**: Easier to review and merge
3. **Write tests**: Maintain coverage above 80%
4. **Review security scans**: Address findings promptly
5. **Update docs**: Keep documentation in sync
6. **Monitor builds**: Fix broken builds immediately
7. **Use draft PRs**: For work in progress

---

**Need help?** Check the full documentation in `.github/AUTOMATION_SETUP.md`
