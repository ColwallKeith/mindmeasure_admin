# Complete Mind Measure Admin System Test Plan

## STEP 1: Database Setup

**Run this SQL in your Admin Production Supabase project (`ewrrictbejcmdkgpvkio`):**

Copy the entire contents of `supabase/migrations/2025-09-18_complete_system_setup.sql` and run it in the SQL Editor.

This will:
- ✅ Create all required tables with proper structure
- ✅ Set up Row Level Security policies
- ✅ Create storage bucket and policies
- ✅ Insert Worcester university with proper data
- ✅ Add authorized users for testing
- ✅ Create sample content categories

## STEP 2: Environment Variables Verification

**In Vercel Dashboard → Project Settings → Environment Variables:**

Ensure these are set correctly:
```
VITE_SUPABASE_URL=https://api.mindmeasure.co.uk
VITE_SUPABASE_ANON_KEY=[your-admin-production-anon-key]
```

**To get the anon key:**
1. Go to Supabase Admin Production project
2. Settings → API
3. Copy the "anon public" key

## STEP 3: Test University Login Page

**URL:** `https://app.mindmeasure.co.uk/login/worcester`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows Worcester branding and campus image
- ✅ Shows "University of Worcester" in header
- ✅ Email field placeholder shows worcester.ac.uk domain
- ✅ No console errors in browser dev tools

## STEP 4: Test Email Validation

**Try these emails on the login page:**

1. **`admin@worcester.ac.uk`** → Should be accepted
2. **`wellbeing@worcester.ac.uk`** → Should be accepted  
3. **`test@mindmeasure.co.uk`** → Should be accepted (MM staff)
4. **`random@gmail.com`** → Should show "not authorized" error

## STEP 5: Test Dashboard Access

**After successful login with `admin@worcester.ac.uk`:**

**Expected redirect:** `https://app.mindmeasure.co.uk/university/worcester`

**Expected Results:**
- ✅ Worcester-specific dashboard loads
- ✅ Shows Worcester branding in header
- ✅ Navigation includes "CMS" link
- ✅ Dashboard shows university-specific data

## STEP 6: Test CMS Access

**Click "CMS" in navigation or visit:** `https://app.mindmeasure.co.uk/university/worcester/cms`

**Expected Results:**
- ✅ CMS loads with Worcester branding
- ✅ Shows 5 tabs: Overview, Profile, Emergency, Content, Users
- ✅ Overview shows setup progress and stats
- ✅ No access to other universities' data

## STEP 7: Test File Upload

**In CMS → Profile tab → Step 3 (Branding):**

1. **Try uploading a logo image**
2. **Try uploading a campus image**

**Expected Results:**
- ✅ File upload works without RLS errors
- ✅ Images are stored in Supabase Storage
- ✅ Image URLs are saved to database
- ✅ Images display in the form after upload

## STEP 8: Test Authorized Users Management

**In CMS → Users tab:**

**Expected Results:**
- ✅ Shows 3 pre-configured Worcester users
- ✅ Can add new users with email validation
- ✅ Can edit existing users
- ✅ Can change user roles and status
- ✅ Search and filtering works

## STEP 9: Test Content Management

**In CMS → Content tab:**

**Expected Results:**
- ✅ Shows content categories for Worcester
- ✅ Can create new articles
- ✅ Articles are scoped to Worcester only
- ✅ File uploads work for article images

## STEP 10: Test Security Isolation

**Verify university data isolation:**

1. **Create a second university** (optional):
   ```sql
   INSERT INTO universities (id, name, short_name, slug, contact_email, status)
   VALUES ('cambridge', 'University of Cambridge', 'Cambridge', 'cambridge', 'admin@cambridge.ac.uk', 'active');
   ```

2. **Test that Worcester admin cannot access Cambridge data**
3. **Test that MM staff can access both universities**

## TROUBLESHOOTING

### If login page shows "University not found":
- Check database has Worcester with `slug = 'worcester'`
- Verify RLS policies allow public read access
- Check browser console for API errors

### If file upload shows RLS error:
- Verify storage bucket exists
- Check storage policies are created
- Ensure user is properly authenticated

### If CMS shows no data:
- Check RLS policies for content tables
- Verify user authorization in database
- Check browser console for API errors

### If authentication fails:
- Verify environment variables in Vercel
- Check Supabase project URL matches
- Ensure anon key is correct

## SUCCESS CRITERIA

✅ **All tests pass without errors**
✅ **File uploads work properly**  
✅ **University data is properly isolated**
✅ **Authentication and authorization work**
✅ **CMS is fully functional**

## NEXT STEPS AFTER TESTING

1. **Add more universities** as needed
2. **Configure custom domains** properly
3. **Set up production monitoring**
4. **Create user documentation**
5. **Plan mobile app integration**




