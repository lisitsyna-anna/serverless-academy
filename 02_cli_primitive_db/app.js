const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');

const dataBasePath = path.join(__dirname, 'data.txt');

(async () => {
  const users = await loadUsersFromDB();

  while (true) {
    let answer = await askFirsQuestion();

    if (answer.user !== '') {
      const detailInfo = await askDetailsQuestions();
      const user = { ...answer, ...detailInfo };
      users.push(user);
    } else {
      await fs.writeFile(dataBasePath, JSON.stringify(users), 'utf8');
      const { confirmation } = await askSearchQuestion();

      if (confirmation) {
        const { serchedUser } = await askSearchedUser();
        let [result] = users.filter(
          ({ user }) =>
            user.toLowerCase().trim() === serchedUser.toLowerCase().trim()
        );

        if (!result) {
          result = 'There is no such user';
        }
        console.log(result);
      }
      return;
    }
  }
})();

async function loadUsersFromDB() {
  let usersTxt = await fs.readFile(dataBasePath, 'utf8');
  let usersDb;

  if (usersTxt.trim() === '') {
    usersDb = [];
  } else {
    usersDb = JSON.parse(usersTxt);
  }

  return usersDb;
}

async function askFirsQuestion() {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'user',
      message: "Enter the user's name. To cancel press ENTER",
    },
  ]);
}

async function askDetailsQuestions() {
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'gender',
      message: 'Choose your Gender.',
      choices: ['male', 'famale'],
    },
    {
      type: 'input',
      name: 'age',
      message: 'Enter your age.',
      validate: answer => {
        if (answer === '' || isNaN(answer)) {
          return 'Please, enter valid age';
        }
        return true;
      },
    },
  ]);
}

async function askSearchQuestion() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Would you like to search value in DB',
    },
  ]);
}

async function askSearchedUser() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'serchedUser',
      message: "Enter user's name you wanna find in DB",
    },
  ]);
}
