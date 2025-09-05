# Backend TODOs

## server.js

// TODO: Setup Express.js server
// - Import express, mongoose, dotenv, cors
// - Connect to MongoDB using MONGO_URI
// - Add middleware: express.json(), cors()
// - Mount jobRoutes at /api/jobs
// - Start server on PORT

## models/jobModel.js

// TODO: Define Job schema with Mongoose
// Fields: title, organization, category (enum), location, source, publishDate, lastDate, description, adImage, tags
// Add timestamps

## routes/jobRoutes.js

// TODO: Express Router for Jobs
// Endpoints:
// - POST /api/jobs → create job
// - GET /api/jobs → get all jobs (filters: keyword, category, location, source)
// - GET /api/jobs/:id → get single job
// - PUT /api/jobs/:id → update job
// - DELETE /api/jobs/:id → delete job
