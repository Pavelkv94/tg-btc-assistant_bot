import { cryptoService } from "./crypto.service.js";
import { bot } from "../../config/bot.js";

export const cryptoController = {
  /**
   * Handle crypto price request from user
   * @param {number} chatId - Telegram chat ID
   * @param {string} symbol - Crypto symbol (BTC or SOL)
   */
  async handlePriceRequest(chatId, symbol) {
    try {
      const priceInfo = await cryptoService.getPriceInfo(symbol);
      const message = cryptoService.formatPriceMessage(priceInfo);
      const imagePath = cryptoService.getImagePath(symbol, priceInfo.isDifference);

      await bot.sendPhoto(chatId, imagePath, { caption: message });
      
      // Save updated price after user request
      const response = await import("../../utils/priceMonitor.js").then(m => m.getLatestPrices());
      cryptoService.savePriceData(symbol, response);
    } catch (error) {
      console.error(`❌ Error handling price request for ${symbol}:`, error);
      await bot.sendMessage(chatId, "Ой! Произошла ошибка при получении цены.");
    }
  },
};

