const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const API_KEY = 'a7a2ac74671f6f726e75c4196603a5ed';
const TOKEN_BOT = '6046633708:AAHTp-drqafLO-HFxybW5wNwnaz0FqSPlOY';

const cityName = 'Tel-Aviv';

const TEXT_INTERVAL_3_HOURS = 'At intervals of 3 hours';
const TEXT_INTERVAL_6_HOURS = 'At intervals of 6 hours';
const TEXT_FORCAST = `Weather forcast in ${cityName}`;

const bot = new TelegramBot(TOKEN_BOT, { polling: true });

// Buttons
const buttons = {
  intervalButtons: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: TEXT_INTERVAL_3_HOURS }, { text: TEXT_INTERVAL_6_HOURS }],
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

bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const answer = msg.text;

  switch (answer) {
    case '/start':
      bot.sendMessage(
        chatId,
        `Hello!😉 If you want to know the weather forecast for ${cityName}, click the button below ⬇️`,
        buttons.cityButton
      );
      break;
    case TEXT_FORCAST:
      bot.sendMessage(
        chatId,
        'Great!😊 Select the interval at which you want to receive the weather forecast ⬇️',
        buttons.intervalButtons
      );
      break;
    case TEXT_INTERVAL_3_HOURS:
      sendMessagesWithWaether(chatId);
      break;

    case TEXT_INTERVAL_6_HOURS:
      sendMessagesWithWaether(chatId, 6);
      break;

    case '/stop':
      bot.sendMessage(
        chatId,
        "If you want to get the weather forecast again, type '/start'😉"
      );
      break;

    default:
      bot.sendMessage(chatId, 'Sorry, there is no such command 😕');
  }
});

async function getWeatherForecastByCity(cityName) {
  try {
    const { data } = await axios(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    return data.list;
  } catch (error) {
    console.log(error.message);
  }
}

async function getMessageArrayWithWeather(interval = 3) {
  const listOfWeatherForcast = await getWeatherForecastByCity(cityName);

  let messageArray = [];
  let message = '';
  let date = '';

  for (let i = 0; i < listOfWeatherForcast.length; i += 1) {
    const {
      main: { temp, feels_like, humidity, pressure },
      weather,
      wind,
      dt_txt,
    } = listOfWeatherForcast[i];

    if (interval === 6 && i % 2 === 0) {
      continue;
    }

    if (
      date === new Date(dt_txt).toDateString() &&
      i < listOfWeatherForcast.length - 1
    ) {
      message += `\n⏰ Time: ${new Date(dt_txt).toLocaleTimeString()}
      📝 Description: ${weather[0].description}.
      🌡️ Temperature: ${Math.round(temp)} Celcius.
      🌡️ Feels like: ${Math.round(feels_like)} Celcius.
      💨 Wind speed: ${Math.round(wind.speed)} m/s.
      🌫️ Humidity: ${humidity} %.
      🧭 Pressure: ${pressure} hPa
      `;
    } else {
      date = new Date(dt_txt).toDateString();

      if (message.length !== 0) {
        messageArray.push(message);
      }

      message = `Weather in ${cityName} on ${date}
      \n⏰ Time: ${new Date(dt_txt).toLocaleTimeString()}.
      📝 Description: ${weather[0].description}.
      🌡️ Temperature: ${Math.round(temp)} Celcius.
      🌡️ Feels like: ${Math.round(feels_like)} Celcius.
      💨 Wind speed: ${Math.round(wind.speed)} m/s.
      🌫️ Humidity: ${humidity} %.
      🧭 Pressure: ${pressure} hPa\n`;
    }
  }

  return messageArray;
}

async function sendMessagesWithWaether(chatId, interval = 3) {
  let messageArray;

  if (interval === 6) {
    messageArray = await getMessageArrayWithWeather(6);
  }
  messageArray = await getMessageArrayWithWeather();

  for (let i = 0; i < messageArray.length; i += 1) {
    await bot.sendMessage(chatId, messageArray[i]);
  }
}
