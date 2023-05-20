const express = require('express');
require('dotenv').config({path: '../.env'});

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
