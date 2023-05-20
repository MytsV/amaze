const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '../.env'});

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
