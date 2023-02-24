const { default: axios } = require('axios');
const bot = require('./bot');
const Currency = require('./models/Currency');

module.exports = {
  async myCrypto(chatId) {
    Currency.find({}, async (err, list) => {
      if (err) {
        console.error(err);
      } else {
        let total = list.reduce((acc, curr) => +curr.holdings + acc, 0);
        let string = list.map((el) => `Currency: ${el.currency}\nPrice: ${el.price}$\nHoldings: ${el.holdings}$\n==========\n`).join('');
        await bot.sendMessage(chatId, string + `->Total: ${total}$`);
      }
    });
  },

  async startBot(chatId, first_name) {
    console.log(chatId);
    await bot.sendMessage(chatId, `Приветствую тебя ${first_name}! Я твой личный крипто ассистент. Пока нахожусь в демо-версии поэтому могу тупить)`, {
      reply_markup: {
        keyboard: [
          [{ text: '💰 My Crypto' }, { text: '🪙 BTC' }],
          [{ text: 'Buy' }, { text: 'Sell' }],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    });
    return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9ef/db1/9efdb148-747f-30f8-9575-7f6e06d34bac/7.webp');
  },

  async buyCrypto(text) {
    const enteredDataArray = text.slice(5).split(' ');
    Currency.findOne({ currency: enteredDataArray[0].toUpperCase() }, (err, doc) => {
      if (err) {
        console.error(err);
      } else {
        if (!doc) {
          // If there is no element with the given ID, add a new one
          const newCur = new Currency({
            currency: enteredDataArray[0].toUpperCase(),
            price: enteredDataArray[1],
            holdings: enteredDataArray[2],
          });

          newCur.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('New Currency added!');
            }
          });
        } else {
          // If there is an element with the given ID, update it

          doc.holdings = doc.holdings + +enteredDataArray[2];

          doc.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Currency updated!');
            }
          });
        }
      }
    });
  },
  async sellCrypto(text, chatId) {
    const enteredDataArray = text.slice(6).split(' ');
    Currency.findOne({ currency: enteredDataArray[0].toUpperCase() }, (err, doc) => {
      if (err) {
        console.error(err);
      } else {
        if (!doc) {
          bot.sendMessage(chatId, 'Эта позиция в Вашем портфеле отсуствует.😳 Проверьте введенные данные');
        } else {
          // If there is an element with the given ID, update it

          doc.holdings = doc.holdings - +enteredDataArray[2];

          doc.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Currency updated!');
            }
          });
        }
      }
    });
  },
  // Define a function to get the latest BTC price
  async getLatestPrices(currencies) {
    const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

    // Define the parameters to be sent to the API endpoint
    const params = {
      headers: {
        'X-CMC_PRO_API_KEY': '3ff74387-0a6e-4e72-8742-d63376601304',
      },
    };
    try {
      // Send a GET request to the CoinMarketCap API endpoint
      const response = await axios.get(`${apiUrl}?symbol=${currencies}`, params);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
