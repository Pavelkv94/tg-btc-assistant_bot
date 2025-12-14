import { loadInfo, saveInfo } from "../../utils/fileStorage.js";

export const cryptoRepository = {
  /**
   * Get saved cryptocurrency price data
   * @param {string} symbol - Crypto symbol (BTC or SOL)
   * @returns {object} Price data
   */
  getSavedPrice(symbol) {
    return loadInfo(symbol);
  },

  /**
   * Save cryptocurrency price data
   * @param {string} symbol - Crypto symbol (BTC or SOL)
   * @param {object} data - Price data
   */
  savePriceData(symbol, data) {
    saveInfo(symbol, data);
  },
};

