const https = require('https');

const MAX_NUM_OF_REQUEST = 3;

async function fetchData(endpoint, requestCounter = 0) {
  try {
    const response = await new Promise((resolve, reject) => {
      https
        .get(endpoint, response => {
          let data = '';
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(data);
          });
        })
        .on('error', error => {
          reject(error);
        });
    });

    return JSON.parse(response);
  } catch (error) {
    if (requestCounter < MAX_NUM_OF_REQUEST) {
      await fetchData(endpoint, (requestCounter += 1));
    } else {
      return null;
    }
  }
}

module.exports = {
  fetchData,
};
