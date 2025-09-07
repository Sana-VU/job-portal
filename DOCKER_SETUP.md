# Docker Setup for Pakistan Job Portal

This project uses Docker and Docker Compose to create a consistent development environment.

## Prerequisites

- Docker
- Docker Compose

## Services

1. **MongoDB**: Database service running on port 27017
2. **Backend**: Express API service running on port 5000

## Getting Started

### Start all services

```bash
docker-compose up
```

To run in detached mode:

```bash
docker-compose up -d
```

### Stop all services

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs mongo
```

### Accessing services

- MongoDB: mongodb://localhost:27017
- Backend API: http://localhost:5000/api

## Seeding Data

To seed the database with sample data, execute:

```bash
docker-compose exec backend node scripts/seed-data.js
```

## Development Workflow

When developing, the backend code is mounted as a volume, so changes to the code will be reflected without rebuilding the container. However, if you modify package.json to add new dependencies, you'll need to rebuild:

```bash
docker-compose build backend
```

## Troubleshooting

### MongoDB Connection Issues

If the backend can't connect to MongoDB, ensure the MongoDB service is healthy:

```bash
docker-compose ps mongo
```

You might need to wait a bit longer for MongoDB to initialize properly.

### Port Conflicts

If you see errors about ports being in use, ensure nothing else is using ports 27017 or 5000 on your host machine, or modify the port mapping in the docker-compose.yml file.
