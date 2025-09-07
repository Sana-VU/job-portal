# Deployment Guide - Pakistan Job Portal

This guide provides comprehensive instructions for deploying the Pakistan Job Portal application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Domain and SSL](#domain-and-ssl)
7. [Monitoring Setup](#monitoring-setup)
8. [Backup Configuration](#backup-configuration)
9. [Security Checklist](#security-checklist)
10. [Post-Deployment](#post-deployment)

## Prerequisites

### Required Services

- **MongoDB Atlas** or **MongoDB instance** (recommended: MongoDB Atlas)
- **Cloudinary account** for image storage
- **Sentry account** for error monitoring
- **UptimeRobot account** for uptime monitoring
- **Domain name** and **SSL certificate**

### Required Tools

- **Node.js 22+** and **npm**
- **Docker** and **Docker Compose** (optional)
- **Git**
- **AWS CLI** (for S3 backups)

## Environment Setup

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Sandbox is free)
3. Create a database user with read/write permissions
4. Whitelist your server IP addresses
5. Get your connection string

### 2. Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Create a folder for job portal images

### 3. Sentry Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for Node.js
3. Get your DSN from project settings

## Database Setup

### MongoDB Atlas Configuration

```bash
# Connection string format
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB=job-portal
```

### Database Indexes

The application will automatically create the necessary indexes on first run. For production, consider creating additional indexes based on your query patterns.

## Backend Deployment

### Option 1: Render (Recommended)

1. **Connect Repository**

   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Select the backend directory

2. **Configure Service**

   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   Environment: Node
   ```

3. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   MONGO_DB=job-portal
   JWT_SECRET=your_secure_jwt_secret_here
   CORS_ORIGIN=https://your-frontend-domain.com
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=job-portal
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@your-domain.com
   ADMIN_EMAIL=admin@your-domain.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

### Option 2: Railway

1. **Connect Repository**

   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory

2. **Configure Service**

   - Railway will auto-detect Node.js
   - Set the start command: `npm start`

3. **Environment Variables**
   - Add the same environment variables as Render

### Option 3: DigitalOcean App Platform

1. **Create App**

   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Create a new app from GitHub

2. **Configure Service**

   ```
   Source: GitHub repository
   Branch: main
   Build Command: cd backend && npm install
   Run Command: cd backend && npm start
   ```

3. **Environment Variables**
   - Add the same environment variables as Render

### Option 4: Docker Deployment

1. **Build Image**

   ```bash
   cd backend
   docker build -t job-portal-backend .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name job-portal-backend \
     -p 5000:5000 \
     -e NODE_ENV=production \
     -e MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ \
     -e MONGO_DB=job-portal \
     -e JWT_SECRET=your_secure_jwt_secret_here \
     -e CORS_ORIGIN=https://your-frontend-domain.com \
     -e SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id \
     -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
     -e CLOUDINARY_API_KEY=your_api_key \
     -e CLOUDINARY_API_SECRET=your_api_secret \
     job-portal-backend
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the frontend directory

2. **Configure Build**

   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```

### Option 2: Netlify

1. **Connect Repository**

   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Configure Build**

   ```
   Base Directory: frontend
   Build Command: npm run build
   Publish Directory: frontend/.next
   ```

3. **Environment Variables**
   - Add the same environment variables as Vercel

### Option 3: Static Export

1. **Configure Next.js**

   ```javascript
   // next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: "export",
     trailingSlash: true,
     images: {
       unoptimized: true,
     },
   };

   module.exports = nextConfig;
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   # Deploy the 'out' directory to any static hosting service
   ```

## Domain and SSL

### 1. Domain Configuration

1. **Purchase Domain**

   - Buy a domain from providers like Namecheap, GoDaddy, or Cloudflare

2. **DNS Configuration**

   ```
   Type: A
   Name: @
   Value: Your server IP address

   Type: CNAME
   Name: www
   Value: your-domain.com

   Type: CNAME
   Name: api
   Value: your-backend-domain.com
   ```

### 2. SSL Certificate

Most hosting providers offer free SSL certificates:

- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL
- **Render**: Automatic SSL
- **Railway**: Automatic SSL
- **DigitalOcean**: Let's Encrypt integration

## Monitoring Setup

### 1. Sentry Configuration

1. **Backend Sentry**

   - Add `SENTRY_DSN` to backend environment variables
   - Errors will be automatically captured

2. **Frontend Sentry**
   - Add `NEXT_PUBLIC_SENTRY_DSN` to frontend environment variables
   - Client-side errors will be captured

### 2. UptimeRobot Setup

1. **Create Monitors**

   ```bash
   # Set your API key
   export UPTIMEROBOT_API_KEY=your_api_key_here

   # Set your URLs
   export BASE_URL=https://your-backend-domain.com
   export FRONTEND_URL=https://your-frontend-domain.com

   # Run setup script
   node scripts/setup-uptime-robot.js
   ```

2. **Manual Setup**
   - Create monitors for:
     - Backend health: `https://your-backend-domain.com/api/health`
     - Frontend: `https://your-frontend-domain.com`
     - Jobs API: `https://your-backend-domain.com/api/jobs`

### 3. Health Checks

Test your endpoints:

```bash
# Backend health
curl https://your-backend-domain.com/api/health

# Frontend
curl https://your-frontend-domain.com

# Version info
curl https://your-backend-domain.com/api/version
```

## Backup Configuration

### 1. Database Backups

1. **Setup Automated Backups**

   ```bash
   # On your server
   cd backend
   chmod +x scripts/setup-backup-cron.sh
   ./scripts/setup-backup-cron.sh
   ```

2. **S3 Configuration**

   ```bash
   # Environment variables for S3 upload
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_BUCKET=your-backup-bucket
   AWS_REGION=us-east-1
   ```

3. **Manual Backup**
   ```bash
   cd backend
   node scripts/backup-db.js
   ```

### 2. MongoDB Atlas Backups

MongoDB Atlas provides automatic backups for paid clusters. For free clusters, use the manual backup script.

## Security Checklist

### 1. Environment Variables

- [ ] All sensitive data is in environment variables
- [ ] No secrets in code or configuration files
- [ ] Strong JWT secret (32+ characters)
- [ ] Secure admin password
- [ ] Database credentials are secure

### 2. CORS Configuration

- [ ] CORS origin is set to your frontend domain only
- [ ] No wildcard (\*) origins in production

### 3. Rate Limiting

- [ ] Rate limiting is enabled (120 req/min)
- [ ] Appropriate limits for your use case

### 4. SSL/TLS

- [ ] HTTPS is enabled for all endpoints
- [ ] SSL certificate is valid and auto-renewing
- [ ] HTTP redirects to HTTPS

### 5. Database Security

- [ ] Database user has minimal required permissions
- [ ] IP whitelist is configured
- [ ] Connection string uses SSL

### 6. Monitoring

- [ ] Error tracking is configured
- [ ] Uptime monitoring is active
- [ ] Logs are being collected
- [ ] Alerts are configured

## Post-Deployment

### 1. Initial Setup

1. **Seed Database**

   ```bash
   # Connect to your backend and run
   node scripts/seed-data.js
   ```

2. **Test All Endpoints**

   ```bash
   # Health check
   curl https://your-backend-domain.com/api/health

   # Jobs API
   curl https://your-backend-domain.com/api/jobs

   # Admin login
   curl -X POST https://your-backend-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@your-domain.com","password":"your_password"}'
   ```

3. **Test Frontend**
   - Visit your frontend URL
   - Test job search and filtering
   - Test job detail pages
   - Test admin login (if implemented)

### 2. Performance Optimization

1. **Enable Caching**

   - Configure CDN for static assets
   - Enable browser caching
   - Use Redis for session storage (optional)

2. **Database Optimization**

   - Monitor slow queries
   - Add indexes as needed
   - Regular database maintenance

3. **Image Optimization**
   - Use Cloudinary transformations
   - Implement lazy loading
   - Optimize image formats

### 3. Maintenance

1. **Regular Updates**

   - Keep dependencies updated
   - Monitor security advisories
   - Regular security audits

2. **Backup Verification**

   - Test backup restoration
   - Verify backup integrity
   - Monitor backup success

3. **Performance Monitoring**
   - Monitor response times
   - Track error rates
   - Monitor resource usage

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL matches exactly

2. **Database Connection Issues**

   - Verify MongoDB connection string
   - Check IP whitelist
   - Verify database credentials

3. **Image Upload Issues**

   - Check Cloudinary credentials
   - Verify file size limits
   - Check network connectivity

4. **Authentication Issues**
   - Verify JWT secret
   - Check admin credentials
   - Ensure proper token handling

### Support

For additional support:

1. Check application logs
2. Review Sentry error reports
3. Monitor UptimeRobot status
4. Check database connection status

## Cost Estimation

### Monthly Costs (Approximate)

- **MongoDB Atlas M0**: Free
- **Cloudinary**: Free tier available
- **Sentry**: Free tier available
- **UptimeRobot**: Free tier available
- **Vercel**: Free tier available
- **Render**: Free tier available
- **Domain**: $10-15/year
- **SSL**: Usually free with hosting

**Total**: ~$1-2/month for basic setup

### Scaling Costs

- **MongoDB Atlas M2+**: $9+/month
- **Render Pro**: $7+/month
- **Vercel Pro**: $20+/month
- **Cloudinary Pro**: $89+/month

## Conclusion

This deployment guide provides a comprehensive approach to deploying the Pakistan Job Portal. Choose the options that best fit your needs and budget. Start with the free tiers and scale up as your application grows.

Remember to:

- Test thoroughly before going live
- Monitor your application continuously
- Keep backups up to date
- Stay updated with security patches
- Monitor performance and costs
