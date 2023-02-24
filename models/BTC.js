const { Schema, model } = require('mongoose');

const BTC = new Schema({
  currency: { type: String },
  price: { type: Number },
});

module.exports = model('BTC', BTC);
