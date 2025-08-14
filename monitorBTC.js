const { default: axios } = require("axios");
const bot = require("./bot");
const { loadUserIds } = require("./utils/usersProcess");
const { saveBTC, loadBTC } = require("./utils/saveBtc");

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
  async monitorPriceBTC(click, chatId) {
    console.log("Check price");

    try {
      const response = await _getLatestPrices();
      const savedPrice = loadBTC().currentPrice;

      if (click) {
        const { currentPrice, usdQuote } = response;
        let difference = savedPrice - currentPrice;

        await bot.sendPhoto(chatId, difference <= -200 ? "./assets/btc_down.webp" : "./assets/btc_up.jpg", {
          caption: `${difference <= -200 ? "🔻" : "🔥"}Внимание!${
            difference <= -200 ? "🔻" : "🔥"
          }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${
            usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
          }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}\n${
            usdQuote.percent_change_1h < 0
              ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
              : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
          }`,
        });

        saveBTC(response);
      } else {
        const { currentPrice, usdQuote } = response;

        const isThousandChanged = Math.floor(currentPrice / 1000) !== Math.floor(savedPrice / 1000);

        const difference = currentPrice - savedPrice;

        if (isThousandChanged && (difference >= 200 || difference <= -200)) {
          const now = new Date();
          const hours = now.getHours();

          if (hours >= 6 && hours < 21) { //+3 UTC
            
            let chats = loadUserIds();
            chats.map((chatId) => {
              bot.sendPhoto(chatId, difference <= -200 ? "./assets/btc_down.webp" : "./assets/btc_up.jpg", {
                caption: `${difference <= -200 ? "🔻" : "🔥"}Внимание!${
                  difference <= -200 ? "🔻" : "🔥"
                }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(
                  2
                )}%) ${usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"}\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${
                  usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"
                }\n${
                  usdQuote.percent_change_1h < 0
                    ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                    : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                }`,
              });
            });

            saveBTC(response);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
