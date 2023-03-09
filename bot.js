const TelegramApi = require("node-telegram-bot-api");


//наш токен
const token = process.env.BOT_TOKEN;
//создали бота
const bot = new TelegramApi(token, { polling: true })

module.exports = bot