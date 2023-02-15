const axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 120 });

const CURRENCY_EUR = 'EUR';
const CURRENCY_CODE_EUR = 978;

const CURRENCY_USD = 'USD';
const CURRENCY_CODE_USD = 840;

const CURRENCY_UAH = 'UAH';
const CURRENCY_CODE_UAH = 980;
// Privat Bank
// Exchange rates in cash from PrivatBank
const getExchangeRatesInCashFromPrivat = async (currency = CURRENCY_USD) => {
  try {
    const { data } = await axios(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
    );

    if (currency === CURRENCY_EUR) {
      return data.filter(({ ccy }) => ccy === currency);
    }

    return data.filter(({ ccy }) => ccy === currency);
  } catch (error) {
    console.log(error.message);
  }
};

// Exchange rates in non-cash from PrivatBank
const getExchangeRatesNonCashFromPrivat = async (currency = CURRENCY_USD) => {
  try {
    const { data } = await axios(
      'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'
    );
    if (currency === CURRENCY_EUR) {
      return data.filter(({ ccy }) => ccy === currency);
    }

    return data.filter(({ ccy }) => ccy === currency);
  } catch (error) {
    console.log(error.message);
  }
};

const getMessageExchangeRatesFromPrivat = async (currency = CURRENCY_USD) => {
  if (currency === CURRENCY_EUR) {
    const [dataCurrencyInCash] = await getExchangeRatesInCashFromPrivat(
      currency
    );
    const [dataCurrencyNonCash] = await getExchangeRatesNonCashFromPrivat(
      currency
    );
    return `The EUR exchange rate in PrivatBank:\nIn cash (in bank branches):
    💶 Buy: ${Number(dataCurrencyInCash.buy).toFixed(2)} UAH
    💶 Sale: ${Number(dataCurrencyInCash.sale).toFixed(2)} UAH\nIn non-cash:
    💶 Buy: ${Number(dataCurrencyNonCash.buy).toFixed(2)} UAH
    💶 Sale: ${Number(dataCurrencyNonCash.sale).toFixed(2)} UAH
    `;
  }
  const [dataCurrencyInCash] = await getExchangeRatesInCashFromPrivat();
  const [dataCurrencyNonCash] = await getExchangeRatesNonCashFromPrivat();
  return `The USD exchange rate in PrivatBank:\nIn cash (in bank branches):
  💵 Buy: ${Number(dataCurrencyInCash.buy).toFixed(2)} UAH
  💵 Sale: ${Number(dataCurrencyInCash.sale).toFixed(2)} UAH\nIn non-cash:
  💵 Buy: ${Number(dataCurrencyNonCash.buy).toFixed(2)} UAH
  💵 Sale: ${Number(dataCurrencyNonCash.sale).toFixed(2)} UAH
  `;
};

// MonoBank
const getExchangeRatesFromMono = async () => {
  try {
    if (myCache.has('dataFromMono')) {
      console.log('Getting from cash');
      return myCache.get('dataFromMono');
    } else {
      console.log('Getting from API');
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

const getMessageExchangeRatesFromMono = async (currency = CURRENCY_USD) => {
  const dataWithUsdAndEur = await getExchangeRatesFromMono();
  if (currency === CURRENCY_EUR) {
    const [currencyEur] = dataWithUsdAndEur.filter(
      ({ currencyCodeA }) => currencyCodeA === CURRENCY_CODE_EUR
    );

    return `The EUR exchange rate in MonoBank:
    💶 Buy: ${currencyEur.rateBuy.toFixed(2)} UAH
    💶 Sell: ${currencyEur.rateSell.toFixed(2)} UAH\n\n`;
  }

  const [currencyUsd] = dataWithUsdAndEur.filter(
    ({ currencyCodeA }) => currencyCodeA === CURRENCY_CODE_USD
  );
  return `The USD exchange rate in MonoBank:
   💵 Buy: ${currencyUsd.rateBuy.toFixed(2)} UAH
   💵 Sell: ${currencyUsd.rateSell.toFixed(2)} UAH\n\n`;
};

module.exports = {
  getMessageExchangeRatesFromPrivat,
  getMessageExchangeRatesFromMono,
};
