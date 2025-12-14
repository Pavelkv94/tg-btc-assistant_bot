import express from "express";
import cors from "cors";
import { stationsRouter } from "../features/radio/stations/stations.router.js";
import { radioUsersRouter } from "../features/radio/radioUsers/radioUsers.router.js";

/**
 * Initialize and configure Express application
 * @returns {object} Express app instance
 */
export function initApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Health check endpoint
  app.get("/", (req, res) => {
    res.status(200).json({ 
      status: "ok",
      version: "2.0.0",
      services: {
        crypto: "Bitcoin and Solana price monitoring",
        radio: "Radio stations streaming"
      }
    });
  });

  // Radio API routes
  app.use("/stations", stationsRouter);
  app.use("/users", radioUsersRouter);

  return app;
}

