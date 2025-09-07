#!/usr/bin/env node
const axios = require("axios");
const dotenv = require("dotenv");
const chalk = require("chalk");

// Load environment variables
dotenv.config();

// Check if API key is provided
const API_KEY = process.env.UPTIMEROBOT_API_KEY;
if (!API_KEY) {
  console.error(
    chalk.red("Error: UPTIMEROBOT_API_KEY environment variable is required.")
  );
  process.exit(1);
}

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const MONITORS = [
  {
    name: "Backend API Health",
    url: `${BASE_URL}/api/health`,
    type: 1, // HTTP
    interval: 300, // 5 minutes
    alert_contacts: "0_0_0", // Default alert contact
  },
  {
    name: "Frontend Website",
    url: FRONTEND_URL,
    type: 1, // HTTP
    interval: 300, // 5 minutes
    alert_contacts: "0_0_0", // Default alert contact
  },
  {
    name: "Jobs API",
    url: `${BASE_URL}/api/jobs`,
    type: 1, // HTTP
    interval: 600, // 10 minutes
    alert_contacts: "0_0_0", // Default alert contact
  },
  {
    name: "Database Monitor",
    url: `${BASE_URL}/api/health/db`,
    type: 1, // HTTP
    interval: 600, // 10 minutes
    alert_contacts: "0_0_0", // Default alert contact
    expected_status: "200", // Expected HTTP status code
  },
];

async function createMonitor(monitor) {
  try {
    console.log(chalk.blue(`Creating monitor for ${monitor.name}...`));

    const params = new URLSearchParams();
    params.append("api_key", API_KEY);
    params.append("format", "json");
    params.append("type", monitor.type);
    params.append("url", monitor.url);
    params.append("friendly_name", monitor.name);
    params.append("interval", monitor.interval);

    if (monitor.alert_contacts) {
      params.append("alert_contacts", monitor.alert_contacts);
    }

    const response = await axios.post(
      "https://api.uptimerobot.com/v2/newMonitor",
      params
    );

    if (response.data.stat === "ok") {
      console.log(
        chalk.green(`✅ Monitor created successfully for ${monitor.name}`)
      );
    } else {
      console.log(
        chalk.yellow(
          `⚠️ Could not create monitor for ${monitor.name}: ${response.data.message}`
        )
      );
    }
  } catch (error) {
    console.error(
      chalk.red(`❌ Error creating monitor for ${monitor.name}:`),
      error.message
    );
  }
}

async function setupMonitors() {
  console.log(chalk.green("Setting up UptimeRobot monitors..."));

  for (const monitor of MONITORS) {
    await createMonitor(monitor);
  }

  console.log(
    chalk.green(
      "\nSetup complete! Visit https://uptimerobot.com/dashboard to view your monitors."
    )
  );
}

// Execute the setup
setupMonitors().catch((error) => {
  console.error(chalk.red("Setup failed:"), error);
  process.exit(1);
});
