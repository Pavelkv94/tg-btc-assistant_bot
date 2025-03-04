const bot = require("./bot");
const { monitorPrice } = require("./monitorBTC");
const { saveUserId } = require("./utils/usersProcess");

require("dotenv").config();

const runBot = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    const webAppUrl = process.env.NAVIDROME_URL;

    try {
      if (text === "/start") {
        saveUserId(chatId);
        bot.sendMessage(chatId, "💰Hi! I help you track the price of bitcoin.💰 Test", {
          reply_markup: {
            keyboard: [["💎 BTC 💎", { text: "🔥 Navidrome 🔥", web_app: { url: webAppUrl } }]],
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
setInterval(() => monitorPrice(false), 1200 * 1000);
