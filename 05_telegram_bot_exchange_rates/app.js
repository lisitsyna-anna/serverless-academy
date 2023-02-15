const TelegramBot = require('node-telegram-bot-api');
const {
  getMessageExchangeRatesFromMono,
  getMessageExchangeRatesFromPrivat,
} = require('./currencyAPI');
const { getMessageArrayWithWeather } = require('./weatherAPI');

const TOKEN_BOT = '6046633708:AAHTp-drqafLO-HFxybW5wNwnaz0FqSPlOY';

const cityName = 'Tel-Aviv';

const TEXT_INTERVAL_3_HOURS = 'At intervals of 3 hours';
const TEXT_INTERVAL_6_HOURS = 'At intervals of 6 hours';
const TEXT_FORCAST = `Weather forcast in ${cityName}`;
const TEXT_EXCHANGE_RATES = 'Exchange rates';
const CURRENCY_EUR = 'EUR';
const CURRENCY_USD = 'USD';
const TEXT_PREVIOUS_MENU = 'Previous menu';

const bot = new TelegramBot(TOKEN_BOT, { polling: true });

// Buttons
const buttons = {
  menuButtons: {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: TEXT_FORCAST }], [{ text: TEXT_EXCHANGE_RATES }]],
      one_time_keyboard: true,
      resize_keyboard: true,
      force_reply: true,
    }),
  },
  weatherMenu: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: TEXT_INTERVAL_3_HOURS }, { text: TEXT_INTERVAL_6_HOURS }],
        [{ text: TEXT_PREVIOUS_MENU }],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
      force_reply: true,
    }),
  },

  currencyMenu: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: CURRENCY_USD }, { text: CURRENCY_EUR }],
        [{ text: TEXT_PREVIOUS_MENU }],
      ],
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
        `Hello!😉 What do you want to know? Choose an option below ⬇️`,
        buttons.menuButtons
      );
      break;
    case TEXT_FORCAST:
      bot.sendMessage(
        chatId,
        'Great!😊 Select the interval at which you want to receive the weather forecast ⬇️',
        buttons.weatherMenu
      );
      break;
    case TEXT_INTERVAL_3_HOURS:
      sendMessagesWithWaether(chatId);
      break;

    case TEXT_INTERVAL_6_HOURS:
      sendMessagesWithWaether(chatId, 6);
      break;

    case TEXT_EXCHANGE_RATES:
      bot.sendMessage(
        chatId,
        `Great!😊 Select the currency for which you want to know the exchange rate. ⬇️ `,
        buttons.currencyMenu
      );
      break;

    case CURRENCY_USD:
      const messageFromPrivatUsd = await getMessageExchangeRatesFromPrivat();
      const messageFromMonoUsd = await getMessageExchangeRatesFromMono();

      bot.sendMessage(chatId, messageFromMonoUsd + messageFromPrivatUsd);
      break;

    case CURRENCY_EUR:
      const messageFromPrivatEur = await getMessageExchangeRatesFromPrivat(
        CURRENCY_EUR
      );
      const messageFromMonoEur = await getMessageExchangeRatesFromMono(
        CURRENCY_EUR
      );
      bot.sendMessage(chatId, messageFromMonoEur + messageFromPrivatEur);
      break;

    case TEXT_PREVIOUS_MENU:
      bot.sendMessage(
        chatId,
        'What do you want to know? Choose an option below ⬇️',
        buttons.menuButtons
      );
      break;

    case '/stop':
      bot.sendMessage(
        chatId,
        "If you want to start the bot again, type '/start'😉"
      );
      break;

    default:
      bot.sendMessage(chatId, 'Sorry, there is no such command 😕');
  }
});

async function sendMessagesWithWaether(chatId, interval = 3) {
  let messageArray = await getMessageArrayWithWeather();
  if (interval === 6) {
    messageArray = await getMessageArrayWithWeather(6);
  }
  for (let i = 0; i < messageArray.length; i += 1) {
    await bot.sendMessage(chatId, messageArray[i]);
  }
}
