# Backend Testing Guide

This document provides instructions for testing the backend features, including the image upload functionality.

## Prerequisites

Ensure you have the following installed:

- Node.js (v14+)
- Docker and Docker Compose
- Postman (optional, for API testing)
- curl (for command-line testing)

## Setup for Testing

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/yourusername/job-portal.git
   cd job-portal
   ```

2. Create a `.env` file in the backend folder:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Update the environment variables in the `.env` file with your Cloudinary credentials:

   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Testing Authentication

1. Log in as admin to get a JWT token:

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@jobportal.com","password":"admin123"}'
   ```

2. Save the token from the response:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

## Testing Job API Endpoints

### 1. Create a new job (authenticated)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Solutions Ltd",
    "location": "Karachi, Pakistan",
    "description": "We are looking for a skilled software engineer",
    "requirements": "5+ years of experience in web development",
    "salary": "$80,000 - $100,000",
    "contact": "jobs@techsolutions.pk",
    "deadline": "2024-12-31"
  }'
```

### 2. Get all jobs (public)

```bash
curl -X GET http://localhost:5000/api/jobs
```

### 3. Get job by ID (public)

```bash
curl -X GET http://localhost:5000/api/jobs/JOB_ID_HERE
```

### 4. Update a job (authenticated)

```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Software Engineer",
    "salary": "$90,000 - $110,000"
  }'
```

### 5. Delete a job (authenticated)

```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Image Upload

### 1. Using the provided test script

The `test-upload.sh` script automates the testing process:

```bash
# Make the script executable
chmod +x backend/test-upload.sh

# Edit the script to update configuration
nano backend/test-upload.sh

# Run the script
./backend/test-upload.sh
```

### 2. Manual testing with curl

```bash
# First get a JWT token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobportal.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | awk -F':' '{print $2}' | tr -d '\"')

# Upload an image
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### 3. Using Postman

1. Import the Postman collection from `backend/Job_Portal_API.postman_collection.json`
2. Run the "Login (Get Token)" request first
3. The token will be automatically set for subsequent requests
4. Use the "Upload Image" request and select a file to upload

## Testing Error Handling

### 1. Authentication errors

```bash
# Missing token
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/your/image.jpg"

# Invalid token
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer invalid_token" \
  -F "image=@/path/to/your/image.jpg"
```

### 2. Validation errors

```bash
# No file provided
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN"

# Non-image file
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/document.pdf"
```

## Automated Tests

Run the backend test suite:

```bash
cd backend
npm test
```

This will run all unit and integration tests, including tests for the image upload feature.

## Debugging Tips

1. Check Docker logs:

   ```bash
   docker-compose logs -f backend
   ```

2. Enable verbose logging by modifying the `.env` file:

   ```
   DEBUG=express:*,app:*
   ```

3. Use Cloudinary's test API endpoint to verify credentials:
   ```bash
   curl -v https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/ping \
     -u "$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET"
   ```

## Need Additional Help?

For more detailed information about the image upload feature, see:

- [IMAGE-UPLOAD-DOCS.md](./backend/IMAGE-UPLOAD-DOCS.md)
- [IMAGE-UPLOAD-GUIDE.md](./backend/IMAGE-UPLOAD-GUIDE.md)
