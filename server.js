const bot = require("./bot");
const { monitorPrice } = require("./monitorBTC");

require("dotenv").config();

const runBot = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        bot.sendMessage(chatId, "💰Hi! I help you track the price of bitcoin.💰", {
          reply_markup: {
            keyboard: [["💎 BTC 💎"]],
            one_time_keyboard: false,
            resize_keyboard: true,
          },
        });
      } else if (text === "💎 BTC 💎") {
        monitorPrice(true, chatId);
      } else return bot.sendMessage(chatId, "Я не понимаю тебя, попробуй еще раз!");
    } catch (e) {
      console.log(e);
      return bot.sendMessage(chatId, "Ой! Произошла серьезная ошибка!");
    }
  });
};

runBot();
setInterval(() => monitorPrice(false), 3600 * 1000);
