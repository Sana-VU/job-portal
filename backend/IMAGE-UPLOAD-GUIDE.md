# Image Upload Testing Guide

This document provides examples of how to test the image upload functionality.

## Prerequisites

1. The backend server should be running
2. You need a valid JWT token (obtained by logging in as an admin)

## Get a JWT Token

First, get a JWT token by logging in as an admin:

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobportal.com","password":"admin123"}' | \
  grep -o '"token":"[^"]*"' | awk -F':' '{print $2}' | tr -d '\"')

echo $TOKEN
```

## Upload an Image

### Upload an image without associating with a job:

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### Upload an image and associate it with a job:

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/image.jpg" \
  -F "jobId=68bbd39e5a88ebc147ae2366"
```

## Expected Response

A successful upload will return a response like:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1631234567/job-ads/abcdefg.jpg",
  "public_id": "job-ads/abcdefg",
  "jobId": "68bbd39e5a88ebc147ae2366" // Only included if a jobId was provided
}
```

## Common Errors

### Unauthorized (401)

If your token is invalid or missing:

```json
{
  "message": "Authorization denied. No token provided."
}
```

### Bad Request (400)

If no image is provided:

```json
{
  "success": false,
  "message": "Please provide an image file"
}
```

If the file is too large:

```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB"
}
```

### Server Error (500)

If there's an issue with Cloudinary or other internal errors:

```json
{
  "success": false,
  "message": "Image upload failed"
}
```

## Notes

- The maximum file size is 5MB
- Only image files are accepted
- You must be authenticated as an admin to use this endpoint
- Images are stored in the "job-ads" folder in Cloudinary (or custom folder if set in environment variables)
