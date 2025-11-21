# GitHub Configuration & Automation

This directory contains all GitHub-specific configuration, automation workflows, and documentation for the project.

## 📁 Directory Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Continuous Integration
│   ├── security.yml       # Security scans
│   ├── code-quality.yml   # Code quality checks
│   ├── deploy.yml         # Production deployment
│   ├── vercel-preview.yml # Preview deployment automation
│   ├── e2e.yml            # E2E tests
│   ├── release.yml        # Release automation
│   ├── auto-label.yml     # Automatic PR labeling
│   ├── stale.yml          # Stale issue/PR management
│   ├── dependabot-auto-merge.yml  # Auto-merge dependencies
│   └── performance.yml    # Performance testing
│
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.yml     # Bug reports
│   ├── feature_request.yml # Feature requests
│   ├── documentation.yml  # Documentation issues
│   └── config.yml         # Template configuration
│
├── pull_request_template.md  # PR template
├── dependabot.yml         # Dependabot configuration
├── CODEOWNERS             # Code ownership
├── labeler.yml            # Auto-labeling rules
├── release-config.json    # Release changelog config
│
└── Documentation/
    ├── AUTOMATION_SETUP.md    # Complete setup guide
    ├── BRANCH_PROTECTION.md   # Branch protection rules
    ├── VERCEL_GUIDE.md        # Vercel integration guide
    ├── QUICK_REFERENCE.md     # Quick command reference
    ├── SETUP_SUMMARY.md       # Setup summary & checklist
    └── README.md              # This file
```

## 🚀 Quick Start

### 1. Verify Setup
```powershell
.\scripts\verify-setup.ps1
```

### 2. Create Labels
```powershell
.\scripts\setup-github-labels.ps1
```

### 3. Apply Branch Protection
```powershell
gh api repos/Mykola-08/ekaacc/branches/main/protection --method PUT `
  --field required_status_checks[strict]=true `
  --field enforce_admins=true `
  --field required_pull_request_reviews[required_approving_review_count]=1
```

### 4. Test with a PR
```powershell
git checkout -b test/automation
echo "# Test" > TEST.md
git add TEST.md
git commit -m "test: verify automation"
git push origin test/automation
gh pr create --title "test: Verify automation" --body "Testing setup"
```

## 📖 Documentation

- **[AUTOMATION_SETUP.md](AUTOMATION_SETUP.md)** - Complete automation guide
- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Quick setup summary with checklist
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command reference
- **[BRANCH_PROTECTION.md](BRANCH_PROTECTION.md)** - Branch protection guide
- **[VERCEL_GUIDE.md](VERCEL_GUIDE.md)** - Vercel deployment guide

## 🔄 Workflows

### Continuous Integration
**Triggers**: Push, Pull Request  
**Purpose**: Build, test, lint, type-check

### Security Scans
**Triggers**: Push, PR, Daily  
**Purpose**: Vulnerability scanning, secret detection

### Code Quality
**Triggers**: Push, PR  
**Purpose**: Formatting, linting, coverage, bundle analysis

### Deployment
**Triggers**: Push to main  
**Purpose**: Production deployment to Vercel

### Preview Deployments
**Triggers**: Pull Request  
**Purpose**: Create preview deployments and comments

### Release Management
**Triggers**: Version tags (v*.*.*)  
**Purpose**: Automated releases and changelogs

### Auto Labeling
**Triggers**: PR opened/edited  
**Purpose**: Automatic label assignment

### Stale Management
**Triggers**: Daily  
**Purpose**: Mark and close stale issues/PRs

### Dependabot Auto-Merge
**Triggers**: Dependabot PR  
**Purpose**: Auto-merge safe dependency updates

### Performance Testing
**Triggers**: Every 6 hours, PRs  
**Purpose**: Lighthouse and load testing

## 🏷️ Labels

The repository uses labels for organization:

- **Type**: feature, bug, documentation, enhancement
- **Priority**: critical, high, medium, low
- **Size**: size/XS, size/S, size/M, size/L, size/XL
- **Category**: auth, database, api, ui, testing, ci
- **Status**: stale, in-progress, needs-triage

Run `.\scripts\setup-github-labels.ps1` to create all labels.

## 🛡️ Branch Protection

The `main` branch should have:
- Required PR reviews (1 approval)
- Required status checks
- Conversation resolution required
- Linear history enforced
- No force pushes
- Administrators included

See [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md) for details.

## 📝 Templates

### Pull Request Template
Comprehensive checklist including:
- Change description
- Testing requirements
- Code quality checks
- Security considerations
- Deployment notes

### Issue Templates
- **Bug Report**: Structured bug reporting
- **Feature Request**: Feature proposals
- **Documentation**: Documentation improvements

## 🔒 Security

### Automated Security
- Daily dependency audits
- Secret scanning (Gitleaks, TruffleHog)
- CodeQL analysis
- Automated security updates via Dependabot

### Best Practices
- Never commit secrets
- Use GitHub Secrets for sensitive data
- Review Dependabot PRs promptly
- Enable 2FA on GitHub account

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following style guide
4. Commit using conventional commits
5. Push and create a PR
6. Wait for automated checks
7. Address review feedback
8. Merge when approved

## 📊 Monitoring

### Workflow Status
View workflow runs:
```powershell
gh run list
```

### Failed Runs
Re-run failed workflows:
```powershell
gh run rerun <run-id>
```

### Logs
View workflow logs:
```powershell
gh run view <run-id> --log
```

## 🔧 Customization

### Workflow Triggers
Edit `.github/workflows/*.yml` files

### Auto-labeling Rules
Edit `.github/labeler.yml`

### Stale Times
Edit `.github/workflows/stale.yml`

### Code Owners
Edit `.github/CODEOWNERS`

## 🆘 Troubleshooting

### Workflows Not Running
1. Check GitHub Actions are enabled
2. Verify workflow files syntax
3. Check repository permissions

### Failed Checks
1. Review workflow logs
2. Run tests locally
3. Check for TypeScript errors
4. Verify linting passes

### Vercel Issues
1. Check environment variables
2. Review build logs
3. Verify Vercel integration is active

## 📞 Support

- Check [AUTOMATION_SETUP.md](AUTOMATION_SETUP.md) for detailed guidance
- Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands
- Create an issue using templates
- Review existing documentation

## 🎯 Goals

This automation setup aims to:
- ✅ Ensure code quality through automated checks
- ✅ Prevent security vulnerabilities
- ✅ Streamline deployment process
- ✅ Maintain consistent code style
- ✅ Automate repetitive tasks
- ✅ Provide fast feedback on changes
- ✅ Reduce manual review burden
- ✅ Improve development workflow

---

**For complete setup instructions, see [SETUP_SUMMARY.md](SETUP_SUMMARY.md)**
