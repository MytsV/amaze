const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '../.env'});
const Model = require('./database');

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());

app.get('/', async (req, res) => {
  const data = await Model.findOne();
  if (!data) {
    res.sendStatus(500);
  } else {
    res.send(data.caption);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
