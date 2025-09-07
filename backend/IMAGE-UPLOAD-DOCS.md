# Image Upload Feature Documentation

## Overview

The image upload feature allows authenticated users to upload images to the job portal. These images can be associated with job listings or used for other purposes within the application.

## Technical Implementation

### Technologies Used

- **Multer**: Middleware for handling multipart/form-data, used for file uploads
- **Cloudinary**: Cloud service for image and video management
- **Express**: Web framework for Node.js

### File Structure

```
backend/
├── cloudinary.js       # Cloudinary configuration
├── routes/
│   └── uploadRoutes.js # Upload route handlers
└── server.js           # Main server file with route registration
```

### Configuration

The image upload feature uses the following environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=job-ads       # Optional, defaults to "job-ads"
```

### API Endpoints

#### POST /api/upload

Uploads an image file to Cloudinary and optionally associates it with a job listing.

**Authentication Required**: Yes (JWT Bearer Token)

**Request Body**:

- `image` (required): The image file to upload (multipart/form-data)
- `jobId` (optional): The ID of the job listing to associate with the image

**Response**:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1631234567/job-ads/abcdefg.jpg",
  "public_id": "job-ads/abcdefg",
  "jobId": "68bbd39e5a88ebc147ae2366" // Only included if a jobId was provided
}
```

## Security Measures

1. **Authentication**: All uploads require a valid JWT token
2. **File Validation**:
   - Only image files are accepted (MIME type validation)
   - Maximum file size: 5MB
3. **Secure Upload**: Files are uploaded directly to Cloudinary without being saved to disk
4. **Resource Cleanup**: If an upload fails, any temporary resources are properly cleaned up

## Usage in Frontend

To use the uploaded images in the frontend, store the returned URL in your job listing or related entity. The URL can be used directly in an image tag:

```jsx
<img src={job.imageUrl} alt={job.title} />
```

## Testing

You can test the image upload functionality using:

1. The provided `test-upload.sh` script
2. The Postman collection `Job_Portal_API.postman_collection.json`
3. The curl commands in the `IMAGE-UPLOAD-GUIDE.md` file

## Troubleshooting

### Common Issues

1. **401 Unauthorized**:
   - Ensure you're providing a valid JWT token
   - Check that the token hasn't expired

2. **400 Bad Request**:
   - Check that you're sending a valid image file
   - Ensure the file size is under 5MB

3. **500 Server Error**:
   - Check Cloudinary credentials in your environment variables
   - Verify that your Cloudinary account is active and has sufficient resources

### Debugging Tips

1. Enable verbose logging by setting `DEBUG=multer:*` environment variable
2. Check server logs for detailed error messages
3. Verify Cloudinary connection by using their API test endpoint

## Future Improvements

1. Add support for image compression before upload
2. Implement image optimization through Cloudinary's transformation API
3. Add a file browser/manager interface for uploaded images
