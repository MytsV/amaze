## Примітка для викладача

Цей проєкт реалізований у зовсім неповній мірі порівняно з тим, що планувалось і було записано у звіті, через значну нестачу часу ~~і вигорання~~.\
Для зручності Вашої перевірки, ось список того, що реалізувати вдалося:
- бібліотеку логіки головоломки з імплементованими типами модифікаторів, які описані у звіті, і можливістю легкої додачі нових
- покрити бібліотеку юніт-тестами
- ініціалізувати проєкти клієнта й сервера, додавши туди код-заглушку, який перевіряє взаємодію клієнта - сервера - бази даних
- налаштувати запуск у контейнерах усіх елементів загальної системи
- налаштувати CI і git hooks

# Amaze

## Table of contents
* [General description](#general-description)
* [Setup and usage](#setup-and-usage)
* [Use as a library](#use-as-a-library)

## General description
A platform for creating, sharing and solving maze-like puzzles, inspired by The Witness.\
Виконаний як курсова робота з предмету "МТРПЗ" Миць Вікторією, група ІМ-12.

## Setup and usage
To run this project, make sure you have the latest version of [Node.js and npm](https://nodejs.org/en/download) installed.

You can clone it onto your local device via
```bash
git clone https://github.com/MytsV/amaze
```

After the clone, you have to create an .env file in the root directory of the project. Here is an example (no confidential data is provided):
```dotenv
CLIENT_PORT=30000
SERVER_PORT=30001
DB_URL=mongodb://localhost:27017
SERVER_URL=http://localhost:30001
DB_PORT=27017
```
You may change the ports as you like or provide authentication for you MongoDB instance. It is recommended to add a suffix to your .env file, as .env.local.

### Standalone run

Your .env file for such run should contain a URI of your local MongoDB instance.

To run server without containerization, from the root directory:
```bash
# Switch to directory of server module
cd server
# Provide a path to your .env file as an argument
npm run start ../.env.local
```
You will see 'example app listening on port ...' message if everything is fine.

To run client without containerization, from the root directory:
```bash
# Switch to directory of client module
cd client
# Provide a path to your .env file as an argument
npm run start ../.env.local
```

### Containerized run

Your .env file for such run should contain such entry for DB_URL:
```dotenv
# We use a hostname provided by docker-compose
DB_URL=mongodb://mongodb:27017
```
I prefer creating a separate dotenv file named .env.development. Then, from the root directory, run:
```bash
# Make sure all the containers are removed.
# Use your dotenv file path after --env-file flag.
docker compose --env-file .env.development down
docker compose --env-file .env.development up
```
If there are no entries in the database, after Hello world! in the client app you will see a message about server processing error.

### Run tests

To run tests for any module, `cd` into its directory and execute
```bash
npm test
```

### Style checks

To check style of the whole project, from the root directory run:
```bash
npm run lint-check
```
To fix it, run:
```bash
npm run lint-fix
```

### Using hooks

The pre-commit hook will check code style of every staged file and fail commit if linter returns an error.
To use it locally, run:
```bash
git config --local core.hooksPath .githooks/
```

## Use as a library

To install it in your local project, run:
```bash
npm install 'https://gitpkg.now.sh/MytsV/amaze/libs/puzzle?master'
```

Then use it in your code like:
```js
const {Maze, Position, Path, Solution} = require('amaze-puzzle');

// Create a new 2x2 maze
const maze = new Maze(2, 2);

// Add its origin and endpoint
maze.addOrigin(new Position(0, 0));
maze.addEndpoint(new Position(2, 2));

const path = new Path();
path.vertices = [
  new Position(0, 0),
  new Position(0, 1),
  new Position(1, 1),
  new Position(2, 1),
];

const solution = new Solution(maze, path);
// The result will be false, as the path doesn't end on an endpoint
console.log(solution.isValid());
```
