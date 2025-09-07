# Pakistan Job Portal

A modern job portal inspired by PakistanJobsBank, with daily newspaper job ads uploaded by admin, displayed in a clean searchable UI.

## Overview

This project aims to digitize newspaper job advertisements from Pakistan and make them easily searchable and accessible online. It provides users with a clean and intuitive interface to search for jobs by keywords, categories, locations, and sources.

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/Sana-VU/job-portal.git
cd job-portal

# Start MongoDB and backend services
docker-compose up -d

# Seed database with sample data
docker-compose exec backend node scripts/seed-data.js

# Start frontend separately
cd frontend
npm install
npm run dev
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed instructions.

## Features

- Admin can upload job advertisements with structured data (title, organization, category, location, dates) and images of the actual newspaper ads
- Users can search and filter jobs by keywords, categories, locations, and sources
- Jobs display both structured information and the original scanned advertisement image
- SEO-friendly frontend using Next.js
- Backend APIs built with Express.js and MongoDB
- AI-generated visuals for demo content (no keys required)

## Tech Stack

### Frontend

- Next.js with TypeScript
- Tailwind CSS for styling
- React Icons
- Axios for API requests
- React Hook Form for form handling
- Date-fns for date formatting
- AI image helper backed by a public generation endpoint

### Backend

- Express.js for RESTful API
- MongoDB for database storage
- JWT for secure admin authentication
- Cloudinary for image hosting and storage
- Docker for containerization

## Authentication

The backend API uses JWT (JSON Web Token) authentication for admin operations:

### Admin Login

```bash
# Get an authentication token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobportal.com","password":"admin123"}'
```

### Protected Routes

The following routes require authentication:

- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

Example of using a protected route:

```bash
# Create a new job (authenticated request)
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Software Engineer",
    "organization": "Tech Company",
    "category": "IT",
    "location": "Lahore",
    "publishDate": "2023-09-01",
    "lastDate": "2023-10-01",
    "description": "Looking for a talented software engineer..."
  }'
```

## Monitoring and Error Tracking

The application includes comprehensive monitoring and error tracking features:

### Sentry Integration

- Real-time error tracking and reporting for both frontend and backend
- Performance monitoring and profiling
- Error grouping and alerts

### Health Monitoring

- Health endpoints for system monitoring:
  - `/api/health`: General system health check
  - `/api/health/db`: Database connection status
  - `/api/health/cloudinary`: Storage service status
  - `/api/health/memory`: System memory usage

### Monitoring Dashboard

- Admin monitoring dashboard with real-time metrics
- System status visualization using Chart.js
- Memory usage tracking and visualization
- Custom alert configuration

### Automated Monitoring with UptimeRobot

A script is provided to automate the setup of UptimeRobot monitoring:

```bash
# Install dependencies
npm install

# Set up UptimeRobot monitors
node scripts/setup-uptime-robot.js
```

### Email Alerts

- Configurable email alerts for system issues
- Custom thresholds for memory usage, API response time, and CPU usage

### Environment Variables

Authentication settings can be configured via environment variables:

- `JWT_SECRET`: Secret key for JWT signing (default: "jwt-secret-key")
- `ADMIN_EMAIL`: Admin email for login (default: "admin@jobportal.com")
- `ADMIN_PASSWORD`: Admin password for login (default: "admin123")
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name (required for image uploads)
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `CLOUDINARY_FOLDER`: Custom folder for uploads (default: "job-ads")

For production, create a `.env` file in the backend folder with secure values.

### Backend

- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer and Cloudinary for image uploads
- Express Validator for input validation
- CORS, Helmet, Morgan for security and logging
- Docker & Docker Compose for containerized deployment

## Project Structure

```
pakistan-job-portal/
├── backend/               # Backend API server
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── server.js          # Main server file
│   └── .env               # Environment variables (not committed to git)
│
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── utils/             # Utility functions
│   └── public/            # Static assets
│
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pakistan-job-portal.git
   cd pakistan-job-portal
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pakistanjobportal
   NODE_ENV=development
   # Add other environment variables as needed
   ```

5. Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Admin CMS

- Login at `/admin/login`. Default credentials are set via backend environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- Manage jobs at `/admin/jobs` (create, delete, upload image to Cloudinary).
- See `ADMIN-USER-GUIDE.md` for a non-technical walkthrough.

## AI Images

- The app uses a lightweight helper (`frontend/utils/aiImage.ts`) to render AI-generated images at runtime via a public endpoint.
- Used for demo visuals on the homepage, About page (team portraits, mission image), and job-detail fallback images.
- If the endpoint is unavailable, components still render gracefully with data-driven content.

## API Endpoints

### Jobs

- `GET /api/jobs` - Get all jobs (with filtering options)
- `GET /api/jobs/:id` - Get a specific job by ID
- `POST /api/jobs` - Create a new job (admin only)
- `PUT /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)

### Image Upload

- `POST /api/upload` - Upload an image (admin only)
  - Accepts multipart/form-data with `image` field
  - Optional `jobId` parameter to associate with a job listing
  - Returns image URL and public_id from Cloudinary

For detailed information about the image upload feature:

- See [IMAGE-UPLOAD-DOCS.md](./backend/IMAGE-UPLOAD-DOCS.md) for technical documentation
- See [IMAGE-UPLOAD-GUIDE.md](./backend/IMAGE-UPLOAD-GUIDE.md) for testing examples

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by PakistanJobsBank
- Built with modern web technologies
- Created for educational and demonstration purposes
