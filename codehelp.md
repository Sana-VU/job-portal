# 🤖 Copilot Helper Guide — Pakistan Job Portal

This document contains **ready-to-use prompts** and **context** you can paste into GitHub Copilot Chat to generate or update code in the Pakistan Job Portal project.

---

## 🟢 General Prompt Templates

### Basic Development Prompt

```
You are my coding assistant.
Repo: Pakistan Job Portal.
Backend: Node 22 + Express 5 + Mongo (Mongoose).
Frontend: Next.js 15 (App Router, TS, Tailwind).

Task: [describe task].

Constraints:
- Use existing file structure and conventions.
- Keep code minimal and production-safe.
- Show exact code patches (unified diff).
- Show copy-paste commands (bash) to test.
```

### Debugging Prompt

```
You are my debugging assistant.
Repo: Pakistan Job Portal.
Backend: Node 22 + Express 5 + Mongo (Mongoose).
Frontend: Next.js 15 (App Router, TS, Tailwind).

Error: [paste error message]

Context:
[paste relevant code or logs]

Task: Help me debug this issue.

Constraints:
- Suggest specific fixes with code examples.
- Show logging statements I could add.
- Suggest tests to verify the fix.
```

### Feature Implementation Prompt

```
You are my feature implementation assistant.
Repo: Pakistan Job Portal.
Backend: Node 22 + Express 5 + Mongo (Mongoose).
Frontend: Next.js 15 (App Router, TS, Tailwind).

Feature: [describe feature]

Requirements:
- [list requirements]

Files that might need changing:
- [list files]

Constraints:
- Follow existing code patterns.
- Include error handling.
- Show unit tests for the feature.
```

---

## 🔐 Step 2 — Admin Authentication

**Prompt:**

```
Add a login route in backend/routes/authRoutes.js that accepts email+password and returns a JWT.
Create backend/middleware/auth.js to protect routes.
Update backend/routes/jobRoutes.js so POST/PUT/DELETE are protected with auth.
Update backend/server.js to use authRoutes.
Show diffs and test commands.
```

**Testing Commands:**

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobportal.com","password":"admin123"}'

# Test protected endpoint (should fail without token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","company":"Test Company"}'

# Test protected endpoint with token (should succeed)
TOKEN="your_jwt_token"
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Job","company":"Test Company"}'
```

---

## 🛡️ Step 3 — API Hardening

**Prompt:**

```
In backend/server.js:
- Add Helmet, CORS with origin from env, and rate limiting (120 req/min).
- Add /api/version endpoint returning commit SHA from env.COMMIT_SHA or 'dev'.
In backend/models/jobModel.js:
- Add compound index { category, location, publishDate }.
Show diffs and curl commands to test.
```

**Testing Commands:**

```bash
# Test rate limiting
for i in {1..130}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/jobs
  sleep 0.5
done

# Test version endpoint
curl http://localhost:5000/api/version

# Test CORS headers
curl -v -H "Origin: http://example.com" http://localhost:5000/api/jobs
```

---

## 🌐 Step 4 — SEO & Pages

**Prompt:**

```
In frontend/app/jobs/[id]/page.tsx:
- Add JSON-LD JobPosting schema in a <script type="application/ld+json"> tag.

Create frontend/app/sitemap.ts:
- Dynamic sitemap listing /, /jobs, /jobs/[id], categories, locations.

Create frontend/app/robots.ts:
- Allow all bots, disallow /admin and /api, point to sitemap.

Add category and location listing pages:
- frontend/app/categories/[category]/page.tsx
- frontend/app/locations/[location]/page.tsx
Each fetches from API with filters and renders a list.

Show unified diffs and commands to test (/sitemap.xml, /robots.txt).
```

**Testing Commands:**

```bash
# Test sitemap
curl http://localhost:3000/sitemap.xml

# Test robots.txt
curl http://localhost:3000/robots.txt

# Test category page
curl http://localhost:3000/categories/IT

# Test location page
curl http://localhost:3000/locations/Karachi

# Test JSON-LD schema (view source in browser)
curl http://localhost:3000/jobs/1 | grep -A 20 "application/ld+json"
```

---

## 🖼️ Step 5 — Image Upload

**Prompt:**

```
In backend/cloudinary.js configure Cloudinary v2 from env.

Create backend/routes/uploadRoutes.js:
- POST /api/upload (auth required)
- Accept 'image' via multer memoryStorage (limit 5MB)
- Upload to Cloudinary folder from env.CLOUDINARY_FOLDER
- If jobId provided, update job.imageUrl

Update backend/server.js to use /api/upload.
Update backend/models/jobModel.js to ensure imageUrl exists.

Show diffs and curl command to test upload with Bearer token.
```

**Testing Commands:**

```bash
# Get an authentication token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobportal.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | awk -F':' '{print $2}' | tr -d '\"')

# Upload an image
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/test-image.jpg"

# Upload an image and associate with a job
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/test-image.jpg" \
  -F "jobId=your_job_id_here"
```

---

## � Step 6 — Admin CMS

**Prompt:**

```
Create an admin CMS in Next.js app router.

