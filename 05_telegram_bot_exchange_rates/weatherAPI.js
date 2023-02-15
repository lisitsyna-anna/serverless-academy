const axios = require('axios');
const cityName = 'Tel-Aviv';

const API_KEY = 'a7a2ac74671f6f726e75c4196603a5ed';

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
    if (interval === 6) {
      if (i % 2 === 0) {
        continue;
      }
    }
    const {
      main: { temp, feels_like, humidity, pressure },
      weather,
      wind,
      dt_txt,
    } = listOfWeatherForcast[i];

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

module.exports = { getMessageArrayWithWeather };
