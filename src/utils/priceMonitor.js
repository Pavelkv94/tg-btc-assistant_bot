import axios from "axios";
import { currencySymbols } from "../constants/currency.js";

/**
 * Fetch latest cryptocurrency prices from CoinMarketCap API
 * @returns {Promise<object>} Price data for BTC and SOL
 */
export async function getLatestPrices() {
  const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

  const params = {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKET_API_KEY,
    },
  };

  try {
    const symbols = Object.values(currencySymbols).join(",");
    const response = await axios.get(`${apiUrl}?symbol=${symbols}`, params);
    
    const payload = {
      SOL: {
        currentPrice: +response.data.data.SOL.quote.USD.price.toFixed(2),
        usdQuote: response.data.data.SOL.quote.USD,
      },
      BTC: {
        currentPrice: +response.data.data.BTC.quote.USD.price.toFixed(2),
        usdQuote: response.data.data.BTC.quote.USD,
      },
    };
    
    return payload;
  } catch (error) {
    console.error("❌ Error fetching prices from CoinMarketCap:", error.message);
    throw error;
  }
}

