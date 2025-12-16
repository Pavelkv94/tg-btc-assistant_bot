import { config } from "dotenv";
import { db } from "./config/database.js";
import { seedStations } from "./config/dbSeed.js";
import { initApp } from "./server/app.js";
import { runBot, getAllUserChatIds } from "./adapters/telegram.js";
import { cryptoService } from "./features/crypto/crypto.service.js";
import { scrapeAirQuality } from "./features/air/scrapeAirQuality.js";

// Load environment variables
config();

/**
 * Main application initialization
 */
async function main() {
  try {
    console.log("🚀 Starting Telegram Bot Application...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // 1. Connect to MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
    await db.run(mongoUrl);

    // 2. Seed radio stations if needed
    await seedStations();

    // 3. Initialize Express server
    const app = initApp();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌐 Express server running on port ${PORT}`);
    });

    // 4. Start Telegram bot
    runBot();

    // 5. Start price monitoring (every 20 minutes)
    const MONITORING_INTERVAL = 1200 * 1000; // 20 minutes in milliseconds

    console.log(`⏰ Price monitoring interval: ${MONITORING_INTERVAL / 1000 / 60} minutes`);

    setInterval(async () => {
      console.log("🔄 Running scheduled check...");
      try {
        const userChatIds = await getAllUserChatIds();
        await cryptoService.monitorAllPrices(userChatIds);
        await scrapeAirQuality(userChatIds, "scheduled");
      } catch (error) {
        console.error("❌ Error in monitoring:", error);
      }
    }, MONITORING_INTERVAL);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Application started successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📱 Features available:");
    console.log("   • Cryptocurrency monitoring (BTC, SOL)");
    console.log("   • Air quality monitoring (AQI)");
    console.log("   • Radio stations streaming");
    console.log("   • Telegram miniapp integration");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Fatal error during startup:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await db.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await db.stop();
  process.exit(0);
});

// Start the application
main();

