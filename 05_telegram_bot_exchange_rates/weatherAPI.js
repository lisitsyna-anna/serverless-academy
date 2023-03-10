const axios = require('axios');
const { CITY_NAME, API_KEY } = require('./constants');

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
  const listOfWeatherForcast = await getWeatherForecastByCity(CITY_NAME);

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
      message += `\nā° Time: ${new Date(dt_txt).toLocaleTimeString()}
        š Description: ${weather[0].description}.
        š”ļø Temperature: ${Math.round(temp)} Celcius.
        š”ļø Feels like: ${Math.round(feels_like)} Celcius.
        šØ Wind speed: ${Math.round(wind.speed)} m/s.
        š«ļø Humidity: ${humidity} %.
        š§­ Pressure: ${pressure} hPa
        `;
    } else {
      date = new Date(dt_txt).toDateString();

      if (message.length !== 0) {
        messageArray.push(message);
      }

      message = `Weather in ${CITY_NAME} on ${date}
        \nā° Time: ${new Date(dt_txt).toLocaleTimeString()}.
        š Description: ${weather[0].description}.
        š”ļø Temperature: ${Math.round(temp)} Celcius.
        š”ļø Feels like: ${Math.round(feels_like)} Celcius.
        šØ Wind speed: ${Math.round(wind.speed)} m/s.
        š«ļø Humidity: ${humidity} %.
        š§­ Pressure: ${pressure} hPa\n`;
    }
  }

  return messageArray;
}

module.exports = { getMessageArrayWithWeather };
