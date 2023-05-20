const mongoose = require('mongoose');
require('dotenv').config({path: '../.env'});

mongoose.connect(process.env.DB_URL);

const dataSchema = new mongoose.Schema({
  caption: {
    type: String,
  },
});

module.exports = mongoose.model('outputs', dataSchema);
