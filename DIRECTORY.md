# Project Directory Structure

## Root Directory

```
job-portal/
├── .github/workflows/            # GitHub Actions workflows
│   └── ci.yml                    # Continuous Integration workflow
├── backend/                      # Backend code (Express.js + MongoDB)
├── frontend/                     # Frontend code (Next.js)
├── BACKEND-TESTING-GUIDE.md      # Guide for testing backend features
├── DOCKER_SETUP.md               # Docker setup instructions
├── docker-compose.yml            # Docker Compose configuration
├── GITHUB_ISSUES.md              # GitHub issues documentation
├── POST_HANDOVER_STEPS.md        # Post handover instructions
├── PROGRESS.md                   # Project progress tracking
├── PROJECT_HANDOVER.md           # Project handover documentation
├── README.md                     # Main project documentation
├── SPEC.md                       # Project specifications
├── TODO_BACKEND.md               # Backend tasks to be completed
├── TODO_FRONTEND.md              # Frontend tasks to be completed
├── TODO-V2.md                    # Version 2 tasks
└── TODO-V3.md                    # Version 3 tasks
```

## Backend Directory

```
backend/
├── __tests__/                    # Backend test files
│   ├── jobs.api.spec.ts          # Jobs API tests
│   └── model.spec.ts             # Database model tests
├── coverage/                     # Test coverage reports
├── middleware/                   # Express middleware
│   └── auth.js                   # Authentication middleware
├── models/                       # Database models
│   └── jobModel.js               # Job schema and model
├── routes/                       # API routes
│   ├── authRoutes.js             # Authentication routes
│   ├── jobRoutes.js              # Job CRUD routes
│   └── uploadRoutes.js           # Image upload routes
├── scripts/                      # Utility scripts
│   └── seed-data.js              # Database seeding script
├── tests/                        # Test files
│   ├── dummy.test.js             # Dummy test file
│   └── jobs.test.js              # Jobs test file
├── .dockerignore                 # Docker ignore file
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example environment variables
├── cloudinary.js                 # Cloudinary configuration
├── Dockerfile                    # Docker configuration
├── IMAGE-UPLOAD-DOCS.md          # Image upload documentation
├── IMAGE-UPLOAD-GUIDE.md         # Guide for testing image upload
├── Job_Portal_API.postman_collection.json  # Postman API collection
├── package.json                  # Node.js dependencies
├── server.js                     # Main server file
├── test-upload.sh                # Script to test image upload
├── vitest.config.js              # Vitest configuration
└── vitest.config.ts              # Vitest TypeScript configuration
```

## Frontend Directory

```
frontend/
├── app/                          # Next.js app directory
│   ├── about/                    # About page
│   ├── categories/               # Categories pages
│   ├── contact/                  # Contact page
│   ├── jobs/                     # Job pages
│   │   ├── [id]/                 # Job detail page (dynamic route)
│   │   └── page.tsx              # Jobs listing page
│   ├── locations/                # Locations pages
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # Robots.txt generator
│   └── sitemap.ts                # Sitemap generator
├── components/                   # React components
│   ├── Footer.tsx                # Footer component
│   ├── JobCard.spec.tsx          # JobCard tests
│   ├── JobCard.tsx               # Job card component
│   ├── Navbar.test.tsx           # Navbar tests
│   ├── Navbar.tsx                # Navigation bar component
│   ├── SearchBar.test.tsx        # SearchBar tests
│   └── SearchBar.tsx             # Search bar component
├── public/                       # Static files
│   ├── images/                   # Image assets
│   ├── file.svg                  # File icon
│   ├── globe.svg                 # Globe icon
│   ├── next.svg                  # Next.js logo
│   ├── vercel.svg                # Vercel logo
│   └── window.svg                # Window icon
├── src/                          # Source files
│   └── types/                    # TypeScript type definitions
├── tests/                        # Frontend tests
│   ├── setup.js                  # Test setup
│   └── types.d.ts                # Test type definitions
├── utils/                        # Utility functions
│   └── api.ts                    # API utility functions
├── .env.local                    # Local environment variables (not in git)
├── eslint.config.mjs             # ESLint configuration
├── IMAGE-DISPLAY-GUIDE.md        # Guide for displaying images in frontend
├── next.config.js                # Next.js configuration
├── next.config.ts                # Next.js TypeScript configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # Frontend dependencies
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Frontend documentation
├── SEO-IMPLEMENTATION-STATUS.md  # SEO implementation status
├── SEO-PAGES-IMPLEMENTATION.md   # SEO pages implementation docs
├── tailwind.config.js            # Tailwind CSS configuration
├── TEST-SEO-COMMANDS.md          # SEO testing commands
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.js              # Vitest configuration
├── vitest.config.ts              # Vitest TypeScript configuration
└── vitest.setup.ts               # Vitest setup
```

## Key Files and Their Purposes

### Backend Core Files

- `backend/server.js`: The main entry point for the Express server
- `backend/models/jobModel.js`: Defines the MongoDB schema for job listings
- `backend/routes/jobRoutes.js`: API endpoints for job CRUD operations
- `backend/routes/authRoutes.js`: Authentication endpoints
- `backend/routes/uploadRoutes.js`: Image upload endpoints
- `backend/middleware/auth.js`: JWT authentication middleware
- `backend/cloudinary.js`: Configuration for Cloudinary image uploads

### Frontend Core Files

- `frontend/app/page.tsx`: Home page component
- `frontend/app/jobs/page.tsx`: Jobs listing page
- `frontend/app/jobs/[id]/page.tsx`: Job detail page
- `frontend/components/JobCard.tsx`: Job card component for listings
- `frontend/components/SearchBar.tsx`: Search functionality component
- `frontend/utils/api.ts`: API utility functions for data fetching

### Configuration Files

- `docker-compose.yml`: Docker Compose configuration for development
- `backend/.env.example`: Example environment variables for backend
- `frontend/next.config.js`: Next.js configuration
- `frontend/tailwind.config.js`: Tailwind CSS configuration

### Documentation Files

- `README.md`: Main project documentation
- `SPEC.md`: Project specifications
- `backend/IMAGE-UPLOAD-DOCS.md`: Image upload documentation
- `frontend/IMAGE-DISPLAY-GUIDE.md`: Frontend image display guide
- `BACKEND-TESTING-GUIDE.md`: Guide for testing backend features

## Project Structure Details

### Backend Architecture

The backend follows a standard Express.js application structure:

- **Models**: Database schemas and models
- **Routes**: API endpoints and controllers
- **Middleware**: Authentication and request processing
- **Tests**: Unit and integration tests

### Frontend Architecture

The frontend is built with Next.js App Router:

- **App Directory**: Page components organized by route
- **Components**: Reusable React components
- **Public**: Static assets
- **Utils**: Utility functions for API calls and helpers

### API Routes

- `/api/jobs`: CRUD operations for job listings
- `/api/auth/login`: Authentication endpoint
- `/api/upload`: Image upload endpoint with Cloudinary integration
