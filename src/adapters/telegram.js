import { bot } from "../config/bot.js";
import { usersService } from "../features/users/users.service.js";
import { cryptoController } from "../features/crypto/crypto.controller.js";
import { airController } from "../features/air/air.controller.js";
import { WELCOME_MESSAGE, ERROR_MESSAGE, UNKNOWN_COMMAND } from "../constants/messages.js";

// Rate limiter storage: { chatId: { command: lastRequestTime } }
const rateLimitMap = new Map();

// Cooldown period in milliseconds (e.g., 5000 = 5 seconds)
const RATE_LIMIT_COOLDOWN = 5000;

/**
 * Check if user is rate limited for a specific command
 * @param {number} chatId - Telegram chat ID
 * @param {string} command - Command/button text
 * @returns {boolean} True if rate limited, false otherwise
 */
function isRateLimited(chatId, command) {
  const userLimits = rateLimitMap.get(chatId);

  if (!userLimits) {
    rateLimitMap.set(chatId, { [command]: Date.now() });
    return false;
  }

  const lastRequestTime = userLimits[command];
  const now = Date.now();

  if (lastRequestTime && (now - lastRequestTime) < RATE_LIMIT_COOLDOWN) {
    const remainingTime = Math.ceil((RATE_LIMIT_COOLDOWN - (now - lastRequestTime)) / 1000);
    return remainingTime; // Return remaining seconds
  }

  userLimits[command] = now;
  return false;
}

/**
 * Handle /start command - Initialize user and show main menu
 * @param {number} chatId - Telegram chat ID
 * @param {string} first_name - User's first name
 * @param {string} username - User's username
 */
async function handleStartCommand(chatId, first_name, username) {
  try {
    // Check if user exists in database
    const isUserExist = await usersService.findUser(chatId);

    // Add user to database if not exists
    if (!isUserExist) {
      await usersService.addUser({
        chatId,
        first_name,
        username: username || "",
      });
      console.log(`👤 New user added: ${first_name} (${chatId})`);
    }

    const webAppUrl = `${process.env.WEB_APP_URL}/${chatId}`;

    // Send welcome message with keyboard
    await bot.sendMessage(chatId, WELCOME_MESSAGE, {
      reply_markup: {
        keyboard: [
          ["💎 BTC 💎", "💎 SOL 💎"],
          [{ text: "🔥 Listen radio 🔥", web_app: { url: webAppUrl } }, "🌤 Air Quality 🌤", "🔄 Reload bot"],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  } catch (error) {
    console.error("❌ Error handling start command:", error);
    await bot.sendMessage(chatId, ERROR_MESSAGE);
  }
}

/**
 * Initialize and run the Telegram bot
 */
export function runBot() {
  console.log("🤖 Telegram bot is starting...");

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const first_name = msg.from.first_name;
    const username = msg.from.username;

    try {
      // Handle different commands and button presses
      if (text === "/start") {
        await handleStartCommand(chatId, first_name, username);
      } else if (text === "💎 BTC 💎") {
        // Check rate limit
        const rateLimitRemaining = isRateLimited(chatId, text);
        if (rateLimitRemaining) {
          await bot.sendMessage(chatId, `⏳ Please wait ${rateLimitRemaining} seconds before checking BTC again.`);
          return;
        }
        console.log(`📊 BTC price request from user ${chatId}`);
        await cryptoController.handlePriceRequest(chatId, "BTC");
      } else if (text === "💎 SOL 💎") {
        // Check rate limit
        const rateLimitRemaining = isRateLimited(chatId, text);
        if (rateLimitRemaining) {
          await bot.sendMessage(chatId, `⏳ Please wait ${rateLimitRemaining} seconds before checking SOL again.`);
          return;
        }
        console.log(`📊 SOL price request from user ${chatId}`);
        await cryptoController.handlePriceRequest(chatId, "SOL");
      } else if (text === "🌤 Air Quality 🌤") {
        // Check rate limit
        const rateLimitRemaining = isRateLimited(chatId, text);
        if (rateLimitRemaining) {
          await bot.sendMessage(chatId, `⏳ Please wait ${rateLimitRemaining} seconds before checking air quality again.`);
          return;
        }
        console.log(`🌤 AQI check request from user ${chatId}`);
        await airController.handleAQIRequest(chatId);
      } else if (text === "🔄 Reload bot") {
        await handleStartCommand(chatId, first_name, username);
      } else {
        await bot.sendMessage(chatId, UNKNOWN_COMMAND);
      }
    } catch (e) {
      console.error("❌ Bot error:", e);
      await bot.sendMessage(chatId, ERROR_MESSAGE);
    }
  });

  console.log("✅ Telegram bot is running!");
}

/**
 * Get all user chat IDs from database
 * @returns {Promise<number[]>} Array of chat IDs
 */
export async function getAllUserChatIds() {
  try {
    const { usersCollection } = await import("../config/database.js").then(m => m.db.getCollections());
    const users = await usersCollection.find({}).toArray();
    return users.map(user => parseInt(user.chat_id));
  } catch (error) {
    console.error("❌ Error getting user chat IDs:", error);
    return [];
  }
}