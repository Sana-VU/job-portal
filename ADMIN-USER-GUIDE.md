# Admin User Guide

This guide explains how a non-technical admin can log in and manage job posts.

## Login

- Open the site and go to `/admin/login`.
- Enter the admin email and password.
- Default credentials are configured in the backend via environment variables:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## Create a Job

1. After login, you land on `/admin/jobs`.
2. Fill in required fields: Title, Organization, Category, Location, Publish Date, Last Date.
3. Optional: Source, Description, Image.
4. To upload an image, click “Choose File” and select an image; the image will upload to Cloudinary automatically.
5. Click “Create Job”. The new job appears in the table below.

## Delete a Job

1. Find the job in the table.
2. Click “Delete”. Confirm when prompted.

## Logout

- Click the “Logout” button in the header of the admin pages.

## Troubleshooting

- If login fails, ask the developer to verify backend `.env` values and JWT secret.
- If image upload fails, ensure `CLOUDINARY_*` variables are set in backend `.env`.

