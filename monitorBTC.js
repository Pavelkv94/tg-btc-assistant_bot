const bot = require('./bot');
const { getLatestPrices } = require('./buttonsActions');
const BTC = require('./models/BTC');
const User = require('./models/User');

module.exports = {
  async monitorPrice(click, chatId) {
    try {
      BTC.findOne({ currency: 'BTC' }, (err, btc) => {
        if (err) {
          console.error(err);
        } else {
          getLatestPrices('BTC')
            .then(async (res) => {
              let currentPrice = res.data.BTC.quote.USD.price.toFixed(2);
              let difference = +btc.price.toString().slice(0, 2) - +currentPrice.toString().slice(0, 2);
              let usdQuote = res.data.BTC.quote.USD;

              if (click) {
                bot.sendPhoto(chatId, './assets/Bitcoin.png', {
                  caption: `${difference > 0 ? '🔻' : '🔥'}Внимание!${
                    difference > 0 ? '🔻' : '🔥'
                  }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(
                    2
                  )}%) ${usdQuote.percent_change_24h > 0 ? '🚀' : '🔻'}\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${
                    usdQuote.percent_change_7d > 0 ? '🚀' : '🔻'
                  }\n${
                    usdQuote.percent_change_1h < 0
                      ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                      : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                  }`,
                });
              } else {
                User.find({}, (err, users) => {
                  users.map((el) => {
                    if (Math.abs(difference) > 0) {
                      bot.sendPhoto(el.user_chat_id, './assets/Bitcoin.png', {
                        caption: `${difference > 0 ? '🔻' : '🔥'}Внимание!${
                          difference > 0 ? '🔻' : '🔥'
                        }\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${usdQuote.volume_change_24h.toFixed(
                          2
                        )}$(${usdQuote.percent_change_24h.toFixed(2)}%) ${
                          usdQuote.percent_change_24h > 0 ? '🚀' : '🔻'
                        }\n7d --->${usdQuote.percent_change_7d.toFixed(2)}%${usdQuote.percent_change_7d > 0 ? '🚀' : '🔻'}\n${
                          usdQuote.percent_change_1h < 0
                            ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                            : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час`
                        }`,
                      });
                    }
                  });
                });
              }

              btc.price = +currentPrice;
              btc.save();
            })
            .catch((e) => console.log(e));
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
};
