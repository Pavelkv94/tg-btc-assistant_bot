const { Schema, model } = require('mongoose');

const Currency = new Schema({
  currency: { type: String },
  price: { type: Number },
  holdings: { type: Number },
  //   userAvatar: { type: String },
  //   created_at: { type: String },
  //   text: { type: String },
  //   likes: { type: Array },
  //   comments: { type: Array, ref: 'Comment' },
});

module.exports = model('Currency', Currency);
