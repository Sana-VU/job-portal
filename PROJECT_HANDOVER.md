# Pakistan Job Portal - Project Handover Document

## Project Overview

The Pakistan Job Portal is a modern web application inspired by PakistanJobsBank, designed to digitize newspaper job advertisements from Pakistan and make them easily accessible online. The platform allows administrators to upload job advertisements with structured data and images of the actual newspaper ads, while users can search and filter jobs by various criteria.

## Tech Stack

### Frontend

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Additional Libraries**:
  - React Icons for UI icons
  - Date-fns for date formatting
  - React Hook Form for form handling

### Backend

- **Framework**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
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

   - Node.js (v14 or higher)
   - MongoDB (local or Atlas)

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   # Create .env file with MONGO_URI and PORT
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create .env.local file with NEXT_PUBLIC_API_URL
   npm run dev
   ```

## Testing

- Backend tests are written using Vitest
- Frontend component tests use Vitest and React Testing Library
- Run tests with `npm test` in respective directories

## Deployment Instructions

### Backend

1. Set up MongoDB Atlas cluster
2. Deploy to Render or Railway:
   - Connect to GitHub repository
   - Set environment variables (MONGO_URI, NODE_ENV=production)
   - Build command: `npm install`
   - Start command: `npm start`

### Frontend

1. Deploy to Vercel:
   - Connect to GitHub repository
   - Set environment variables (NEXT_PUBLIC_API_URL=backend-url)
   - Deploy

## Current Status and Roadmap

### Completed

- Basic backend API with CRUD operations
- Frontend homepage and job listing interfaces
- Job search and filtering functionality

### In Progress

- Admin authentication
- Image upload functionality
- Tests and bug fixes

### Future Plans

- User accounts and saved jobs
- Job application tracking
- Email notifications
- Mobile app version

## Known Issues

- Authentication not fully implemented
- Image upload feature needs implementation
- Some responsive design issues on specific mobile devices

## Additional Resources

- [Project README](./README.md)
- [Project Specification](./SPEC.md)
- [Backend TODO List](./TODO_BACKEND.md)
- [Frontend TODO List](./TODO_FRONTEND.md)
- [GitHub Issues](./GITHUB_ISSUES.md)

## Contact Information

For any questions or support regarding this project, please contact the previous developer or project manager.

---

_This document was created on September 5, 2025, and represents the current state of the project as of this date._
