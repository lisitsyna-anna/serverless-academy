const { Command } = require('commander');
const TelegramBot = require('node-telegram-bot-api');

const token = '5766851901:AAFeLu_Mvmxjmtslt1kZQtInWoGb-3qEopo';
let chatId = '497808098';

const bot = new TelegramBot(token, { polling: true });
const program = new Command();

// ==================================================================================
// Firs option
program
  .command('message <message>')
  .alias('m')
  .description('Send message to Telegram Bot')
  .action(async message => {
    await bot.sendMessage(chatId, message);
    console.log('You successfully sent message to your bot');
    process.exit();
  });

program
  .command('photo <path>')
  .alias('p')
  .description(
    'Send photo to Telegram Bot. Just drug and drop it in console after p-flag'
  )
  .action(async path => {
    await bot.sendPhoto(chatId, path);
    console.log('You successfully sent photo to your bot');
    process.exit();
  });

program.parse(process.argv);

// ===================================================================================
// Second option

// program
//   .option('-m, --message <message>', 'send message to Telegram Bot')
//   .option(
//     '-p, --photo <path>',
//     'send photo to Telegram Bot. Just drug and drop it in console after p-flag'
//   );

// program.parse(process.argv);
// const argv = program.opts();

// async function invoke({ message, photo }) {
//   if (message) {
//     await bot.sendMessage(chatId, message);
//     console.log('You successfully sent message to your bot');
//     process.exit();
//   }
//   if (photo) {
//     await bot.sendPhoto(chatId, photo);
//     console.log('You successfully sent photo to your bot');
//     process.exit();
//   }
// }

// invoke(argv);
