const path = require('path');
const fs = require('fs');

function main() {
  const pathToData = path.join(__dirname, 'data.json');
  const dataArr = JSON.parse(fs.readFileSync(pathToData, 'utf8'));
  const convertedData = transformData(dataArr);

  writeDataToJson(convertedData);
}

main();

function transformData(dataArr) {
  const usersVacations = new Map();

  for (const elem of dataArr) {
    if (usersVacations.has(elem.user._id)) {
      usersVacations.get(elem.user._id).vacations.push({
        startDate: elem.startDate,
        endDate: elem.endDate,
      });
    } else {
      usersVacations.set(elem.user._id, {
        userId: elem.user._id,
        userName: elem.user.name,
        vacations: [
          {
            startDate: elem.startDate,
            endDate: elem.endDate,
          },
        ],
      });
    }
  }

  return Array.from(usersVacations.values());
}

function writeDataToJson(data) {
  fs.writeFileSync('newData.json', JSON.stringify(data));
}
