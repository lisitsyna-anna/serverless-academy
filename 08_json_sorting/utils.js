const fs = require('fs');
const path = require('path');

function loadEndpointsFromFile() {
  const pathToEndpointsFile = path.join(__dirname, 'endpoints.txt');
  const endpointsInTxt = fs.readFileSync(pathToEndpointsFile, 'utf-8');

  return endpointsInTxt.split('\n').filter(elem => elem !== '');
}

function findFieldIsDone(obj) {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (key === 'isDone') {
        return obj[key];
      } else if (obj[key] !== null && typeof obj[key] === 'object') {
        let result = findFieldIsDone(obj[key]);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
}

module.exports = {
  loadEndpointsFromFile,
  findFieldIsDone,
};
