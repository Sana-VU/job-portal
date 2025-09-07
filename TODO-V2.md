# Backend Bring‑Up & DB Attach Playbook

**Goal:** Fix the three blocking issues **now**:

1. **Backend not working**
2. **Database not attached** (Mongo not connecting / no data)
3. **Other pages not working** (Next.js routes / API integration)

When these pass local checks, we’ll move to deployment.

---

## ☑️ Quick Fix Checklist (10–15 min)

- [ ] Confirm Node & PNPM/NPM versions
- [ ] Install deps cleanly in **backend** and **frontend**
- [ ] Create correct **.env** files
- [ ] Start **MongoDB** locally (or Atlas) and test connection
- [ ] Boot **backend** → check `/api/health`
- [ ] Seed a few jobs
- [ ] Boot **frontend** → jobs list should render

> Follow the copy‑paste blocks below in order.

---

## 0) Environment sanity

```bash
node -v
# expect v18.x or v20.x (Next 13/14/15 + Mongoose friendly)

# Optional: use nvm
# nvm install 18 && nvm use 18

# Windows users: run terminal as Administrator (PowerShell) for Docker/local Mongo if needed.
```

---

## 1) Fresh install & folder layout

```bash
# clone if you haven’t
# git clone https://github.com/Sana-VU/job-portal.git
cd job-portal

# BACKEND
cd backend
rm -rf node_modules package-lock.json
npm install

# FRONTEND
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 2) Backend .env (correct values)

Create/update `backend/.env`:

```bash
cd ../backend
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=job-portal
JWT_SECRET=dev_dev_dev_change_me
NODE_ENV=development
# allow local Next.js
CORS_ORIGIN=http://localhost:3000
EOF
```

> **Note:** We separate `MONGO_URI` and `MONGO_DB`. Mongoose will use both cleanly.

---

## 3) Start MongoDB (choose ONE)

### Option A — Local Mongo via Docker (fastest)

```bash
docker run -d --name mongo-jobportal -p 27017:27017 -v mongo-data:/data/db mongo:7
```

### Option B — MongoDB Community (installed locally)

- Start the MongoDB service (Windows Services / `mongod`).

### Option C — Atlas (cloud)

- Create a free cluster. Allow your IP. Get SRV connection string.
- Then set in `backend/.env` (use your string, include DB via `MONGO_DB` or in URI):

```bash
MONGO_URI="mongodb+srv://<user>:<pass>@<cluster-host>/"
MONGO_DB=job-portal
```

---

## 4) Robust server bootstrap (drop‑in replacement)

> If you already have these files, **sync the key parts** below.

**`backend/server.js`**

```js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "*").split(","),
    credentials: true,
  })
);
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Health endpoint with DB state
app.get("/api/health", async (_req, res) => {
  const map = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({
    status: "ok",
    db: map[mongoose.connection.readyState] ?? "unknown",
  });
});

app.use("/api/jobs", jobRoutes);

const start = async () => {
  const port = process.env.PORT || 5000;
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB || "job-portal",
    });
    console.log("✅ MongoDB connected");
    app.listen(port, () => console.log(`✅ API listening on :${port}`));
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

start();
export default app;
```

**`backend/models/jobModel.js`** (minimal, safe defaults)

```js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    category: { type: String, index: true },
    location: { type: String, index: true },
    publishDate: { type: Date, required: true },
    lastDate: { type: Date, required: true },
    source: { type: String },
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", organization: "text", description: "text" });

export default mongoose.model("Job", jobSchema);
```

**`backend/routes/jobRoutes.js`** (simple + filters)

```js
import { Router } from "express";
import Job from "../models/jobModel.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      location,
      source,
      page = 1,
      limit = 10,
    } = req.query;
    const q = {};
    if (keyword) q.$text = { $search: String(keyword) };
    if (category) q.category = category;
    if (location) q.location = location;
    if (source) q.source = source;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Job.find(q).sort({ publishDate: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(q),
    ]);

    res.json({ items, page: Number(page), limit: Number(limit), total });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const one = await Job.findById(req.params.id);
    if (!one) return res.status(404).json({ message: "Not found" });
    res.json(one);
  } catch (e) {
    next(e);
  }
});

