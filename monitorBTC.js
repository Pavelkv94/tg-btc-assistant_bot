const bot = require('./bot');
const { getLatestPrices } = require('./buttonsActions');
const BTC = require('./models/BTC');

module.exports = {
  async monitorPrice() {
    try {
      BTC.findOne({ currency: 'BTC' }, (err, btc) => {
        if (err) {
          console.error(err);
        } else {
          getLatestPrices('BTC')
            .then(async (res) => {
              let currentPrice = res.data.BTC.quote.USD.price.toFixed(2);
              let difference = +btc.price.toString().slice(0, 2) - +currentPrice.toString().slice(0, 2);
              let differenceProcent = ((+currentPrice * 100) / +btc.price - 100).toFixed(3);
              let usdQuote = res.data.BTC.quote.USD;

              if (Math.abs(difference) > 0) {
                bot.sendPhoto('806766796', './assets/Bitcoin.png', {
                  caption: `${difference > 0 ? '🔻' : '🔥'}Внимание!${difference > 0 ? '🔻' : '🔥'}\nЦена BTC сейчас составляет: ${currentPrice}$\n24h --->${
                    usdQuote.volume_change_24h
                  }(${usdQuote.percent_change_24h.toFixed(2)}%) ${usdQuote.percent_change_24h > 0 ? '🚀' : '🔻'}\n7d --->${usdQuote.percent_change_7d}%${
                    usdQuote.percent_change_7d > 0 ? '🚀' : '🔻'
                  }\n${difference > 0 ? `Падение на ${differenceProcent}% за последние 30 минут` : `Рост на ${differenceProcent}% за последние 30 минут`}`,
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
