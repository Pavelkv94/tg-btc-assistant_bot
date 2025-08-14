const { default: axios } = require("axios");
const bot = require("./bot");
const { loadUserIds } = require("./utils/usersProcess");
const { saveSOL, loadSOL } = require("./utils/saveSol");

async function _getLatestPrices() {
  const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

  const params = {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKET_API_KEY,
    },
  };
  try {
    const response = await axios.get(`${apiUrl}?symbol=SOL`, params);

    const payload = {
      currentPrice: +response.data.data.SOL.quote.USD.price.toFixed(2),
      usdQuote: response.data.data.SOL.quote.USD,
    };
    return payload;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  async monitorPriceSOL(click, chatId) {
    console.log("Check price");

    try {
      const response = await _getLatestPrices();
      const savedPrice = loadSOL().currentPrice;

      if (click) {
        const { currentPrice, usdQuote } = response;
        let difference = currentPrice - savedPrice;

        await bot.sendPhoto(chatId, difference < 0 ? "./assets/sol_down.webp" : "./assets/sol_up.webp", {
          caption: `${difference < 0 ? "🔻" : "🔥"}Внимание!${difference < 0 ? "🔻" : "🔥"
            }\nЦена SOL сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
            }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}\n${usdQuote.percent_change_1h < 0
              ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
              : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
            }`,
        });

        saveSOL(response);
      } else {
        const { currentPrice, usdQuote } = response;

        const isDecadeChanged = Math.floor(currentPrice / 100) !== Math.floor(savedPrice / 100);

        const difference = currentPrice - savedPrice;

        if (isDecadeChanged && (difference >= 5 || difference <= -5)) {
          const now = new Date();
          const hours = now.getHours();

          if (hours >= 6 && hours < 23) { //+3 UTC

            let chats = loadUserIds();
            chats.map((chatId) => {
              bot.sendPhoto(chatId, difference < 0 ? "./assets/sol_down.webp" : "./assets/sol_up.webp", {
                caption: `${difference < 0 ? "🔻" : "🔥"}Внимание!${difference < 0 ? "🔻" : "🔥"
                  }\nЦена SOL сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(
                    2
                  )}%) ${usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"}\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"
                  }\n${usdQuote.percent_change_1h < 0
                    ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                    : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                  }`,
              });
            });

            saveSOL(response);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
