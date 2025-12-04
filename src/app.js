import express from "express";
import dotenv from "dotenv";
import applicationConfig from "./config/config.js";

// Load environment variables from .env file
dotenv.config({ quiet: true });

// Create an Express application
const app = express();

// Setup application middleware and routes here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const response = {
    message: "Welcome to the Express server!",
    environment: applicationConfig.env,
    version: applicationConfig.version,
  };
  res.json(response);
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
