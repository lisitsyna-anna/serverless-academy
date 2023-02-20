const fs = require('fs');
const path = require('path');

const dirPath = path.join('data');
const usersData = {};

function loadUniqDataFromFiles() {
  const arrayOfFiles = fs.readdirSync(dirPath);

  for (let i = 0; i < arrayOfFiles.length; i += 1) {
    const filePath = path.join(__dirname, 'data', arrayOfFiles[i]);

    const usersInTxt = fs.readFileSync(filePath, 'utf8');
    const setOfUniqueUsers = new Set(usersInTxt.split('\n'));

    setOfUniqueUsers.forEach(user => {
      if (usersData[user]) {
        usersData[user] += 1;
      } else {
        usersData[user] = 1;
      }
    });
  }
}

function getAmountOfUniqueValues() {
  console.log(`Unique values: ${Object.keys(usersData).length}`);
}

function getAmountOfValuesWhichExistInAllFiles() {
  let userCounter = 0;

  const users = Object.keys(usersData);

  for (let user of users) {
    if (usersData[user] === 20) {
      userCounter += 1;
    }
  }

  console.log(`Number of users existing in all fiels: ${userCounter}`);
}

function getAmountOfValuesWhichExistInAtLeastTenFiels() {
  let userCounter = 0;

  const users = Object.keys(usersData);

  for (let user of users) {
    if (usersData[user] >= 10) {
      userCounter += 1;
    }
  }

  console.log(`Number of users existing in at least 10 fiels: ${userCounter}`);
}

function startProgramAndCheckPerformance() {
  console.time('Execution time of the entire program');

  console.time('Execution time of "loadUniqDataFromFiles"');
  loadUniqDataFromFiles();
  console.timeEnd('Execution time of "loadUniqDataFromFiles"');

  console.time('Execution time "getAmountOfUniqueValues"');
  getAmountOfUniqueValues();
  console.timeEnd('Execution time "getAmountOfUniqueValues"');

  console.time('Execution time "getAmountOfValuesWhichExistInAllFiles"');
  getAmountOfValuesWhichExistInAllFiles();
  console.timeEnd('Execution time "getAmountOfValuesWhichExistInAllFiles"');

  console.time('Execution time "getAmountOfValuesWhichExistInAtLeastTenFiels"');
  getAmountOfValuesWhichExistInAtLeastTenFiels();
  console.timeEnd('Execution time "getAmountOfValuesWhichExistInAtLeastTenFiels"');

  console.timeEnd('Execution time of the entire program');
}

startProgramAndCheckPerformance();
