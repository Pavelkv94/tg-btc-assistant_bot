import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_BOT_TOKEN;

if (!token) {
  throw new Error("❌ Telegram Bot Token not provided. Please set TG_BOT_TOKEN in environment variables.");
}

export const bot = new TelegramBot(token, { polling: true });

