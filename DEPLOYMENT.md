# Production Deployment Guide

## 🚀 Deploying Mind Measure CMS to mindmeasure.co.uk

### Prerequisites
- Vercel account with access to mindmeasure.co.uk domain
- Production Supabase project
- GitHub repository access

### Step 1: Supabase Production Setup

1. **Create Production Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Create new project: "mind-measure-production"
   # Note down the URL and anon key
   ```

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

   # Link to production project
   supabase link --project-ref your-production-project-ref

   # Push all migrations
   supabase db push

   # Or manually run migrations in Supabase SQL editor:
   # - supabase/migrations/2025-09-16_min_schema.sql
   # - supabase/migrations/2025-09-16_content_system.sql  
   # - supabase/migrations/2025-09-16_storage_setup.sql
   ```

3. **Configure Storage Buckets**
   ```sql
   -- Run in Supabase SQL Editor
   insert into storage.buckets (id, name, public)
   values ('uploads', 'uploads', true)
   on conflict (id) do nothing;
   ```

4. **Set Up Authentication**
   - Go to Authentication > Settings
   - Configure email templates with your domain
   - Set site URL to `https://mindmeasure.co.uk`
   - Configure redirect URLs

### Step 2: Vercel Deployment

1. **Connect Repository**
   ```bash
   # In Vercel dashboard:
   # 1. Import project from GitHub
   # 2. Select mind-measure-core repository
   # 3. Configure build settings:
   #    - Framework: Vite
   #    - Build Command: npm run build
   #    - Output Directory: dist
   ```

2. **Environment Variables**
   Set these in Vercel dashboard under Settings > Environment Variables:
   ```
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
   VITE_APP_ENV=production
   VITE_APP_URL=https://cms.mindmeasure.co.uk
   ```

3. **Domain Configuration**
   ```bash
   # In Vercel dashboard:
   # 1. Go to Settings > Domains
   # 2. Add custom domain: cms.mindmeasure.co.uk
   # 3. Configure DNS records as instructed
   # 4. Enable SSL (automatic)
   ```

### Step 3: DNS Configuration

Configure these DNS records for cms.mindmeasure.co.uk:

```
Type    Name           Value
A       @              76.76.19.61 (Vercel IP - for main domain)
CNAME   admin          cname.vercel-dns.com (for admin subdomain)
CNAME   www            cname.vercel-dns.com
```

### Step 4: Post-Deployment Setup

1. **Test Admin Access**
   - Go to https://cms.mindmeasure.co.uk/sign-in
   - Sign in with admin@mindmeasure.co.uk / georgia
   - Verify CMS access at https://cms.mindmeasure.co.uk/cms

2. **Create Initial Content**
   - Add first university via CMS
   - Upload university logos
   - Create sample help articles
   - Configure emergency contacts

3. **Test Mobile Integration**
   - Visit https://cms.mindmeasure.co.uk/demo
   - Test university selection
   - Verify emergency contacts display
   - Check help articles functionality

### Step 5: Security Checklist

- [ ] HTTPS enabled and working
- [ ] CSP headers configured
- [ ] Supabase RLS policies active
- [ ] File upload permissions working
- [ ] Admin authentication working
- [ ] Domain-based access control active

### Step 6: Monitoring Setup

1. **Vercel Analytics** (Built-in)
   - Automatically enabled for performance monitoring

2. **Supabase Monitoring**
   - Monitor database usage
   - Check storage usage
   - Review authentication logs

3. **Optional: Sentry Integration**
   ```bash
   # Add to environment variables if using Sentry:
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

### Deployment Commands

```bash
# Local testing before deployment
npm run build
npm run preview

# Deploy via Git push (automatic)
git add .
git commit -m "Production deployment"
git push origin main

# Manual deployment via Vercel CLI
npx vercel --prod
```

### Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel dashboard
2. Check Vercel function logs for errors
3. Verify Supabase connection and RLS policies
4. Test with demo credentials: admin@mindmeasure.co.uk / georgia

### Support URLs

- **Admin CMS**: https://cms.mindmeasure.co.uk/cms
- **University Portal**: https://cms.mindmeasure.co.uk/university  
- **Superuser Panel**: https://cms.mindmeasure.co.uk/superuser
- **Demo Showcase**: https://cms.mindmeasure.co.uk/demo
- **Sign In**: https://cms.mindmeasure.co.uk/sign-in
- **Mobile App**: https://mobile.mindmeasure.app (existing)

### Environment-Specific Features

**Production Features:**
- Real Supabase database with RLS
- File uploads to Supabase Storage
- Domain-based authentication (@mindmeasure.co.uk)
- CSP security headers
- SSL/HTTPS enforcement
- Error tracking (if Sentry configured)

**Demo Credentials:**
- Email: admin@mindmeasure.co.uk
- Password: georgia
- Access: Full CMS and admin functionality
