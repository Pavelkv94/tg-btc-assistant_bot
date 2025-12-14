import { getLatestPrices } from "../../utils/priceMonitor.js";
import { cryptoRepository } from "./crypto.repository.js";
import { currencySymbols } from "../../constants/currency.js";
import { bot } from "../../config/bot.js";

export const cryptoService = {
  /**
   * Get price information for a specific cryptocurrency
   * @param {string} symbol - Crypto symbol (BTC or SOL)
   * @returns {Promise<object>} Price information
   */
  async getPriceInfo(symbol) {
    const response = await getLatestPrices();
    const savedPrice = cryptoRepository.getSavedPrice(symbol).currentPrice;
    const { [symbol]: { currentPrice, usdQuote } } = response;
    
    const difference = currentPrice - savedPrice;
    const isDifference = symbol === currencySymbols.SOL ? difference < 0 : difference <= -500;

    return {
      currentPrice,
      usdQuote,
      difference,
      isDifference,
      symbol,
    };
  },

  /**
   * Format price message for display
   * @param {object} priceInfo - Price information
   * @returns {string} Formatted message
   */
  formatPriceMessage(priceInfo) {
    const { currentPrice, usdQuote, isDifference, symbol } = priceInfo;
    
    return `${isDifference ? "🔻" : "🔥"}Внимание!${isDifference ? "🔻" : "🔥"}
Цена ${symbol} сейчас составляет: ${currentPrice}$
24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${
      usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
    }
7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}
${
      usdQuote.percent_change_1h < 0
        ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
        : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
    }`;
  },

  /**
   * Get image path for crypto based on trend
   * @param {string} symbol - Crypto symbol
   * @param {boolean} isDifference - Is price going down
   * @returns {string} Image path
   */
  getImagePath(symbol, isDifference) {
    return isDifference ? `./assets/${symbol}_down.webp` : `./assets/${symbol}_up.webp`;
  },

  /**
   * Save updated price data
   * @param {string} symbol - Crypto symbol
   * @param {object} data - Price data
   */
  savePriceData(symbol, data) {
    cryptoRepository.savePriceData(symbol, data);
  },

  /**
   * Monitor prices for all cryptocurrencies and send alerts
   * @param {string[]} userChatIds - Array of user chat IDs
   */
  async monitorAllPrices(userChatIds) {
    try {
      const response = await getLatestPrices();
      const symbols = Object.values(currencySymbols);
      const now = new Date();
      const hours = now.getHours();

      // Only send notifications between 6 AM and 11 PM
      if (hours < 6 || hours >= 23) {
        console.log("⏰ Outside notification hours (6 AM - 11 PM), skipping alerts");
        return;
      }

      for (const symbol of symbols) {
        const savedPrice = cryptoRepository.getSavedPrice(symbol).currentPrice;
        const { [symbol]: { currentPrice, usdQuote } } = response;
        
        // Check for significant price changes
        const isDecadeChangedSol = 
          symbol === currencySymbols.SOL && 
          Math.floor(currentPrice / 10) !== Math.floor(savedPrice / 10);

        const isFiveThousandChangedBtc = 
          symbol === currencySymbols.BTC && 
          Math.floor(currentPrice / 5000) !== Math.floor(savedPrice / 5000);

        const difference = currentPrice - savedPrice;
        const isDifferenceSol = 
          symbol === currencySymbols.SOL && 
          (difference >= 5 || difference <= -5);
        
        const isDifferenceBtc = 
          symbol === currencySymbols.BTC && 
          isFiveThousandChangedBtc && 
          (difference >= 500 || difference <= -500);

        if (isDifferenceSol || isDifferenceBtc) {
          const isDifferencePrice = 
            symbol === currencySymbols.SOL ? difference < 0 : difference <= -500;

          const message = this.formatPriceMessage({
            currentPrice,
            usdQuote,
            isDifference: isDifferencePrice,
            symbol,
          });

          const imagePath = this.getImagePath(symbol, isDifferencePrice);

          // Send alerts to all users
          for (const chatId of userChatIds) {
            try {
              await bot.sendPhoto(chatId, imagePath, { caption: message });
            } catch (error) {
              console.error(`❌ Error sending alert to user ${chatId}:`, error.message);
            }
          }

          // Save updated price
          this.savePriceData(symbol, response);
          console.log(`📊 Price alert sent for ${symbol}: ${currentPrice}$`);
        }
      }
    } catch (error) {
      console.error("❌ Error monitoring prices:", error);
    }
  },
};