export default router;
```

**Express error handler (optional, recommended):**

```js
// add at the end of server.js
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});
```

---

## 5) Start backend & smoke test

```bash
cd backend
npm run dev
# or: npm start
```

In another terminal:

```bash
curl -s http://localhost:5000/api/health | jq
```

**Expected:** `{ "status": "ok", "db": "connected" }`

---

## 6) Seed sample jobs (ensures UI has data)

Create `backend/scripts/seed-data.js`:

```js
import mongoose from "mongoose";
import "dotenv/config";
import Job from "../models/jobModel.js";

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || "job-portal",
  });
  await Job.deleteMany({});
  await Job.insertMany([
    {
      title: "Assistant Director (IT)",
      organization: "Estate Office Management",
      category: "Government",
      location: "Islamabad",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      source: "Newspaper",
      imageUrl: "",
      description: "Upload scanned ad and structured fields.",
    },
    {
      title: "Junior Web Developer",
      organization: "Private Software House",
      category: "IT",
      location: "Lahore",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      source: "Website",
      imageUrl: "",
      description: "React/Node stack.",
    },
  ]);
  console.log("Seeded jobs ✔");
  await mongoose.connection.close();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});
```

Run:

```bash
cd backend
node scripts/seed-data.js
curl -s "http://localhost:5000/api/jobs?limit=2" | jq
```

---

## 7) Frontend .env and API client

Create/update `frontend/.env.local`:

```bash
cd ../frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
```

Ensure `frontend/utils/api.ts` uses the env base URL:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

export default api;
```

Start the app:

```bash
npm run dev
# visit http://localhost:3000
```

You should see latest jobs on the home or `/jobs` page.

---

## 8) "Other pages not working" — route audit & quick fixes

**Check what pages exist:**

```bash
cd frontend
node -e "const fs=require('fs'),p='./app';function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const x=d+'/'+f.name;if(f.isDirectory())w(x);else if(/^page\.(t|j)sx?$/.test(f.name))console.log(x)}}w(p)"
```

✅ You should have (at minimum):

- `app/page.tsx` (home)
- `app/jobs/page.tsx` (list)
- `app/jobs/[id]/page.tsx` (details)
- `app/about/page.tsx`, `app/contact/page.tsx`
- `app/layout.tsx` exporting a root layout

**Common fixes:**

- Every `page.tsx` must `export default function Page()` (or any default component).
- Use `next/link` for navigation. Example navbar:

```tsx
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="p-4 border-b flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/jobs">Jobs</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

- Data fetching from API in server components (Next app router):

```tsx
// app/jobs/page.tsx
async function getJobs() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jobs?limit=20`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export default async function Page() {
  const data = await getJobs();
  return <pre>{JSON.stringify(data.items, null, 2)}</pre>;
}
```

If you prefer Axios, use it in client components only (`"use client"`).

**404/500 tracing:**

- Open DevTools → Network. Look for failing `GET /api/...` calls → CORS? wrong base URL? 404 from backend?
- Console errors like `TypeError: fetch failed` → backend not up / wrong URL.

---

## 9) CORS & same‑origin pain

- Backend must allow `http://localhost:3000` (we added via `CORS_ORIGIN`).
- If you see `CORS policy` errors, confirm server logs show the request and no 500.

---

## 10) Tests (optional now, but useful)

```bash
# Backend
cd backend
npm test

# Frontend
cd ../frontend
npm test
```

---

## 11) Commit & push (atomic, clear message)

```bash
cd ../backend
git add -A
git commit -m "fix(api): robust server bootstrap, mongo attach, health; add seed script"
cd ../frontend
git add -A
git commit -m "fix(ui): jobs route wiring; env-based API baseURL; navbar links"

git push origin main
```

---

## 12) Common failure → quick answers

