const { loadEndpointsFromFile, findFieldIsDone } = require('./utils');
const { fetchData } = require('./fetchData');

let trueCounter = 0;
let fasleCounter = 0;

async function main() {
  const endpoints = loadEndpointsFromFile();

  for (i = 0; i < endpoints.length; i += 1) {
    const data = await fetchData(endpoints[i]);

    if (!data) {
      console.log(`[Fail] ${endpoints[i]}: The endpoint is unavailable`);
    } else {
      const isDone = findFieldIsDone(data);
      isDone ? (trueCounter += 1) : (fasleCounter += 1);
      console.log(`[Success] ${endpoints[i]}: isDone - ${isDone}`);
    }
  }

  console.log(`Found True values: ${trueCounter}\nFound False values: ${fasleCounter}`);
}

main();
