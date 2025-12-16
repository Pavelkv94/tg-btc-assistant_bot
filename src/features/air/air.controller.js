import { bot } from "../../config/bot.js";
import { scrapeAirQuality } from "./scrapeAirQuality.js";

export const airController = {
  /**
   * Handle immediate AQI check request from user
   * @param {number} chatId - Telegram chat ID
   */
  async handleAQIRequest(chatId) {
    try {
      // Send "checking..." message
      await bot.sendMessage(chatId, "🔍 Проверяю качество воздуха в Кракове...");

      // Scrape and get the current AQI
      await scrapeAirQuality([chatId], "manual");

    } catch (error) {
      console.error("❌ Error handling AQI request:", error);
      await bot.sendMessage(
        chatId,
        "❌ Извините, не удалось получить данные о качестве воздуха. Попробуйте позже."
      );
    }
  },
};

