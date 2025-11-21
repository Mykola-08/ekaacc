# Branch Protection Rules

## Main Branch Protection

Configure the following branch protection rules for the `main` branch:

### Required Settings

#### Require Pull Request Reviews
- **Require approvals**: 1
- **Dismiss stale reviews**: ✅ Enabled
- **Require review from Code Owners**: ✅ Enabled (if CODEOWNERS file exists)
- **Restrict who can dismiss reviews**: Optional (admins only)

#### Require Status Checks
- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled
- **Required status checks**:
  - `build-test` (from CI workflow)
  - `playwright-e2e` (from CI workflow)
  - `dependency-audit` (from security workflow)
  - `secret-scan` (from security workflow)
  - `codeql` (from security workflow)
  - `Vercel - Preview Deployment` (from Vercel integration)

#### Additional Protections
- **Require conversation resolution before merging**: ✅ Enabled
- **Require signed commits**: ⚠️ Recommended (optional)
- **Require linear history**: ✅ Enabled (no merge commits, use squash/rebase)
- **Include administrators**: ✅ Enabled (rules apply to admins too)
- **Restrict pushes**: Optional (limit who can push to main)
- **Allow force pushes**: ❌ Disabled
- **Allow deletions**: ❌ Disabled

### GitHub CLI Command

```bash
# Using GitHub CLI to set up branch protection
gh api repos/Mykola-08/ekaacc/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=build-test \
  --field required_status_checks[contexts][]=playwright-e2e \
  --field required_status_checks[contexts][]=dependency-audit \
  --field required_status_checks[contexts][]=secret-scan \
  --field required_status_checks[contexts][]=codeql \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field required_conversation_resolution=true \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_linear_history=true
```

### Manual Configuration Steps

1. Go to: `https://github.com/Mykola-08/ekaacc/settings/branches`
2. Click "Add rule" or edit existing rule for `main`
3. Configure settings as listed above
4. Click "Create" or "Save changes"

## Development Branch Strategy

### Recommended Branch Naming
- **Feature**: `feature/description` or `feat/description`
- **Bug Fix**: `fix/description` or `bugfix/description`
- **Hotfix**: `hotfix/description`
- **Release**: `release/version`
- **Experimental**: `experiment/description`

### Branch Lifecycle
1. Create feature branch from `main`
2. Develop and commit changes
3. Push and create pull request
4. Pass all CI checks
5. Code review and approval
6. Squash and merge to `main`
7. Delete feature branch

## Additional Protections

### CODEOWNERS File
Create `.github/CODEOWNERS` to automatically request reviews from specific people:

```
# Default owners for everything
* @Mykola-08

# Auth-related code
src/app/api/auth/** @Mykola-08
wiki/AUTH*.md @Mykola-08

# Database
supabase/** @Mykola-08
wiki/DATABASE*.md @Mykola-08

# CI/CD
.github/workflows/** @Mykola-08
vercel.json @Mykola-08
```

### Auto-merge Settings
For dependabot PRs, you can enable auto-merge with:

```bash
# Enable auto-merge for dependabot PRs that pass all checks
gh pr merge --auto --squash
```

## Verifying Protection

Check current branch protection:
```bash
gh api repos/Mykola-08/ekaacc/branches/main/protection
```

## Notes
- Adjust the number of required approvals based on team size
- Consider enabling signed commits for enhanced security
- Review and update required status checks as CI workflows change
- For enterprise accounts, consider enabling "Require deployments to succeed"
