# Pakistan Job Portal - Project Handover Document

## Project Overview

The Pakistan Job Portal is a modern web application inspired by PakistanJobsBank, designed to digitize newspaper job advertisements from Pakistan and make them easily accessible online. The platform allows administrators to upload job advertisements with structured data and images of the actual newspaper ads, while users can search and filter jobs by various criteria.

## Tech Stack

### Frontend

- **Framework**: Next.js 15.5.2 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Additional Libraries**:
  - React Icons for UI icons
  - Date-fns for date formatting
  - React Hook Form for form handling

### Backend

- **Framework**: Node.js v22.14.0 + Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM v8.18.0
- **Authentication**: JWT (planned but not fully implemented)
- **Validation**: Express Validator
- **Security**: CORS, Helmet, Morgan for security and logging

## Project Structure

```
pakistan-job-portal/
├── backend/               # Express API server
│   ├── models/            # Mongoose models
│   │   └── jobModel.js    # Job model schema
│   ├── routes/            # API routes
│   │   └── jobRoutes.js   # Job CRUD endpoints
│   ├── tests/             # Backend tests
│   └── server.js          # Main server file
│
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js app router
│   │   ├── page.tsx       # Homepage
│   │   ├── layout.tsx     # Root layout
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   └── jobs/          # Job listings and details
│   ├── components/        # React components
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── Navbar.tsx
│   │   └── SearchBar.tsx
│   ├── utils/             # Utility functions
│   │   └── api.ts         # API client
│   └── public/            # Static assets
│
├── README.md              # Project documentation
├── SPEC.md                # Project specification
├── TODO_BACKEND.md        # Backend tasks
└── TODO_FRONTEND.md       # Frontend tasks
```

## Features Implemented

### Backend

1. **Job Model**: MongoDB schema with fields for title, organization, category, location, publish date, last date, image URL, etc.
2. **API Endpoints**:
   - `GET /api/jobs` - Get all jobs with filtering and pagination
   - `GET /api/jobs/:id` - Get a specific job by ID
   - `POST /api/jobs` - Create a new job (admin only)
   - `PUT /api/jobs/:id` - Update a job (admin only)
   - `DELETE /api/jobs/:id` - Delete a job (admin only)
3. **Input Validation**: Using Express Validator for request validation
4. **Error Handling**: Proper error responses with appropriate status codes
5. **Health Check Endpoint**: `GET /api/health` to check server status

### Frontend

1. **Homepage**: Features hero section, stats, and latest job opportunities
2. **Job Cards**: Display job information in a visually appealing card format
3. **Job Details Page**: View detailed information about a specific job
4. **Search & Filter**: Search jobs by keyword, category, location
5. **Responsive Design**: Mobile-friendly layout using Tailwind CSS

## Features Planned But Not Implemented

1. **Admin Authentication**: JWT-based admin login
2. **Image Upload**: Integration with Cloudinary for uploading newspaper ad images
3. **Job Alerts**: Email/SMS notifications for new job postings
4. **AI Resume Parsing**: Matching resumes with job requirements

## API Documentation

### Jobs API

#### Get All Jobs

- **Endpoint**: `GET /api/jobs`
- **Query Parameters**:
  - `keyword` (string): Search text across title, organization, description
  - `category` (string): Filter by job category
  - `location` (string): Filter by job location
  - `source` (string): Filter by publication source
  - `page` (number): Pagination page number
  - `limit` (number): Results per page
- **Response**: List of jobs with pagination metadata

#### Get Single Job

- **Endpoint**: `GET /api/jobs/:id`
- **Response**: Detailed job information

#### Create Job

- **Endpoint**: `POST /api/jobs`
- **Body**: Job object with required fields
- **Response**: Created job object

#### Update Job

- **Endpoint**: `PUT /api/jobs/:id`
- **Body**: Updated job fields
- **Response**: Updated job object

#### Delete Job

- **Endpoint**: `DELETE /api/jobs/:id`
- **Response**: Success message

## Development Environment Setup

1. **Prerequisites**:

   - Node.js (v22 or higher)
   - MongoDB (local or Atlas)
   - Git
   - Docker and Docker Compose (for containerized setup)

2. **Initial Setup**:

   ```bash
   # Clone the repository
   git clone https://github.com/Sana-VU/job-portal.git
   cd job-portal
   ```

3. **Backend Setup**:

   ```bash
   cd backend
   npm install

   # Create .env file
   echo "PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017
   MONGO_DB=job-portal
   NODE_ENV=development
   JWT_SECRET=dev_dev_dev_change_me
   CORS_ORIGIN=http://localhost:3000" > .env

   # Start development server
   npm run dev
   ```

4. **Frontend Setup**:

   ```bash
   cd frontend
   npm install

   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

   # Start development server
   npm run dev
   ```

5. **Database Setup**:

   - Install MongoDB locally or use MongoDB Atlas
   - The application will create necessary collections on first run
   - Sample data can be imported using the provided script:
     ```bash
     cd backend
     node scripts/seed-data.js
     ```

6. **Docker Setup (Alternative)**:
   - Use Docker Compose to run MongoDB and backend services:

     ```bash
     # Start services
     docker-compose up -d

     # Seed database
     docker-compose exec backend node scripts/seed-data.js
     ```

   - See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions

