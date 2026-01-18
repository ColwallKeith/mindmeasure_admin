# Mind Measure Development Protocol - Master Document
## Single Source of Truth for Architecture, Development & Deployment

**Created**: October 15, 2025  
**Last Updated**: November 28, 2025  
**Status**: ACTIVE - Must be referenced before ANY development work  
**Purpose**: Complete guide to Mind Measure architecture, development workflow, and deployment procedures

---

## 📋 TABLE OF CONTENTS

1. [Core Development Principles](#core-principles)
2. [System Architecture Overview](#architecture)
3. [Mobile App Development & Deployment](#mobile-app)
4. [Assessment Engine (NEW)](#assessment-engine)
5. [Authentication & Database](#auth-database)
6. [Deployment Workflows](#deployment)
7. [Monitoring & Maintenance](#monitoring)
8. [Emergency Procedures](#emergency)

---

<a name="core-principles"></a>
## 🎯 CORE DEVELOPMENT PRINCIPLES

### **1. Production-First Development**
**There is NO local development environment. Production IS our development environment.**

- ❌ **NO localhost:3000 development**
- ❌ **NO local API servers**  
- ❌ **NO mixing environments**
- ✅ **ALL development against live domains**
- ✅ **Production = Development = Testing**

### **2. Mandatory Pre-Work Protocol**
**This protocol was created after 2 days of lost work. NEVER skip these steps.**

Before ANY major work:
1. ✅ **Read DEVELOPMENT_PROTOCOL.md first**
2. ✅ **Read ALL relevant documentation**
3. ✅ **Understand existing architecture**
4. ✅ **Ask clarifying questions** - Never assume
5. ✅ **Get explicit approval** for architectural changes
6. ✅ **Test frequently** during development
7. ✅ **Deploy incrementally** - Don't wait

### **3. User Flow Preservation**
**NEVER replace sophisticated user flows without explicit permission.**

Existing flows (DO NOT CHANGE):
```
New User:
Splash → Registration → Baseline Welcome → Baseline Assessment → Dashboard

Returning User (No Baseline):
Returning Splash → Baseline Welcome → Baseline Assessment → Dashboard

Returning User (With Baseline):
Returning Splash → Dashboard
```

**Rule**: Integrate new systems BEHIND existing screens, not instead of them.

---

<a name="architecture"></a>
## 🌐 SYSTEM ARCHITECTURE OVERVIEW

### **Platform Structure**

| Domain | Purpose | Access | Technology Stack |
|--------|---------|--------|-----------------|
| `mobile.mindmeasure.app` | **Student Mobile App** | iOS/Android Apps + Web API | React + Capacitor + Vercel + Aurora |
| `admin.mindmeasure.co.uk` | **Admin Dashboard** | Web browsers only | React + Vercel + Aurora |
| `mindmeasure.co.uk` | **Marketing Site** | Web browsers | Static site |
| `https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1/` | **Assessment Engine API** | Mobile app via Cognito JWT | AWS Lambda + Step Functions + Aurora |

### **AWS Account & Region**
- **Account ID**: 459338929203
- **Region**: eu-west-2 (London)
- **Cognito User Pool**: eu-west-2_ClAG4fQXR
- **Cognito Client ID**: 7vu03ppv6alkpphs1ksopll8us

### **Database Architecture**
- **Host**: mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com
- **Database**: mindmeasure
- **Type**: Aurora Serverless v2 (PostgreSQL)
- **Access**: Via Vercel serverless functions + Lambda functions
- **Schemas**: 
  - `public` - Main app tables
  - `assessment_engine` - New multimodal assessment tables (6 tables)

---

<a name="mobile-app"></a>
## 📱 MOBILE APP DEVELOPMENT & DEPLOYMENT

### **Required Environment Variables**
```bash
# REQUIRED for ALL builds
export VITE_API_BASE_URL=https://mobile.mindmeasure.app/api
export VITE_AWS_REGION=eu-west-2
export VITE_AWS_COGNITO_USER_POOL_ID=eu-west-2_ClAG4fQXR
export VITE_AWS_COGNITO_CLIENT_ID=7vu03ppv6alkpphs1ksopll8us
export VITE_BACKEND_PROVIDER=aurora-serverless
export VITE_DB_HOST=mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com
export VITE_DB_PORT=5432
export VITE_DB_NAME=mindmeasure
```

### **MANDATORY BUILD & DEPLOY SEQUENCE**

**⚠️ CRITICAL**: Before running `npm run build` or `npx vercel`, ALWAYS stop and ask:  
**"Ready to deploy? This will take 5-6 minutes."**  
Wait for explicit user confirmation before proceeding.

```bash
# 1. Set environment variables (above)

# 2. Build with production config
npm run build

# 3. Deploy to Vercel (updates mobile.mindmeasure.app)
npx vercel --prod

# 4. Ensure domain alias is correct
npx vercel alias mobile.mindmeasure.app

# 5. Sync to Capacitor for mobile testing
npx cap sync ios

# 6. Test on device
npx cap run ios
```

### **Verification Checklist**
Before any mobile testing:
- [ ] API endpoints return 200: `curl https://mobile.mindmeasure.app/api/database/health`
- [ ] Database schema exists
- [ ] Cognito configuration matches environment variables
- [ ] Mobile app logs show correct API base URL
- [ ] Capacitor config points to `https://mobile.mindmeasure.app` (NOT localhost)

### **Mobile App API Endpoints**
**Base URL**: `https://mobile.mindmeasure.app/api`

- `GET /api/database/health` - Health check
- `POST /api/database/select` - Query data
- `POST /api/database/insert` - Insert data
- `POST /api/database/update` - Update data
- `POST /api/database/delete` - Delete data
- `POST /api/database/setup-tables` - Create/update schema

---

<a name="assessment-engine"></a>
## 🧠 ASSESSMENT ENGINE (NEW - Deployed Nov 28, 2025)

### **Overview**
Standalone serverless module for multimodal wellbeing assessment using:
- **23 audio features** (prosody, speech dynamics, voice quality)
- **18 visual features** (emotion, expression, gaze, head pose - from still images)
- **16 text features** (sentiment, emotion, cognitive load, resilience)

**Output**: Mind Measure Score (0-100) with uncertainty, direction, and risk level.

### **Architecture**
```
Mobile App → API Gateway → 3 HTTP Lambdas → Step Functions → 
  → Parallel Analysis (Audio, Visual, Text Lambdas) → 
  → Fusion Engine Lambda → 
  → Aurora Database (assessment_engine schema)
```

### **API Endpoints**
**Base URL**: `https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1/`

**Endpoints:**
- `POST /checkins/start` - Create check-in, get S3 upload URLs
- `POST /checkins/{id}/complete` - Start processing pipeline
- `GET /checkins/{id}` - Get status and results

**Authentication**: Cognito JWT (same user pool as mobile app)

### **AWS Resources Deployed**

**Lambda Functions (10):**
- CheckInStartLambda (512MB, 30s)
- CheckInCompleteLambda (512MB, 30s)
- CheckInGetLambda (512MB, 15s)
- AudioAnalysisLambda (2048MB, 60s)
- VisualAnalysisLambda (3008MB, 90s)
- TextAnalysisLambda (1024MB, 30s)
- FusionEngineLambda (1024MB, 30s)
- BaselineUpdateLambda (512MB, 15s)
- MarkCheckInCompleteLambda (512MB, 15s)
- MarkCheckInFailedLambda (512MB, 15s)

**Other Resources:**
- S3 Bucket: `mindmeasure-checkin-media-staging` (90-day retention)
- Step Functions: CheckInStateMachine785DC833-VyX9ebODxxhN
- API Gateway: REST API with Cognito authorizer
- CloudWatch: Log groups for all Lambdas

### **Database Schema (assessment_engine)**

**⚠️ Status**: Schema NOT yet deployed (password authentication issue)

**Tables to create**:
1. `check_ins` - Main check-in records
2. `audio_analysis` - 23 audio feature columns
3. `visual_analysis` - 18 visual feature columns  
4. `text_analysis` - 16 text feature columns
5. `fusion_results` - Final Mind Measure scores
6. `user_baselines` - Personal baseline data

**Migration file**: `assessment-engine/migrations/checkin-pipeline-v2.sql`

**To run migration** (once password issue resolved):
```bash
cd assessment-engine
PGPASSWORD="CORRECT_PASSWORD" psql \
  -h mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com \
  -U mindmeasure_admin \
  -d mindmeasure \
  -f migrations/checkin-pipeline-v2.sql
```

### **Integration with Mobile App**

**Step 1: Add API URL to config**
```typescript
// mobile-app/src/config/assessmentEngine.ts
export const ASSESSMENT_ENGINE_API = 
  'https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1';
```

**Step 2: Feature flag for gradual rollout**
```typescript
export const USE_ASSESSMENT_ENGINE = (userId: string) => {
  return ['keith@mindmeasure.co.uk', 'test1@uni.ac.uk'].includes(userId);
};
```

**Step 3: Wire into check-in flow**
See `assessment-engine/MOBILE_APP_INTEGRATION.md` for complete guide.

**Key points:**
- Same ElevenLabs conversation flow (different agent for check-ins)
- Capture 8-12 still images during conversation
- Upload to S3, then poll for results
- Display score in existing dashboard
- Existing conversation context system works in parallel

### **Cost Estimate**
**Per check-in**: ~$0.01  
**Monthly (1,000 students × 7 check-ins/week)**: ~$400/month

**Breakdown:**
- Lambda execution: $0.0007
- Rekognition (10 images): $0.01
- Comprehend: $0.0001
- Step Functions: $0.000025
- S3 & API Gateway: ~$0.0001

### **Monitoring**
**CloudWatch Log Groups:**
```
/aws/lambda/CheckInStartLambda
/aws/lambda/AudioAnalysisLambda
/aws/lambda/VisualAnalysisLambda
/aws/lambda/TextAnalysisLambda
/aws/lambda/FusionEngineLambda
/aws/states/CheckInStateMachine785DC833-VyX9ebODxxhN
```

**View logs:**
```bash
aws logs tail /aws/lambda/CheckInStartLambda --follow --region eu-west-2
```

### **Deployment & Rollback**

**Deploy updates:**
```bash
cd assessment-engine
npm run build
cd infrastructure/cdk
npx cdk deploy --context env=staging
```

**Rollback:**
```bash
# Disable in mobile app immediately
export const USE_ASSESSMENT_ENGINE = false;

# Destroy AWS resources (if needed)
cd assessment-engine/infrastructure/cdk
npx cdk destroy --force
```

---

<a name="auth-database"></a>
## 🔐 AUTHENTICATION & DATABASE

### **AWS Cognito Configuration**
- **User Pool**: eu-west-2_ClAG4fQXR
- **Client ID**: 7vu03ppv6alkpphs1ksopll8us
- **Region**: eu-west-2
- **Email Provider**: AWS SES (keith@mindmeasure.co.uk)

### **Authentication Flow States**
1. **New User**: Registration → Email Verification → Sign In → Splash/Baseline Flow
2. **Returning User**: Sign In → Splash/Dashboard Flow
3. **Unverified Email**: Redirect to Email Verification
4. **Password Reset**: Verify Email → Reset Code → New Password

### **Database Access Patterns**

**From Mobile App** (via Vercel API):
```typescript
fetch('https://mobile.mindmeasure.app/api/database/select', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ table: 'profiles', limit: 10 })
});
```

**From Assessment Engine** (via pg client in Lambda):
```typescript
import { db } from './shared/database';
const checkIn = await db.getCheckIn(checkInId);
await db.insertAudioAnalysis({ ... });
```

---

<a name="deployment"></a>
## 🚀 DEPLOYMENT WORKFLOWS

### **Mobile App Deployment**

**BEFORE ANY DEPLOYMENT:**
1. ✅ Read this document
2. ✅ Verify production status (check API health)
3. ✅ Set environment variables
4. ✅ Test current deployment
5. ✅ Ask user: "Ready to deploy? This will take 5-6 minutes."
6. ✅ Wait for explicit confirmation

**Standard deployment:**
```bash
# 1. Set env vars (see Mobile App section above)
# 2. Build
npm run build
# 3. Deploy to Vercel
npx vercel --prod
# 4. Alias domain
npx vercel alias mobile.mindmeasure.app
# 5. Sync to iOS
npx cap sync ios
# 6. Test
npx cap run ios
```

**Verification:**
- [ ] App loads on iOS device
- [ ] Auth works (sign in/sign up)
- [ ] Database queries work
- [ ] ElevenLabs conversation works
- [ ] Dashboard loads data

### **Assessment Engine Deployment**

**Deploy infrastructure:**
```bash
cd assessment-engine
npm run build
cd infrastructure/cdk
npx cdk deploy --context env=staging
```

**Deploy database schema** (once password resolved):
```bash
cd assessment-engine
PGPASSWORD="PASSWORD" psql -h ... -d mindmeasure -f migrations/checkin-pipeline-v2.sql
```

**Test API:**
```bash
export JWT_TOKEN="..." # Get from Cognito
curl -X POST "https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1/checkins/start" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily"}'
```

### **Admin Dashboard Deployment**
```bash
cd admin-dashboard
npm run build
npx vercel --prod
npx vercel alias admin.mindmeasure.co.uk
```

---

<a name="monitoring"></a>
## 📊 MONITORING & MAINTENANCE

### **Health Checks**

**Mobile App:**
```bash
curl https://mobile.mindmeasure.app/api/database/health
# Expected: {"status":"healthy","database":"connected"}
```

**Assessment Engine:**
```bash
curl https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1/checkins/start \
  -H "Authorization: Bearer $JWT_TOKEN"
# Expected: 401 Unauthorized (if no token) or 200 OK (with valid token)
```

### **CloudWatch Dashboards**
https://eu-west-2.console.aws.amazon.com/cloudwatch/home?region=eu-west-2

**Key Metrics:**
- Check-in completion rate (target: >95%)
- Processing time (target: <120s P95)
- Lambda error rate (target: <1%)
- API Gateway 5xx errors (target: near zero)

### **Cost Monitoring**
```bash
aws ce get-cost-and-usage \
  --time-period Start=2025-11-01,End=2025-11-30 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --region us-east-1
```

**Expected monthly costs:**
- Mobile app (Vercel): ~$50/month
- Aurora: ~$50-100/month
- Assessment Engine: ~$400/month (at 1,000 students)
- **Total: ~$500-550/month**

### **Database Maintenance**

**Check table sizes:**
```sql
SELECT 
  schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname IN ('public', 'assessment_engine')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Vacuum & analyze:**
```sql
VACUUM ANALYZE;
```

---

<a name="emergency"></a>
## 🚨 EMERGENCY PROCEDURES

### **If Mobile App Breaks**

**Immediate actions:**
1. ❌ **STOP** - Don't make more changes
2. 🔄 **ROLLBACK** - Redeploy last known good version
3. 📋 **CHECK LOGS** - Vercel deployment logs + CloudWatch
4. ✅ **VERIFY** - Test with actual mobile device
5. 📝 **DOCUMENT** - What broke and why

**Rollback command:**
```bash
# Find last good deployment
npx vercel ls mobile.mindmeasure.app

# Rollback to specific deployment
npx vercel rollback mobile.mindmeasure.app <deployment-url>
```

### **If Assessment Engine Fails**

**Immediate actions:**
1. 🚩 **DISABLE FEATURE FLAG** - Turn off for all users
   ```typescript
   export const USE_ASSESSMENT_ENGINE = false;
   ```
2. 📋 **CHECK LOGS** - CloudWatch Lambda + Step Functions logs
3. 🔍 **IDENTIFY ISSUE** - Which Lambda is failing?
4. 🔧 **FIX OR ROLLBACK** - Fix bug or destroy stack

**Destroy Assessment Engine stack:**
```bash
cd assessment-engine/infrastructure/cdk
npx cdk destroy --force
```

### **If Database Connection Lost**

**Check database status:**
```bash
aws rds describe-db-clusters \
  --db-cluster-identifier mindmeasure-aurora \
  --region eu-west-2
```

**Restart cluster if needed:**
```bash
aws rds reboot-db-cluster \
  --db-cluster-identifier mindmeasure-aurora \
  --region eu-west-2
```

### **If Cognito Issues**

**Check user pool:**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-2_ClAG4fQXR \
  --region eu-west-2
```

**Verify client app:**
```bash
aws cognito-idp describe-user-pool-client \
  --user-pool-id eu-west-2_ClAG4fQXR \
  --client-id 7vu03ppv6alkpphs1ksopll8us \
  --region eu-west-2
```

---

## 📚 DOCUMENTATION INDEX

### **Core Documentation (This Repo)**
- **DEVELOPMENT_PROTOCOL_MASTER.md** (this file) - Complete development guide
- **DEVELOPMENT_PROTOCOL.md** - Original protocol (now superseded)
- **AI_ASSISTANT_PROTOCOL.md** - Rules for AI development work
- **BUILD_PIPELINE.md** - Safe build process
- **SYNC_PROCESS.md** - Core to mobile porting

### **Assessment Engine Documentation**
Location: `/assessment-engine/`

- **DEPLOYMENT_SUMMARY.md** - Nov 28, 2025 deployment results
- **LETS_DEPLOY.md** - Executive deployment guide
- **DEPLOYMENT_GUIDE.md** - Comprehensive 662-line manual
- **MOBILE_APP_INTEGRATION.md** - Mobile app integration steps
- **DASHBOARD_INTEGRATION.md** - Dashboard wiring guide
- **README.md** - Architecture overview
- **docs/FUSION_ALGORITHM_IMPLEMENTATION.md** - Mathematical specification
- **docs/VISUAL_FEATURES_STILL_IMAGES_V1.1.md** - Still-image visual pipeline

### **Online Documentation**
- **https://docs.mindmeasure.co.uk** - Public documentation site
- **Mobile App Guide**: https://docs.mindmeasure.co.uk/mobile
- **Admin UI Guide**: https://docs.mindmeasure.co.uk/admin-ui
- **Methodology**: https://docs.mindmeasure.co.uk/methodology

---

## ✅ QUICK REFERENCE CHECKLIST

### **Before Starting ANY Development**
- [ ] Read DEVELOPMENT_PROTOCOL_MASTER.md (this file)
- [ ] Read relevant section-specific documentation
- [ ] Understand existing architecture - never assume
- [ ] Ask clarifying questions
- [ ] Get explicit approval for architectural changes

### **Before Mobile App Deployment**
- [ ] Set ALL environment variables
- [ ] Test API health endpoints
- [ ] Ask: "Ready to deploy? This will take 5-6 minutes."
- [ ] Wait for user confirmation
- [ ] Build, deploy Vercel, alias domain, sync iOS

### **Before Assessment Engine Changes**
- [ ] Check CloudWatch logs for current status
- [ ] Test API endpoints with curl
- [ ] Build Lambda code: `npm run build`
- [ ] Deploy via CDK: `cdk deploy --context env=staging`
- [ ] Verify in AWS Console

### **After ANY Deployment**
- [ ] Verify health check endpoints
- [ ] Test authentication flow
- [ ] Check database connectivity
- [ ] Test core user flows
- [ ] Monitor CloudWatch logs for 10 minutes

---

## 🎯 SUCCESS CRITERIA

**Mobile App Deployment is successful when:**
- ✅ App loads on iOS device
- ✅ Sign in/sign up works
- ✅ Database queries return data
- ✅ ElevenLabs conversation works
- ✅ Dashboard displays user data
- ✅ No errors in browser console or device logs

**Assessment Engine is successful when:**
- ✅ API returns 401 without JWT, 200 with valid JWT
- ✅ `/start` endpoint returns presigned S3 URLs
- ✅ Database tables exist and are accessible
- ✅ Step Functions executions complete successfully
- ✅ Mind Measure scores are in reasonable range (10-90)

---

## 📞 SUPPORT & TROUBLESHOOTING

### **Common Issues**

**1. "Database connection failed"**
- Check environment variables are set correctly
- Verify Aurora cluster is running
- Test with psql command line
- Check VPC security groups

**2. "Cognito authentication failed"**
- Verify User Pool ID and Client ID
- Check user email is verified
- Confirm app client settings
- Review CloudWatch Logs for Cognito Lambda triggers

**3. "Assessment Engine 500 errors"**
- Check Lambda CloudWatch logs
- Verify IAM permissions
- Confirm database schema is deployed
- Test Step Functions manually

**4. "Mobile app won't load"**
- Verify Vercel deployment succeeded
- Check Capacitor config points to mobile.mindmeasure.app
- Clear iOS app cache and rebuild
- Check browser console for errors

### **Getting Help**
1. **Check relevant documentation** in `/assessment-engine/` or this file
2. **Review CloudWatch logs** for specific error messages
3. **Test with curl** to isolate API vs app issues
4. **Check AWS Console** for resource status
5. **Review commit history** to identify recent changes

---

## 🔄 VERSION HISTORY

| Date | Version | Changes |
|------|---------|---------|
| Oct 15, 2025 | 1.0 | Initial DEVELOPMENT_PROTOCOL.md created |
| Nov 28, 2025 | 2.0 | **Assessment Engine deployed** - Complete rewrite as master document incorporating deployment results |

---

**Last Updated**: November 28, 2025, 12:00 PM GMT  
**Maintained By**: Keith Duddy + AI Assistant  
**Next Review**: Before next major feature deployment

---

**This is the single source of truth for Mind Measure development. Bookmark this document and reference it before ANY development work.**


