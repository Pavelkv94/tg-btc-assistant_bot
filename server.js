const bot = require('./bot');
const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent')

require('dotenv').config()

// Set up the Telegram bot
const botActions = () => {
    
bot.on('message', async (msg) => {
    const text = msg.text;
    console.log(text)
    const chatId = msg.chat.id
    try {
        if (text === '/start') {
            await bot.sendMessage(chatId, `Приветствую тебя ${msg.from.first_name}! Я твой личный ассистент. Пока нахожусь в демо-версии поэтому могу тупить)`)
            return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/9ef/db1/9efdb148-747f-30f8-9575-7f6e06d34bac/7.webp")
        }
       

        return bot.sendMessage(chatId, "Я не понимаю тебя, попробуй еще раз!")
    }
    catch {
        return bot.sendMessage(chatId, "Ой! Произошла серьезная ошибка!")
    }
})
}
botActions()
// Get the chat ID from the environment variable
// const chatId = process.env.TELEGRAM_CHAT_ID;

// // Define the URL of the CoinMarketCap API endpoint
// const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// // Define the parameters to be sent to the API endpoint
// const params = {
//   headers: {
//     'X-CMC_PRO_API_KEY': "3ff74387-0a6e-4e72-8742-d63376601304",
//   },
// //   json: true,
// //   gzip: true,
// //   muteHttpExceptions: true,

// };
// var qq = "?id=1"

// // Define a variable to store the previous BTC price
// let previousPrice = null;

// // Define a function to get the latest BTC price
// async function getLatestPrice() {
//   try {
//     // Send a GET request to the CoinMarketCap API endpoint
//     const response = await axios.get(apiUrl+qq, params);

//     // Extract the latest BTC price from the response
//     const latestPrice = response.data.data['1'].quote.USD.price;

//     // Return the latest BTC price
//     return latestPrice;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Define a function to send a Telegram message
// async function sendMessage(text) {
//   try {
//     // Send a message to the specified chat ID
//     await bot.sendMessage(chatId, text);
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Define a function to monitor the BTC price
// async function monitorPrice() {
//   try {
//     // Get the latest BTC price
//     const latestPrice = await getLatestPrice();
//     console.log(latestPrice)
//     bot.sendMessage(chatId, `Поздравляю в`)
//     // If the previous price is not null and the difference between the latest price and the previous price is at least $1000
//     if (true) {
//       // Send an alert message to the Telegram chat
//       const message = `🚨 Bitcoin price alert! 🚨\n\nThe price of Bitcoin has changed by at least $1000!\n\nPrevious price: $${previousPrice}\nLatest price: $${latestPrice}`;
//       await sendMessage(message);
//     }

//     // Update the previous price
//     previousPrice = latestPrice;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Start monitoring the BTC price every minute
// setInterval(monitorPrice, 10 * 1000);

// Start the Express server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });