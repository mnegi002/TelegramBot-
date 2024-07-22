const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  telegramId: String,
  blocked: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
