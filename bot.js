const TelegramBot = require('node-telegram-bot-api');
const User = require('./user');
const cron = require('node-cron');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Retry mechanism
const withRetry = (fn, retries = 3) => async (...args) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(...args);
    } catch (err) {
      console.error(`Error: ${err.message}. Retry ${i + 1} of ${retries}`);
      if (i === retries - 1) throw err;
    }
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome! Say "hi" to subscribe to daily weather updates.');
});

bot.onText(/hi/, withRetry(async (msg) => {
  const chatId = msg.chat.id;
  try {
    let user = await User.findOne({ telegramId: chatId });
    if (!user) {
      user = new User({ telegramId: chatId });
      await user.save();
    }
    bot.sendMessage(chatId, 'Click here to subscribe: /subscribe');
  } catch (err) {
    console.error('Error subscribing user:', err.message);
    bot.sendMessage(chatId, 'Error subscribing. Please try again later.');
  }
}));

bot.onText(/\/subscribe/, withRetry(async (msg) => {
  const chatId = msg.chat.id;
  try {
    let user = await User.findOne({ telegramId: chatId });
    if (!user) {
      user = new User({ telegramId: chatId });
      await user.save();
    }
    bot.sendMessage(chatId, 'You have subscribed to daily weather updates.');
  } catch (err) {
    console.error('Error subscribing user:', err.message);
    bot.sendMessage(chatId, 'Error subscribing. Please try again later.');
  }
}));

const sendDailyWeather = withRetry(async () => {
  const users = await User.find({ blocked: false });
  for (let user of users) {
    // Fetch weather data and send it to user.telegramId
    bot.sendMessage(user.telegramId, 'Here is your daily weather update...');
  }
});

cron.schedule('0 7 * * *', sendDailyWeather);

module.exports = bot;
