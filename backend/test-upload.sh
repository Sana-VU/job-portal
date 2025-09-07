#!/bin/bash

# Script to test the image upload functionality of the job portal API

# Configuration - MODIFY THESE VALUES
API_URL="http://localhost:5000"
EMAIL="admin@jobportal.com"
PASSWORD="admin123"
IMAGE_PATH="/path/to/your/test-image.jpg" # Replace with actual image path
JOB_ID="" # Optional: Add a job ID to associate the image with a job

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======= Image Upload Test Script =======${NC}"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed. Please install curl to use this script.${NC}"
    exit 1
fi

# Check if jq is installed (for better JSON parsing)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. Output will not be formatted.${NC}"
    JQ_INSTALLED=false
else
    JQ_INSTALLED=true
fi

# Check if image file exists
if [ ! -f "$IMAGE_PATH" ]; then
    echo -e "${RED}Error: Image file not found at $IMAGE_PATH${NC}"
    echo "Please update the IMAGE_PATH variable in this script."
    exit 1
fi

echo "1. Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Extract token from response
if [ "$JQ_INSTALLED" = true ]; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
else
    # Fallback if jq is not available
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | awk -F':' '{print $2}' | tr -d '\"')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${RED}Error: Failed to obtain JWT token. Check your credentials or server status.${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}Login successful. Token obtained.${NC}"

# Prepare upload command
UPLOAD_CMD="curl -s -X POST \"$API_URL/api/upload\" -H \"Authorization: Bearer $TOKEN\""
UPLOAD_CMD="$UPLOAD_CMD -F \"image=@$IMAGE_PATH\""

# Add job ID if provided
if [ ! -z "$JOB_ID" ]; then
    UPLOAD_CMD="$UPLOAD_CMD -F \"jobId=$JOB_ID\""
    echo "2. Uploading image with job ID: $JOB_ID..."
else
    echo "2. Uploading image without job ID..."
fi

# Execute the upload
UPLOAD_RESPONSE=$(eval $UPLOAD_CMD)

echo "3. Processing response..."

# Display response
if [ "$JQ_INSTALLED" = true ]; then
    SUCCESS=$(echo $UPLOAD_RESPONSE | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}Upload successful!${NC}"
        echo "Response:"
        echo $UPLOAD_RESPONSE | jq
    else
        echo -e "${RED}Upload failed.${NC}"
        echo "Response:"
        echo $UPLOAD_RESPONSE | jq
    fi
else
    echo "Response: $UPLOAD_RESPONSE"
    if [[ $UPLOAD_RESPONSE == *"success\":true"* ]]; then
        echo -e "${GREEN}Upload appears to be successful.${NC}"
    else
        echo -e "${RED}Upload appears to have failed.${NC}"
    fi
fi

echo -e "${YELLOW}======= Test Complete =======${NC}"