## Testing and Code Quality

### Testing Framework

- Backend tests are written using Vitest
- Frontend component tests use Vitest and React Testing Library
- Run tests with `npm test` in respective directories

### Test Coverage

- Backend: Unit tests for models and API endpoints
- Frontend: Component tests for major UI elements
- Current test coverage is approximately 60%

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality Tools

- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- TypeScript for type checking in the frontend

### Continuous Integration

- GitHub Actions is set up to run tests on every push
- Test coverage reports are generated during CI runs

## Deployment Instructions

### Backend Deployment

1. **Set up MongoDB Atlas cluster**:

   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Configure network access and database users
   - Get your connection string

2. **Deploy to Render**:

   - Create a new Web Service on Render
   - Connect to GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `PORT`: 8080 (Render default)
     - `NODE_ENV`: production
     - `JWT_SECRET`: A secure random string

3. **Alternative: Deploy to Railway**:
   - Create new project and link to GitHub
   - Select the repository and backend directory
   - Add environment variables (same as above)
   - Deploy

### Frontend Deployment

1. **Deploy to Vercel**:

   - Import project from GitHub repository
   - Configure build settings:
     - Framework preset: Next.js
     - Root directory: frontend
     - Build command: `npm run build`
     - Output directory: .next
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - Deploy

2. **Alternative: Deploy to Netlify**:
   - Connect to GitHub repository
   - Set base directory: frontend
   - Set build command: `npm run build`
   - Set publish directory: frontend/.next
   - Add environment variables as above

### Deployment Checklist

- [ ] Update CORS settings in backend to allow production frontend URL
- [ ] Test all API endpoints after deployment
- [ ] Configure custom domain if needed
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and logging services

## Current Status and Roadmap

### Completed

- Backend API with CRUD operations for jobs
- MongoDB integration with proper schema and indexing
- Health check endpoint returning DB connection status
- Frontend homepage and job listing interfaces with responsive design
- Job search and filtering functionality by keyword, category, location, etc.
- Job details page with complete job information display
- Sample data seeding script with realistic job postings
- Environment configuration for both backend and frontend

### In Progress

- Admin authentication
- Image upload functionality
- SVG image handling in Next.js (currently shows warnings about dangerouslyAllowSVG)
- Tests and bug fixes

### Future Plans

- User accounts and saved jobs
- Job application tracking
- Email notifications
- Mobile app version

## Known Issues

- Authentication not fully implemented
- Image upload feature needs implementation
- SVG handling in Next.js: Current warnings about SVG images requiring the "unoptimized" property in the Image component
- Some responsive design issues on specific mobile devices
- Warning about multiple lockfiles detected in Next.js (can be resolved by setting `outputFileTracingRoot` in next.config.js)

## Additional Resources

- [Project README](./README.md)
- [Project Specification](./SPEC.md)
- [Backend TODO List](./TODO_BACKEND.md)
- [Frontend TODO List](./TODO_FRONTEND.md)
- [GitHub Issues](./GITHUB_ISSUES.md)

## Repository Information

The project is hosted on GitHub at:

- Repository URL: https://github.com/Sana-VU/job-portal.git
- Main Branch: main

### Version Control Workflow

1. **Branch Strategy**:

   - `main`: Production-ready code
   - `develop`: Integration branch for features
   - Feature branches: For new features (e.g., `feature/user-authentication`)
   - Hotfix branches: For urgent fixes (e.g., `hotfix/login-bug`)

2. **Contribution Process**:
   - Create a new branch from `develop` for each feature
   - Submit a pull request to merge into `develop`
   - Regularly merge `develop` into `main` for releases

### CI/CD Setup

- GitHub Actions workflow is included for Continuous Integration
- Tests are run automatically on pull requests
- Automated deployment is planned but not fully configured

## Environment Setup

### Environment Variables

#### Backend (.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=job-portal
NODE_ENV=development
JWT_SECRET=dev_dev_dev_change_me
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Post-Handover Steps

For steps that need to be completed after the handover, please refer to the [POST_HANDOVER_STEPS.md](./POST_HANDOVER_STEPS.md) file.

## Contact Information

For any questions or support regarding this project, please contact:

- Project Manager: [Project Manager Name] - [email@example.com]
- Lead Developer: [Lead Developer Name] - [email@example.com]
- Repository Owner: Sana-VU - [GitHub Profile](https://github.com/Sana-VU)

## Running the Application

### Option 1: Standard Setup

#### Starting the Backend

```bash
cd backend
npm install
node server.js
```

The backend will start on port 5000. You can access the health endpoint at http://localhost:5000/api/health and the jobs endpoint at http://localhost:5000/api/jobs.

#### Seeding Sample Data

```bash
cd backend
node scripts/seed-data.js
```

This will populate the MongoDB database with sample job postings that can be viewed in the frontend.

#### Starting the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on port 3000. You can access it at http://localhost:3000.

### Option 2: Docker Setup

Run the entire stack (MongoDB + Backend) with Docker:

```bash
# Start services
docker-compose up -d

# Seed database
docker-compose exec backend node scripts/seed-data.js

# Start frontend separately
cd frontend
npm install
npm run dev
```

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

---

_This document was last updated on September 6, 2025, and represents the current state of the project as of this date._