Files:
- frontend/lib/admin/auth.ts (localStorage token helpers)
- frontend/lib/admin/api.ts (API wrapper with token)
- frontend/app/admin/layout.tsx (auth guard + nav)
- frontend/app/admin/login/page.tsx (login form)
- frontend/app/admin/jobs/page.tsx (list jobs, delete)
- frontend/app/admin/jobs/new/page.tsx (create job)
- frontend/app/admin/jobs/[id]/edit/page.tsx (edit job)
- frontend/components/admin/JobForm.tsx (reusable form)

Constraints:
- Use client components with useState/useEffect.
- Store token in localStorage.
- Redirect unauthenticated users to /admin/login.

Show diffs and steps to test:
- Login (/admin/login)
- List jobs (/admin/jobs)
- Create/edit job with image upload.
```

**Testing Flow:**

1. Start the development server: `npm run dev` in the frontend directory
2. Navigate to `/admin/login` in your browser
3. Login with admin credentials
4. Test the job listing at `/admin/jobs`
5. Test creating a new job at `/admin/jobs/new`
6. Test editing a job at `/admin/jobs/[id]/edit`

---

## 📈 Step 7 — Monitoring

**Prompt:**

```
Integrate Sentry SDK in backend/server.js and frontend (app/layout.tsx).
- Use DSN from env.SENTRY_DSN.
- Capture unhandled errors.

Add uptime monitoring docs (e.g. UptimeRobot) for /api/health and /api/version.

Create backend/routes/healthRoutes.js with:
- GET /api/health (returns status of MongoDB connection, Cloudinary)

Show code snippets and setup instructions.
```

**Testing Commands:**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test version endpoint
curl http://localhost:5000/api/version

# Test error capturing (should be logged in Sentry)
curl http://localhost:5000/api/non-existent-route
```

---

## 🧪 Testing Specific Features

### Testing Authentication

**Prompt:**

```
Help me write a test file for the authentication system.
Create backend/__tests__/auth.spec.js that:
- Tests JWT token generation and verification
- Tests auth middleware
- Tests login endpoint with valid and invalid credentials
- Mocks dependencies

Show the test code and how to run it.
```

**Running the Tests:**

```bash
cd backend
npx vitest run __tests__/auth.spec.js
```

### Testing Image Upload

**Prompt:**

```
Help me write a test file for the image upload functionality.
Create backend/__tests__/upload.spec.js that:
- Mocks Cloudinary responses
- Tests file validation (size, type)
- Tests authentication requirement
- Tests successful upload cases
- Tests error handling

Show the test code and how to run it.
```

**Running the Tests:**

```bash
cd backend
npx vitest run __tests__/upload.spec.js
```

### Testing Frontend Components

**Prompt:**

```
Help me write tests for the JobCard component.
Update frontend/components/JobCard.spec.tsx to:
- Test rendering with and without an image
- Test interaction events (clicking)
- Test loading states
- Test error states

Use React Testing Library and show how to run the tests.
```

**Running the Tests:**

```bash
cd frontend
npm test -- JobCard.spec.tsx
```

---

## 🔄 Data Migration Scripts

**Prompt:**

```
Create a script to migrate existing job data to a new schema.
Create backend/scripts/migrate-jobs.js that:
- Adds new required fields to existing jobs
- Validates and fixes any malformed data
- Logs progress and errors
- Can be run safely multiple times

Show the script code and how to run it safely.
```

**Running the Migration:**

```bash
# Dry run first (doesn't save changes)
cd backend
node scripts/migrate-jobs.js --dry-run

# Real migration
node scripts/migrate-jobs.js
```

---

## 📊 Implementing Analytics

**Prompt:**

```
Implement Google Analytics in the frontend.
Create:
- frontend/utils/analytics.ts with tracking functions
- Update frontend/app/layout.tsx to initialize GA
- Add event tracking to key user actions (search, view job, apply)

Show code and instructions for testing in development safely.
```

**Testing Analytics:**

```bash
# Set environment variables for development
echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" >> frontend/.env.local
echo "NEXT_PUBLIC_ENABLE_ANALYTICS=false" >> frontend/.env.local

# Start the dev server with analytics enabled for testing
NEXT_PUBLIC_ENABLE_ANALYTICS=true npm run dev
```

---

## 🔍 Troubleshooting Common Issues

### MongoDB Connection Issues

**Prompt:**

```
I'm getting MongoDB connection errors in the backend. Help me debug this issue.

Error: MongoNetworkError: failed to connect to server [...] on first connect

Current connection string format:
MONGO_URI=mongodb://localhost:27017/job-portal

Suggest debugging steps and potential fixes.
```

### Next.js Build Errors

**Prompt:**

```
My Next.js build is failing with errors about missing dependencies or invalid imports.

Error details:
[error details here]

Help me troubleshoot this issue and suggest fixes.
```

### JWT Authentication Issues

**Prompt:**

```
Users are reporting that they're being logged out frequently or authentication is failing.

Current JWT setup:
- Token expiry: 24 hours
- Stored in localStorage
- No refresh token mechanism

Suggest improvements to make the authentication more robust.
```

---

## ✅ How to Use

1. Copy the relevant **Prompt** into GitHub Copilot Chat in VS Code.
2. Review the diffs Copilot suggests.
3. Apply and test using the provided bash commands or curl requests.
4. Commit changes with descriptive messages.

---

This guide ensures you and Copilot stay aligned on **where files go, what code style to use, and how to test quickly**. Add more custom prompts as the project grows!
