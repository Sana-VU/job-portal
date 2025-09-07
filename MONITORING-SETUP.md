# Monitoring Setup Guide

This guide explains how to set up comprehensive monitoring for the Pakistan Job Portal application.

## Overview

The application includes several monitoring components:

1. **Sentry Integration** - Error tracking and performance monitoring
2. **Health Check Endpoints** - System health monitoring
3. **UptimeRobot Integration** - External uptime monitoring
4. **Admin Monitoring Dashboard** - Internal monitoring interface

## 1. Sentry Setup

### Backend Sentry Configuration

Sentry is already integrated in the backend. To enable it:

1. Create a Sentry project at [sentry.io](https://sentry.io)
2. Get your DSN from the project settings
3. Add the DSN to your environment variables:

```bash
# In backend/.env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Frontend Sentry Configuration

Sentry is also integrated in the frontend. To enable it:

1. Use the same Sentry project or create a separate one
2. Add the DSN to your frontend environment variables:

```bash
# In frontend/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Features Included

- **Error Tracking**: Automatic capture of unhandled errors
- **Performance Monitoring**: Request timing and database query performance
- **Release Tracking**: Version and commit tracking
- **User Context**: User information in error reports

## 2. Health Check Endpoints

### Available Endpoints

- `GET /api/health` - Comprehensive health check
- `GET /api/version` - Application version information
- `GET /api/health-legacy` - Legacy health check (for backward compatibility)

### Health Check Response

```json
{
  "status": "healthy",
  "services": {
    "mongodb": {
      "status": "connected",
      "connected": true,
      "latency": 5
    },
    "cloudinary": {
      "configured": true,
      "status": "connected",
      "latency": 120
    }
  },
  "system": {
    "uptime": 3600,
    "memory": {
      "rss": 45678912,
      "heapTotal": 20971520,
      "heapUsed": 15728640,
      "external": 1234567
    },
    "timestamp": "2024-01-01T12:00:00.000Z",
    "pid": 12345,
    "node_version": "v22.14.0",
    "env": "production"
  }
}
```

## 3. UptimeRobot Setup

### Prerequisites

1. Create an account at [UptimeRobot](https://uptimerobot.com)
2. Get your API key from the account settings
3. Set up alert contacts (email, SMS, etc.)

### Automated Setup

Use the provided script to set up monitors automatically:

```bash
# Set your UptimeRobot API key
export UPTIMEROBOT_API_KEY=your_api_key_here

# Set your application URLs
export BASE_URL=https://your-api-domain.com
export FRONTEND_URL=https://your-frontend-domain.com

# Run the setup script
node scripts/setup-uptime-robot.js
```

### Manual Setup

If you prefer to set up monitors manually, create monitors for:

1. **Backend API Health** - `https://your-api-domain.com/api/health`
2. **Frontend Website** - `https://your-frontend-domain.com`
3. **Jobs API** - `https://your-api-domain.com/api/jobs`
4. **Database Monitor** - `https://your-api-domain.com/api/health/db`

### Recommended Settings

- **Check Interval**: 5 minutes for critical endpoints, 10 minutes for others
- **Timeout**: 30 seconds
- **Alert Contacts**: Set up multiple contacts for redundancy
- **Alert Threshold**: 2 consecutive failures

## 4. Admin Monitoring Dashboard

### Access

The monitoring dashboard is available at `/admin/monitoring` (requires admin authentication).

### Features

- **Real-time System Metrics**: Memory usage, uptime, database status
- **Service Health**: MongoDB and Cloudinary connection status
- **Performance Charts**: Memory usage over time
- **Alert Configuration**: Set up email alerts for system issues

### Authentication

Access to the monitoring dashboard requires admin authentication. Use the admin login credentials configured in your environment variables.

## 5. Alert Configuration

### Email Alerts

Configure email alerts for system issues:

```bash
# In backend/.env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@jobportal.com
ALERT_EMAILS=admin@jobportal.com,alerts@jobportal.com
```

### Alert Thresholds

Configure alert thresholds:

```bash
# In backend/.env
MEMORY_THRESHOLD=85  # Alert when memory usage exceeds 85%
CPU_THRESHOLD=90     # Alert when CPU usage exceeds 90%
RESPONSE_TIME_THRESHOLD=1000  # Alert when response time exceeds 1000ms
```

### Test Alerts

Test your alert configuration:

```bash
# Send a test alert
curl -X POST http://localhost:5000/api/monitoring/alerts/test \
  -H "Authorization: Bearer your_admin_token"
```

## 6. Production Monitoring Checklist

### Before Deployment

- [ ] Sentry DSN configured for both frontend and backend
- [ ] UptimeRobot monitors set up
- [ ] Email alert configuration tested
- [ ] Health check endpoints responding correctly
- [ ] Monitoring dashboard accessible

### After Deployment

- [ ] Verify all monitors are showing "up" status
- [ ] Test error reporting by triggering a test error
- [ ] Confirm alert emails are being sent
- [ ] Check Sentry dashboard for incoming data
- [ ] Monitor system performance for the first 24 hours

## 7. Troubleshooting

### Common Issues

1. **Sentry not capturing errors**

   - Check DSN configuration
   - Verify environment variables are set
   - Check network connectivity to Sentry

2. **Health checks failing**

   - Verify database connection
   - Check Cloudinary configuration
   - Review application logs

3. **UptimeRobot monitors down**

   - Check URL accessibility
   - Verify SSL certificates
   - Review firewall settings

4. **Email alerts not working**
   - Test SMTP configuration
   - Check email credentials
   - Verify alert email addresses

### Logs

Monitor application logs for issues:

```bash
# Backend logs
tail -f backend/logs/app.log

# System logs
journalctl -u your-app-service -f
```

## 8. Best Practices

1. **Set up multiple alert contacts** for redundancy
2. **Use different check intervals** for different criticality levels
3. **Monitor both technical and business metrics**
4. **Set up escalation procedures** for critical alerts
5. **Regular review** of monitoring data and alert thresholds
6. **Test monitoring systems** regularly
7. **Document incident response procedures**

## 9. Cost Considerations

- **Sentry**: Free tier available, paid plans for higher volume
- **UptimeRobot**: Free tier includes 50 monitors, paid plans for more
- **Email**: Minimal cost for SMTP services
- **Infrastructure**: Monitoring adds minimal overhead

## 10. Security Considerations

- **Protect API keys** and credentials
- **Use HTTPS** for all monitoring endpoints
- **Limit access** to monitoring dashboards
- **Regular rotation** of API keys and passwords
- **Audit monitoring access** regularly
