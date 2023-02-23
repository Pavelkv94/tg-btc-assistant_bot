const TelegramApi = require("node-telegram-bot-api");


//наш токен
const token = '6176432596:AAFIcsS-QcrHoZwFcrvnyZzSg36Z-a6vq6o'
//создали бота
const bot = new TelegramApi(token, { polling: true })

module.exports = bot