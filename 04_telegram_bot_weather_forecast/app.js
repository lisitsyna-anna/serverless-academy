const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const API_KEY = 'a7a2ac74671f6f726e75c4196603a5ed';
const TOKEN_BOT = '6046633708:AAHTp-drqafLO-HFxybW5wNwnaz0FqSPlOY';

const cityName = 'Tel-Aviv';

let intervalId = null;
const DELAY_3_HOURS = 3 * 60 * 60 * 1000;
const DELAY_6_HOURS = 6 * 60 * 60 * 1000;

const TEXT_INTERVAL_3_HOURS = 'At intervals of 3 hours';
const TEXT_INTERVAL_6_HOURS = 'At intervals of 6 hours';
const TEXT_STOP_BOT = 'Stop sending message';
const TEXT_FORCAST = `Forcast in ${cityName}`;

const bot = new TelegramBot(TOKEN_BOT, { polling: true });

// Buttons
const buttons = {
  intervalButtons: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: TEXT_INTERVAL_3_HOURS }, { text: TEXT_INTERVAL_6_HOURS }],
        [{ text: TEXT_STOP_BOT }],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
      force_reply: true,
    }),
  },
  cityButton: {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: TEXT_FORCAST }]],
      one_time_keyboard: true,
      resize_keyboard: true,
      force_reply: true,
    }),
  },
};

bot.setMyCommands([
  { command: '/start', description: 'Start bot' },
  { command: '/stop', description: 'Stop bot' },
]);

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `If you want to know the weather forecast for ${cityName}, click the button below`,
    buttons.cityButton
  );
});

bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const answer = msg.text;

  if (answer === TEXT_FORCAST) {
    bot.sendMessage(
      chatId,
      'Select the interval at which you want to receive the weather forecast',
      buttons.intervalButtons
    );
    return;
  }

  if (answer === TEXT_INTERVAL_3_HOURS) {
    const message = await getMessageWithWeather();
    bot.sendMessage(
      chatId,
      `
     ${message}.\n\nYou will receive the next message in 3 hours.\n\nIf you want stop bot, type '/stop' or press button below ⬇️`
    );

    sendMessageWithInterval(chatId, DELAY_3_HOURS);
    return;
  }

  if (answer === TEXT_INTERVAL_6_HOURS) {
    const message = await getMessageWithWeather();
    bot.sendMessage(
      chatId,
      `
     ${message}. \n\nYou will receive the next message in 6 hours.\n\nIf you want stop bot, type '/stop' or press button below ⬇️`
    );

    sendMessageWithInterval(chatId, DELAY_6_HOURS);
    return;
  }

  if (answer === TEXT_STOP_BOT || answer === '/stop') {
    clearInterval(intervalId);
    bot.sendMessage(
      chatId,
      "Okay, weather messages won't be sent 😞\nIf you want to get the weather forecast again, type '/start'😉"
    );
    return;
  }
});

async function getWeatherForecastByCity(cityName) {
  try {
    const { data } = await axios(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

async function getMessageWithWeather() {
  const {
    weather,
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    wind: { speed },
  } = await getWeatherForecastByCity(cityName);

  return (
    `📆 Current weather in ${cityName}:` +
    `\n📝 Description: ${weather[0].description}.` +
    `\n🌡️ Average temperature: ${temp.toFixed(1)} Celsius.` +
    `\n🥵 Max temperature: ${temp_max.toFixed(1)} Celsius.` +
    `\n🥶 Min temperature: ${temp_min.toFixed(1)} Celsius.` +
    `\n🌡️ Feels like: ${feels_like.toFixed(1)} Celsius.` +
    `\n🌫️ Pressure: ${pressure} hPa.` +
    `\n💦 Humidity: ${humidity} %.` +
    `\n💨 Wind speed: ${speed} meter/sec`
  );
}

function sendMessageWithInterval(chatId, delay) {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(async () => {
    const message = await getMessageWithWeather();
    bot.sendMessage(
      chatId,
      `${message} \n\nIf you want stop bot, type '/stop' or press button below ⬇️`
    );
  }, delay);
}
