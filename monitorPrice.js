const { default: axios } = require("axios");
const bot = require("./bot");
const { loadUserIds } = require("./utils/usersProcess");
const { saveInfo, loadInfo } = require("./utils/saveInfo");
const { currencySymbols } = require("./constants/currency");

async function _getLatestPrices() {
  const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

  const params = {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKET_API_KEY,
    },
  };
  try {
    const response = await axios.get(`${apiUrl}?symbol=${Object.values(currencySymbols).join(",")}`, params);
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
    console.error(error);
  }
}

module.exports = {
  async monitorPrice(chatId, symbol) {
    try {
      const response = await _getLatestPrices();

      // if was clicked on the button
      if (symbol) {
        const savedPrice = loadInfo(symbol).currentPrice;

        const { [symbol]: { currentPrice, usdQuote } } = response;
        let difference = currentPrice - savedPrice;

        const isDifference = symbol === currencySymbols.SOL ? difference < 0 : difference <= -200;

        await bot.sendPhoto(chatId, isDifference ? `./assets/${symbol}_down.webp` : `./assets/${symbol}_up.webp`, {
          caption: `${isDifference ? "🔻" : "🔥"}Внимание!${isDifference ? "🔻" : "🔥"
            }\nЦена ${symbol} сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"
            }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"}\n${usdQuote.percent_change_1h < 0
              ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
              : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
            }`,
        });

        saveInfo(symbol, response);
      } else {
        const symbols = Object.values(currencySymbols);
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 6 && hours < 23) {

          for (const symbol of symbols) {
            const savedPrice = loadInfo(symbol).currentPrice;
            const { [symbol]: { currentPrice, usdQuote } } = response;
            const isDecadeChangedSol = symbol === currencySymbols.SOL && Math.floor(currentPrice / 10) !== Math.floor(savedPrice / 10);

            const isThousandChangedBtc = symbol === currencySymbols.BTC && Math.floor(currentPrice / 1000) !== Math.floor(savedPrice / 1000);

            let difference = currentPrice - savedPrice;

            const isDifferenceSol = symbol === currencySymbols.SOL && (difference >= 5 || difference <= -5);
            const isDifferenceBtc = symbol === currencySymbols.BTC && isThousandChangedBtc && (difference >= 200 || difference <= -200);

            if (isDifferenceSol || isDifferenceBtc) {
              const isDifferencePrice = symbol === currencySymbols.SOL ? difference < 0 : difference <= -200;

              let chats = loadUserIds();
              chats.map((chatId) => {
                bot.sendPhoto(chatId, isDifferencePrice ? `./assets/${symbol}_down.webp` : `./assets/${symbol}_up.webp`, {
                  caption: `${isDifferencePrice ? "🔻" : "🔥"}Внимание!${isDifferencePrice ? "🔻" : "🔥"
                    }\nЦена ${symbol} сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(
                      2
                    )}%) ${usdQuote.percent_change_24h > 0 ? "🚀" : "🔻"}\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? "🚀" : "🔻"
                    }\n${usdQuote.percent_change_1h < 0
                      ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                      : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                    }`,
                });
              });
              saveInfo(symbol, response);

            }

          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};


