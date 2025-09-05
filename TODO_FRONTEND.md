# Frontend TODOs (Next.js + Tailwind)

## pages/\_app.js

// TODO: Global App wrapper
// - Import Tailwind CSS
// - Add Navbar (title: Pakistan Jobs Portal) + Footer

## components/JobCard.js

// TODO: JobCard component
// - Props: job object
// - Show title, org, location, publishDate
// - Thumbnail of adImage
// - Link to /jobs/[id]

## components/SearchBar.js

// TODO: SearchBar component
// - Input keyword
// - Dropdown category
// - Input location
// - On submit → call backend API with filters

## pages/index.js

// TODO: Homepage
// - Fetch jobs from /api/jobs
// - Show SearchBar on top
// - Show JobCards in grid

## pages/jobs/[id].js

// TODO: Job details page
// - Fetch single job by ID
// - Show all fields + adImage
// - Display "Apply Before lastDate"
