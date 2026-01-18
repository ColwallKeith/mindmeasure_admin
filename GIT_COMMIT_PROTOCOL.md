# MANDATORY GIT COMMIT PROTOCOL

**CRITICAL: This protocol MUST be followed before ANY deployment or major change.**

## The Problem
Multiple times during this project, significant work has been lost or nearly lost because changes were not committed to git. This has cost hours of development time and created unnecessary stress.

## The Rule

**BEFORE starting ANY new task, feature, or deployment:**

1. **ALWAYS check git status:**
   ```bash
   git status
   ```

2. **If there are uncommitted changes, STOP and commit them:**
   ```bash
   git add .
   git commit -m "descriptive message of what was done"
   ```

3. **NEVER proceed with new work until the working directory is clean**

## Mandatory Checkpoints

### ✅ MUST commit at these points:
- [ ] **After completing a feature** - Before moving to the next one
- [ ] **Before any deployment** - Dev, staging, or production
- [ ] **Before any database migration** - Schema changes must be tracked
- [ ] **After fixing critical bugs** - Don't lose the fix
- [ ] **At end of each work session** - Before closing the IDE
- [ ] **Before major refactoring** - Create a safe rollback point
- [ ] **After adding new files/directories** - Don't leave untracked files

### ⚠️ High-Risk Situations
These situations have caused losses before - be extra careful:

1. **Creating new modules/directories** (like `assessment-engine/`)
   - Git doesn't track new directories by default
   - ALWAYS run `git add <directory>/` explicitly
   - Verify with `git status` that files are staged

2. **Before CDK/infrastructure changes**
   - These can fail and need rollback
   - Commit before `cdk deploy`

3. **After documentation updates**
   - Easy to forget
   - Commit separately from code changes

## The Checklist

Copy this into every session notes:

```
GIT COMMIT CHECKLIST:
□ Checked git status
□ Staged all changes (git add .)
□ Committed with clear message
□ Verified working directory is clean
□ Ready to proceed
```

## Commit Message Guidelines

Good commit messages help with rollback:

**Good:**
```bash
git commit -m "feat: Add Assessment Engine multimodal pipeline
- 10 Lambda functions deployed
- Step Functions orchestration
- API Gateway endpoints
- Tested in dev environment"
```

**Bad:**
```bash
git commit -m "changes"
git commit -m "wip"
git commit -m "fix"
```

## Recovery Plan

If work is uncommitted and you realize it:

1. **STOP immediately** - Don't do anything else
2. **Check what's uncommitted:** `git status`
3. **Stage everything:** `git add .`
4. **Commit with detailed message** explaining what was done
5. **Verify it's committed:** `git log -1`

## For AI Assistant (Me)

**I MUST:**
- Check git status at the START of every session
- Check git status BEFORE every deployment
- Proactively remind about commits after major milestones
- NEVER assume files are tracked
- ALWAYS verify with `git status` after `git add`

**I MUST NOT:**
- Proceed with new work if there are uncommitted changes
- Deploy anything without a clean git state
- Assume new directories are automatically tracked

## The Principle

> **"If it's not committed, it doesn't exist"**

Work that's not in git can be lost in seconds:
- Terminal crashes
- Accidental deletions
- Failed deployments overwriting files
- Confusion about which version is current

---

**This protocol is mandatory. Following it prevents 90% of the git-related issues we've experienced.**

**Last Updated:** 28 November 2025  
**Reason:** Assessment Engine nearly lost due to untracked directory

