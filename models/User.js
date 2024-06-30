const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  XP: {
    type: Number,
    default: 0,
  },
  Points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
    default: 'Beginner',
  },
  twitterUrl: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  fitbitAccessToken: String,
  fitbitRefreshToken: String,
  fitbitUserId: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;