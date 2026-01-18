# Mind Measure Development Protocol
## Single Source of Truth for Architecture & Deployment

**Created**: October 15, 2025  
**Status**: ACTIVE - Must be referenced before ANY development work  
**Purpose**: Eliminate environment confusion and establish repeatable processes

---

## 🎯 CORE PRINCIPLE
**There is NO local development environment. Production IS our development environment.**

---

## 🌐 DOMAIN ARCHITECTURE

### **STRICT DOMAIN SEPARATION**

| Domain | Purpose | Access Method | Codebase |
|--------|---------|---------------|----------|
| `mobile.mindmeasure.app` | **Student Mobile App** | iOS/Android Apps ONLY | Mobile frontend + API |
| `admin.mindmeasure.co.uk` | **Admin Dashboard** | Web browsers ONLY | Admin interface |
| `mindmeasure.co.uk` | **Marketing Site** | Web browsers | Static marketing |

### **CRITICAL RULES**
- ❌ **NO localhost:3000 development**
- ❌ **NO local API servers**  
- ❌ **NO mixing mobile/admin interfaces**
- ✅ **ALL development against live domains**
- ✅ **Production = Development = Testing**

---

## 📱 MOBILE APP DEPLOYMENT PROTOCOL

### **Environment Configuration**
```bash
# REQUIRED environment variables for ALL builds
export VITE_API_BASE_URL=https://mobile.mindmeasure.app/api
export VITE_AWS_REGION=eu-west-2
export VITE_AWS_COGNITO_USER_POOL_ID=eu-west-2_ClAG4fQXR
export VITE_AWS_COGNITO_CLIENT_ID=7vu03ppv6alkpphs1ksopll8us
export VITE_BACKEND_PROVIDER=aurora-serverless
```

### **MANDATORY BUILD & DEPLOY SEQUENCE**
```bash
# 1. Set environment variables (above)
# 2. Build with production config
npm run build

# 3. Deploy to Vercel (updates mobile.mindmeasure.app)
npx vercel --prod

# 4. Ensure domain alias is correct
npx vercel alias mobile.mindmeasure.app

# 5. Sync to Capacitor for mobile testing
npx cap sync

# 6. Test on device
npx cap run ios
```

### **VERIFICATION CHECKLIST**
Before any mobile testing:
- [ ] API endpoints return 200: `curl https://mobile.mindmeasure.app/api/database/health`
- [ ] Database schema exists: `curl -X POST https://mobile.mindmeasure.app/api/database/select -d '{"table":"profiles","limit":1}'`
- [ ] Cognito configuration matches environment variables
- [ ] Mobile app logs show correct API base URL

---

## 🔐 AUTHENTICATION ARCHITECTURE

### **AWS Cognito Configuration**
- **User Pool**: `eu-west-2_ClAG4fQXR`
- **Client ID**: `7vu03ppv6alkpphs1ksopll8us`
- **Region**: `eu-west-2`
- **Email Provider**: AWS SES (`keith@mindmeasure.co.uk`)

### **Authentication Flow States**
1. **New User**: Registration → Email Verification → Sign In
2. **Returning User**: Sign In → Success
3. **Unverified Email**: Sign In/Reset → Redirect to Email Verification
4. **Password Reset**: Verify Email First → Reset Code → New Password

### **CRITICAL: No Localhost Authentication**
- All auth calls go to `mobile.mindmeasure.app/api`
- No local Cognito testing
- Production Cognito pool for all testing

---

## 🗄️ DATABASE ARCHITECTURE

### **Production Database**
- **Host**: `mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com`
- **Database**: `mindmeasure`
- **Access**: Via Vercel serverless functions only
- **Schema**: Auto-created via `/api/database/setup-tables`

### **API Endpoints**
- **Base URL**: `https://mobile.mindmeasure.app/api`
- **Health Check**: `GET /api/database/health`
- **Data Operations**: `POST /api/database/{select|insert|update|delete}`
- **Schema Setup**: `POST /api/database/setup-tables`

---

## 🚀 DEPLOYMENT WORKFLOW

### **BEFORE ANY DEVELOPMENT**
1. **Read this document** - Confirm current architecture
2. **Verify production status**: Check API health endpoints
3. **Set environment variables**: Use production config only
4. **Test current deployment**: Ensure baseline works

### **DEVELOPMENT CYCLE**
1. **Make code changes** in local editor
2. **Build with production config**: `npm run build`
3. **Deploy immediately**: `npx vercel --prod`
4. **Test on live domain**: Use actual mobile device/simulator
5. **Verify logs**: Check browser/device console for correct API calls

### **TESTING PROTOCOL**
- **Mobile Testing**: Always use `npx cap run ios` with real device
- **API Testing**: Use `curl` against `mobile.mindmeasure.app/api`
- **Database Testing**: Via production API endpoints only
- **Authentication**: Test with real Cognito user pool

---

## 🔧 TROUBLESHOOTING PROTOCOL

### **White Screen Issues**
1. Check browser console for JavaScript errors
2. Verify API base URL in network tab
3. Confirm Vercel deployment succeeded
4. Test API health endpoint manually

### **Authentication Failures**
1. Verify Cognito user exists: `aws cognito-idp admin-get-user`
2. Check user confirmation status
3. Test API endpoints with curl
4. Verify environment variables in build

### **API Connection Issues**
1. Test health endpoint: `curl https://mobile.mindmeasure.app/api/database/health`
2. Check Vercel deployment logs
3. Verify database connection
4. Confirm domain alias is correct

---

## 📋 PRE-DEVELOPMENT CHECKLIST

**MANDATORY: Check these BEFORE starting any work**

- [ ] Read this document completely
- [ ] Verify `mobile.mindmeasure.app/api/database/health` returns 200
- [ ] Confirm latest Vercel deployment is live
- [ ] Test authentication with existing user
- [ ] Verify mobile app loads without white screen
- [ ] Check that API calls show correct production URLs in logs

---

## 🚨 COMMON MISTAKES TO AVOID

1. **Using localhost for anything** - All development is against live domains
2. **Mixing environment configs** - Always use production variables
3. **Skipping deployment steps** - Every change must go through full deploy cycle
4. **Testing without verification** - Always check API health first
5. **Assuming local works = production works** - Only production testing counts

---

## 📞 EMERGENCY RECOVERY

If production breaks:
1. **Check Vercel deployment status**: `npx vercel ls`
2. **Redeploy last known good**: `npx vercel redeploy [deployment-url]`
3. **Verify database health**: `curl https://mobile.mindmeasure.app/api/database/health`
4. **Reset database schema if needed**: `curl -X POST https://mobile.mindmeasure.app/api/database/setup-tables`

---

## 📝 CHANGE LOG

- **2025-10-15**: Initial protocol created after resolving 3-week authentication issues
- **Next Update**: [Date] - [Changes made]

---

**⚠️ CRITICAL REMINDER: This document must be referenced before ANY development work. No exceptions.**
