# Pakistan Job Portal

A modern job portal inspired by PakistanJobsBank, with daily newspaper job ads uploaded by admin, displayed in a clean searchable UI.

## Overview

This project aims to digitize newspaper job advertisements from Pakistan and make them easily searchable and accessible online. It provides users with a clean and intuitive interface to search for jobs by keywords, categories, locations, and sources.

## Features

- Admin can upload job advertisements with structured data (title, organization, category, location, dates) and images of the actual newspaper ads
- Users can search and filter jobs by keywords, categories, locations, and sources
- Jobs display both structured information and the original scanned advertisement image
- SEO-friendly frontend using Next.js
- Backend APIs built with Express.js and MongoDB

## Tech Stack

### Frontend

- Next.js with TypeScript
- Tailwind CSS for styling
- React Icons
- Axios for API requests
- React Hook Form for form handling
- Date-fns for date formatting

### Backend

- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer and Cloudinary for image uploads
- Express Validator for input validation
- CORS, Helmet, Morgan for security and logging

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

## API Endpoints

### Jobs

- `GET /api/jobs` - Get all jobs (with filtering options)
- `GET /api/jobs/:id` - Get a specific job by ID
- `POST /api/jobs` - Create a new job (admin only)
- `PUT /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by PakistanJobsBank
- Built with modern web technologies
- Created for educational and demonstration purposes
