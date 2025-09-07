#!/usr/bin/env node

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const MONGO_DB = process.env.MONGO_DB || "job-portal";
const BACKUP_DIR = process.env.BACKUP_DIR || "./backups";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFilename = `job-portal-backup-${timestamp}`;
const backupPath = path.join(BACKUP_DIR, backupFilename);

console.log(`Starting database backup for ${MONGO_DB}...`);
console.log(`Backup will be saved to: ${backupPath}`);

// Create mongodump command
const mongodumpCmd = `mongodump --uri="${MONGO_URI}" --db="${MONGO_DB}" --out="${backupPath}"`;

// Execute mongodump
exec(mongodumpCmd, (error, stdout, stderr) => {
  if (error) {
    console.error("Error creating backup:", error);
    process.exit(1);
  }

  if (stderr) {
    console.warn("Mongodump warnings:", stderr);
  }

  console.log("Database backup completed successfully!");
  console.log(`Backup location: ${backupPath}`);

  // Compress the backup
  const tarCmd = `tar -czf "${backupPath}.tar.gz" -C "${BACKUP_DIR}" "${backupFilename}"`;

  exec(tarCmd, (tarError, tarStdout, tarStderr) => {
    if (tarError) {
      console.error("Error compressing backup:", tarError);
      return;
    }

    console.log("Backup compressed successfully!");

    // Remove uncompressed backup directory
    exec(`rm -rf "${backupPath}"`, (rmError) => {
      if (rmError) {
        console.warn("Warning: Could not remove uncompressed backup directory");
      }
    });

    // Upload to S3 if configured
    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_BUCKET) {
      uploadToS3(`${backupPath}.tar.gz`);
    } else {
      console.log("S3 upload skipped - credentials not configured");
    }
  });
});

function uploadToS3(filePath) {
  console.log("Uploading backup to S3...");

  const s3Key = `backups/${path.basename(filePath)}`;
  const awsCmd = `aws s3 cp "${filePath}" "s3://${AWS_BUCKET}/${s3Key}" --region "${AWS_REGION}"`;

  exec(awsCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Error uploading to S3:", error);
      return;
    }

    console.log("Backup uploaded to S3 successfully!");
    console.log(`S3 location: s3://${AWS_BUCKET}/${s3Key}`);

    // Clean up local backup file after successful upload
    fs.unlink(filePath, (unlinkError) => {
      if (unlinkError) {
        console.warn("Warning: Could not remove local backup file");
      } else {
        console.log("Local backup file cleaned up");
      }
    });
  });
}

// Clean up old backups (keep only last 7 days)
function cleanupOldBackups() {
  console.log("Cleaning up old backups...");

  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      console.warn("Warning: Could not read backup directory");
      return;
    }

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime.getTime() < sevenDaysAgo) {
        fs.unlink(filePath, (unlinkError) => {
          if (unlinkError) {
            console.warn(`Warning: Could not delete old backup ${file}`);
          } else {
            console.log(`Deleted old backup: ${file}`);
          }
        });
      }
    });
  });
}

// Run cleanup after backup
setTimeout(cleanupOldBackups, 5000);
