const { Schema, model } = require('mongoose');

const User = new Schema({
  user_chat_id: { type: Number },
  first_name: { type: String },
  username: { type: String }
});

module.exports = model('User', User);
