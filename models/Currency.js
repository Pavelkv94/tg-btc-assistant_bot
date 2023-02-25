const { Schema, model } = require('mongoose');

const Currency = new Schema({
  chat_id: {type: Number},
  currency: { type: String },
  price: { type: Number },
  holdings: { type: Number },
});

module.exports = model('Currency', Currency);
