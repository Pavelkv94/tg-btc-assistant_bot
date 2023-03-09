const { default: axios } = require('axios');
const bot = require('./bot');
const Currency = require('./models/Currency');
const History = require('./models/History');
const User = require('./models/User');

module.exports = {
  async myCrypto(chatId) {
    Currency.find({ chat_id: chatId }, async (err, list) => {
      if (err) {
        console.error(err);
      } else {
        let total = list.reduce((acc, curr) => +curr.holdings + acc, 0);
        let string = list.map((el) => `Currency: ${el.currency}\nPrice: ${el.price}$\nHoldings: ${el.holdings}\n==========\n`).join('');
        await bot.sendMessage(
          chatId,
          list.length === 0 ? '📊 Вы еще не имеете доступных криптовалют/токенов в вашем портфеле.' : string + `->Total: ${total}$`
        );
      }
    });
  },

  async startBot(msg) {
    const chatId = msg.from.id;
    const first_name = msg.from.first_name;

    User.findOne({ user_chat_id: chatId }, (err, user) => {
      if (err) {
        console.error(err);
      } else {
        if (!user) {
          // If there is no element with the given ID, add a new one
          const newUser = new User({
            user_chat_id: chatId,
            first_name: first_name,
            username: msg.from.username,
          });

          newUser.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('New User added!');
            }
          });
        } else {
          console.log(`User ${first_name} already in DB.`);
        }
      }
    });
    await bot.sendMessage(chatId, `Приветствую тебя ${first_name}! Я твой личный крипто ассистент. Пока нахожусь в демо-версии поэтому могу тупить)`, {
      reply_markup: {
        keyboard: [
          [{ text: '💰 My Crypto' }, { text: '🪙 BTC' }, { text: '📖 History' }],
          [{ text: 'Buy' }, { text: 'Sell' }],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    });
    return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9ef/db1/9efdb148-747f-30f8-9575-7f6e06d34bac/7.webp');
  },

  async buyCrypto(msg) {
    const text = msg.text;
    const enteredDataArray = text.slice(5).split(' ');

    Currency.findOne({ currency: enteredDataArray[0].toUpperCase(), chat_id: msg.chat.id }, (err, doc) => {
      if (err) {
        console.error(err);
      } else {
        const newHistoryNote = new History({
          chat_id: msg.chat.id,
          operation: 'Buy',
          currency: enteredDataArray[0].toUpperCase(),
          price: enteredDataArray[1],
          holdings: enteredDataArray[2],
          date: new Date(),
        });

        newHistoryNote.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('New Note for History added!');
          }
        });

        if (!doc) {
          // If there is no element with the given ID, add a new one
          const newCur = new Currency({
            chat_id: msg.chat.id,
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
    Currency.findOne({ currency: enteredDataArray[0].toUpperCase(), chat_id: chatId }, (err, doc) => {
      if (err) {
        console.error(err);
      } else {
        const newHistoryNote = new History({
          chat_id: chatId,
          operation: 'Sell',
          currency: enteredDataArray[0].toUpperCase(),
          price: enteredDataArray[1],
          holdings: enteredDataArray[2],
          date: new Date(),
        });

        newHistoryNote.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('New Note for History added!');
          }
        });
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
        'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,

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
  async chooseHistory(chatId) {
    bot.sendMessage(chatId, '📚 Выберите, за какой период времени вы хотите посмотреть историю операций:', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: '24h', callback_data: '24h_history' },
            { text: '7d', callback_data: '7d_history' },
            { text: '30d', callback_data: '30d_history' },
          ],
        ],
      }),
      resize_keyboard: true,
    });
  },
  async getHistory(chatId, data) {
    History.find({ chat_id: chatId }, (err, history) => {
      if (err) {
        console.error(err);
      } else {
        function formatDate(date) {
          const currentDate = new Date(date);
          let options = { day: '2-digit', month: '2-digit', year: '2-digit' };
          let dateString = currentDate.toLocaleDateString('es-ES', options);
          options = { hour: '2-digit', minute: '2-digit' };
          let timeString = currentDate.toLocaleTimeString('es-ES', options);
          return `${dateString} ${timeString}`;
        }

        const historyOptions = {
          '24h_history': 1,
          '7d_history': 7,
          '30d_history': 30,
        };

        let today = new Date();
        let lastWeek = new Date(today.getTime() - +historyOptions[data] * 24 * 60 * 60 * 1000); // subtract 7 days in milliseconds
        let filteredArray = history.filter((item) => {
          let itemDate = new Date(item.date);

          return itemDate >= lastWeek && itemDate <= today;
        });

        if (filteredArray.length === 0) {
          bot.sendMessage(chatId, `📊 У вас еще нет операций в вашем портфеле за этот период.`);
        } else {
          let note = history.map(
            (el) =>
              `${el.operation === 'Buy' ? '🟢' : '🔴'}${el.operation}\nНазвание: ${el.currency}\nСтоимость: ${
                el.price
              }$\nКоличество: ${el.holdings}\nДата: ${formatDate(el.date)}\n================`
          ).join('\n');
          bot.sendMessage(chatId, note);
        }
      }
    });
  },
};
