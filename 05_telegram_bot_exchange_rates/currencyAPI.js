const axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 120 });

const {
  CURRENCY_USD,
  CURRENCY_EUR,
  CURRENCY_CODE_EUR,
  CURRENCY_CODE_USD,
  CURRENCY_CODE_UAH,
} = require('./constants');

// Privat Bank
const getExchangeRatesFromPrivat = async (currency = CURRENCY_USD) => {
  try {
    const { data: dataInCash } = await axios(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
    );

    const { data: dataNonCash } = await axios(
      'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'
    );

    const [cash] = dataInCash.filter(({ ccy }) => ccy === currency);
    const [nonCash] = dataNonCash.filter(({ ccy }) => ccy === currency);

    return { cash, nonCash };
  } catch (error) {
    console.log(error.message);
  }
};

const getMessageExchangeRatesFromPrivat = async (currency = CURRENCY_USD) => {
  const { cash, nonCash } = await getExchangeRatesFromPrivat(currency);
  let currencyIcon = CURRENCY_USD === currency ? '💵' : '💶';

  return `The ${currency} exchange rate in PrivatBank:\nIn cash (in bank branches):
    ${currencyIcon} Buy: ${Number(cash.buy).toFixed(2)} UAH
    ${currencyIcon} Sale: ${Number(cash.sale).toFixed(2)} UAH\nIn non-cash:
    ${currencyIcon} Buy: ${Number(nonCash.buy).toFixed(2)} UAH
    ${currencyIcon} Sale: ${Number(nonCash.sale).toFixed(2)} UAH
    `;
};

// MonoBank
const getExchangeRatesFromMono = async () => {
  try {
    if (myCache.has('dataFromMono')) {
      return myCache.get('dataFromMono');
    } else {
      const { data } = await axios('https://api.monobank.ua/bank/currency');
      const dataWithUsdAndEur = data.filter(
        ({ currencyCodeA, currencyCodeB }) =>
          (currencyCodeA === CURRENCY_CODE_EUR &&
            currencyCodeB === CURRENCY_CODE_UAH) ||
          (currencyCodeA === CURRENCY_CODE_USD &&
            currencyCodeB === CURRENCY_CODE_UAH)
      );
      myCache.set('dataFromMono', dataWithUsdAndEur);
      return dataWithUsdAndEur;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getMessageExchangeRatesFromMono = async (
  currencyCode = CURRENCY_CODE_USD
) => {
  const dataWithUsdAndEur = await getExchangeRatesFromMono();
  let currencyIcon = CURRENCY_CODE_USD === currencyCode ? '💵' : '💶';

  const [currencyData] = dataWithUsdAndEur.filter(
    ({ currencyCodeA }) => currencyCodeA === currencyCode
  );

  return `The ${
    currencyCode === CURRENCY_CODE_USD ? CURRENCY_USD : CURRENCY_EUR
  } exchange rate in MonoBank:
    ${currencyIcon} Buy: ${currencyData.rateBuy.toFixed(2)} UAH
    ${currencyIcon} Sell: ${currencyData.rateSell.toFixed(2)} UAH\n\n`;
};

module.exports = {
  getMessageExchangeRatesFromPrivat,
  getMessageExchangeRatesFromMono,
};
