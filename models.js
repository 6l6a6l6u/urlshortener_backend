const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
  isActive: { type: Boolean, default: false },
  activationToken: String,
});

const urlSchema = new mongoose.Schema({
  shortUrl: String,
  originalUrl: String,
  clickCount: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
const URL = mongoose.model('URL', urlSchema);

module.exports = { User, URL };
