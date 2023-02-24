const { default: axios } = require('axios');
const bot = require('./bot');
const mongoose = require('mongoose');
const Currency = require('./models/Currency');
const { startBot, myCrypto, buyCrypto, getLatestPrices, sellCrypto } = require('./buttonsActions');
const { monitorPrice } = require('./monitorBTC');

require('dotenv').config();

const url = `mongodb+srv://${process.env.DB_OWNER}:${process.env.DB_PASS}@clusterfortgbot.hi5sp.mongodb.net/tg?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.log(err);
  });

// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;

// Получение подключения по умолчанию
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

// Set up the Telegram bot
const botActions = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const first_name = msg.from.first_name;
    const chatId = msg.chat.id;

    try {
      if (text === '/start') {
        startBot(chatId, first_name);
      } else if (text === '💰 My Crypto') {
        myCrypto(chatId);
      } else if (text === '🪙 BTC') {
        monitorPrice();
      } else if (text === 'Buy') {
        bot.sendMessage(
          chatId,
          'Введите криптовалюту/токен которые хотите купить, в формате:\n ".buy Название Цена покупки Количество"\n-------\n Например: .buy BTC 23450 0.002'
        );
      } else if (text.slice(0, 4) === '.buy' && text.slice(5).split(' ').length === 3) {
        buyCrypto(text);
        bot.sendMessage(chatId, '⚡️ Ваш портфель обновлен. ⚡️');
      } else if (text === 'Sell') {
        bot.sendMessage(
          chatId,
          'Введите криптовалюту/токен которые хотите продать, в формате:\n ".sell Название Цена покупки Количество"\n-------\n Например: .sell BTC 23450 0.002'
        );
      } else if (text.slice(0, 5) === '.sell' && text.slice(6).split(' ').length === 3) {
        sellCrypto(text, chatId);
        bot.sendMessage(chatId, '⚡️ Ваш портфель обновлен. ⚡️');
      } else return bot.sendMessage(chatId, 'Я не понимаю тебя, попробуй еще раз!');
    } catch (e) {
      console.log(e);
      return bot.sendMessage(chatId, 'Ой! Произошла серьезная ошибка!');
    }
  });
};

botActions();
setInterval(monitorPrice, 1800 * 1000);