- **`ECONNREFUSED 127.0.0.1:27017`** → Mongo not running / wrong port. Start Docker container or service.
- **`MongooseServerSelectionError`** (Atlas) → whitelist IP, correct user/pass, SRV string.
- **`CORS` error** → verify `CORS_ORIGIN` matches frontend origin exactly.
- **Next 404** → missing `page.tsx` or wrong folder. Remember `app/<route>/page.tsx`.
- **Axios base URL undefined** → `NEXT_PUBLIC_API_URL` missing in `.env.local` and rebuild dev server.

---

## ✅ Verification before moving to deployment

- [ ] `curl http://localhost:5000/api/health` returns `{ status: "ok", db: "connected" }`
- [ ] `curl http://localhost:5000/api/jobs?limit=1` returns an array item
- [ ] Home page loads; `/jobs` shows seeded jobs; clicking a job opens its details page
- [ ] No CORS errors in browser console

When all are green, we’ll proceed to deployment steps.

---

## 📌 GitHub issue labels (mark the blockers)

Create issues and apply labels:

- **type:bug** — Backend fails to start / Mongo not connecting
- **area:backend** — API health, routes, seed
- **area:frontend** — App router pages, API integration
- **prio:high** — Must fix before deploy

Suggested issues:

1. `Backend cannot connect to MongoDB`
2. `Add robust /api/health with db state`
3. `Seed script + sample data`
4. `Next app router: jobs list and details broken`
5. `CORS allow localhost:3000; add CORS_ORIGIN env`

---

## 🧠 Final Optimized Prompt (use with ChatGPT/Copilot)

> Copy‑paste the full prompt below when you want an AI to review/fix this repo locally. Update any paths if different.

````
You are a senior full‑stack engineer. Repository: Pakistan Job Portal.
Tech: Backend = Node/Express/Mongoose. Frontend = Next.js (app router), TypeScript, Tailwind, Axios.

**Task**: Make backend run, attach MongoDB, and make jobs pages work locally. Then output exact copy‑paste commands and minimal code diffs.

**Constraints & Standards**:
- Node v18+; use Mongoose strictQuery.
- Env: backend/.env with PORT=5000, MONGO_URI, MONGO_DB=job-portal, NODE_ENV=development, CORS_ORIGIN=http://localhost:3000. Frontend/.env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api.
- Health endpoint must report DB state: /api/health → { status: "ok", db: "connected" }.
- Jobs API supports GET /api/jobs with filters (keyword, category, location, source, page, limit) and GET /api/jobs/:id.
- Add seed script to insert 2–3 sample jobs.
- Next.js pages: app/page.tsx, app/jobs/page.tsx, app/jobs/[id]/page.tsx; data fetched via fetch() from NEXT_PUBLIC_API_URL.
- CORS must allow http://localhost:3000.

**Deliverables**:
1) List exact terminal commands to:
   - install deps, start Mongo (Docker), create .env files, run backend, run frontend, run seed, and curl health & jobs.
2) Provide minimal file PATCHES for:
   - backend/server.js (robust bootstrap + health)
   - backend/models/jobModel.js (schema + index)
   - backend/routes/jobRoutes.js (list + details)
   - backend/scripts/seed-data.js (2 sample jobs)
   - frontend/utils/api.ts (axios baseURL)
   - app/jobs/page.tsx and app/jobs/[id]/page.tsx (fetch + render)
3) Troubleshooting notes for common errors (ECONNREFUSED, CORS, 404).

**Output Format**:
- Use bash blocks for commands (runnable as-is on Windows WSL or macOS/Linux).
- Use unified diffs for files (```diff). Keep changes minimal and production-safe.
- Do NOT ask me questions; assume defaults above and proceed.

Begin now.
````

---

## What to share back after running steps

- Terminal output of `npm run dev` (backend) first 20 lines
- Output of `curl http://localhost:5000/api/health`
- Screenshot/snippet of `/jobs` page with seeded items

With those, we can confirm all green and jump to deployment.
