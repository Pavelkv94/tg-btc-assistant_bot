const { Schema, model } = require('mongoose');

const History = new Schema({
  chat_id: { type: Number },
  operation: { type: String },
  currency: { type: String },
  price: { type: Number },
  holdings: { type: Number },
  date: { type: String },
});

module.exports = model('History', History);
