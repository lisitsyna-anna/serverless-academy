const readlinePromises = require('node:readline/promises');

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  while (true) {
    const answer = await rl.question(
      'Enter 10 words or digits deviding them in spaces.\n(If you want to end the program, type exit) '
    );
    let arrayOfAnswer = answer.trim().split(' ');

    if (answer.trim().toLowerCase() === 'exit') {
      rl.close();
      break;
    }
    if (arrayOfAnswer.length < 2) {
      console.log('Please enter more than 2 items');
      continue;
    }
    if (arrayOfAnswer.length > 10) {
      console.log('Please enter no more than 10 items ');
      continue;
    }
    if (arrayOfAnswer.length > 2) {
      await showMenu(arrayOfAnswer);
    }
  }
})();

async function showMenu(arr) {
  const answer = await rl.question(
    '1. Sort words alphabetically.\n' +
      '2. Show numbers from lesser to greater.\n' +
      '3. Show numbers from bigger to smaller\n' +
      '4. Display words in ascending order by number of letters in the word.\n' +
      '5. Show only unique words.\n' +
      '6. Display only unique values from the set of words and numbers entered by the user\n'
  );

  let result;

  switch (answer) {
    case '1':
      result = sortWordsByAlphabet(arr);
      break;

    case '2':
      result = showAscendingNumbers(arr);
      break;

    case '3':
      result = showDescendingNumbers(arr);
      break;

    case '4':
      result = showWordsByLettersAmountAscending(arr);
      break;

    case '5':
      result = showUniqueWords(arr);
      break;

    case '6':
      result = showUniqueValues(arr);
      break;

    default:
      result = 'Choose an option from the list';
  }

  if (result.length === 0) {
    console.log('Nothing to sort');
  } else {
    console.log(result);
  }
}

function sortWordsByAlphabet(arr) {
  return arr.filter(item => !isNumber(item)).sort();
}

function showAscendingNumbers(arr) {
  return arr.filter(item => isNumber(item)).sort((a, b) => a - b);
}

function showDescendingNumbers(arr) {
  return arr.filter(item => isNumber(item)).sort((a, b) => b - a);
}

function showWordsByLettersAmountAscending(arr) {
  return arr
    .filter(item => !isNumber(item))
    .sort((a, b) => a.length - b.length);
}

function showUniqueWords(arr) {
  return arr
    .filter(item => !isNumber(item))
    .filter((item, index, arr) => arr.indexOf(item) === index);
}

function showUniqueValues(arr) {
  return arr.filter((item, index, arr) => arr.indexOf(item) === index);
}

function isNumber(value) {
  return !isNaN(Number(value));
}
