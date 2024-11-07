const { default: axios } = require("axios");
const bot = require("./bot");
const savedData = require("./btc_data.json");
const fs = require("fs");

const _saveToFile = (data) => {
  const dataToSave = JSON.stringify(data, null, 2);

  fs.writeFile("btc_data.json", dataToSave, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("BTC data saved to btc_data.json");
    }
  });
};
async function _getLatestPrices() {
  const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

  const params = {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKET_API_KEY,
    },
  };
  try {
    const response = await axios.get(`${apiUrl}?symbol=BTC`, params);

    const payload = {
      currentPrice: +response.data.data.BTC.quote.USD.price.toFixed(2),
      usdQuote: response.data.data.BTC.quote.USD,
    };
    return payload;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  async monitorPrice(click, chatId) {
    try {
      const response = await _getLatestPrices();

      if (click) {
        const { currentPrice, usdQuote } = response;
        let difference = savedData.currentPrice - currentPrice;

        await bot.sendPhoto(chatId, difference > 0 ? "./assets/btc_down.webp" : "./assets/btc_up.jpg", {
          caption: `${difference > 0 ? "🔻" : "🔥"}Внимание!${
            difference > 0 ? "🔻" : "🔥"
          }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${
            usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
          }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}\n${
            usdQuote.percent_change_1h < 0
              ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
              : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
          }`,
        });

        _saveToFile(response);
      } else {
        const { currentPrice, usdQuote } = response;

        const isThousandChanged = Math.floor(currentPrice / 1000) !== Math.floor(savedData.currentPrice / 1000);

        const difference = Math.abs(currentPrice - savedData.currentPrice);

        if (isThousandChanged && difference >= 200) {
          bot.sendPhoto(el.user_chat_id, difference > 0 ? "./assets/btc_down.webp" : "./assets/btc_up.jpg", {
            caption: `${difference > 0 ? "🔻" : "🔥"}Внимание!${
              difference > 0 ? "🔻" : "🔥"
            }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${
              usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
            }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}\n${
              usdQuote.percent_change_1h < 0
                ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
            }`,
          });
          _saveToFile(response);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
