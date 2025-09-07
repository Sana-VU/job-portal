#!/bin/bash

# Setup automated database backup cron job
# This script sets up a daily backup at 2 AM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-db.js"

echo "Setting up automated database backup..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check if mongodump is available
if ! command -v mongodump &> /dev/null; then
    echo "Error: mongodump is not installed or not in PATH"
    echo "Please install MongoDB Database Tools"
    exit 1
fi

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Create cron job entry
CRON_ENTRY="0 2 * * * cd $PROJECT_ROOT && node $BACKUP_SCRIPT >> /var/log/job-portal-backup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "backup-db.js"; then
    echo "Backup cron job already exists"
    echo "Current cron jobs:"
    crontab -l | grep "backup-db.js"
else
    # Add cron job
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "Backup cron job added successfully!"
    echo "Backup will run daily at 2:00 AM"
fi

# Create log directory if it doesn't exist
sudo mkdir -p /var/log
sudo touch /var/log/job-portal-backup.log
sudo chmod 644 /var/log/job-portal-backup.log

echo ""
echo "Setup complete!"
echo ""
echo "To view backup logs:"
echo "  tail -f /var/log/job-portal-backup.log"
echo ""
echo "To view current cron jobs:"
echo "  crontab -l"
echo ""
echo "To remove the backup cron job:"
echo "  crontab -e"
echo "  (then delete the line containing backup-db.js)"
echo ""
echo "Manual backup commands:"
echo "  cd $PROJECT_ROOT && node $BACKUP_SCRIPT"
echo ""
echo "Environment variables needed for S3 upload:"
echo "  AWS_ACCESS_KEY_ID"
echo "  AWS_SECRET_ACCESS_KEY"
echo "  AWS_BUCKET"
echo "  AWS_REGION (optional, defaults to us-east-1)"
