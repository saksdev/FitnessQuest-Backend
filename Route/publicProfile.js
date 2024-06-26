const express = require('express');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorhandler');

const router = express.Router();

router.get('/public-profile/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    console.log('Received request for public profile. Username:', username);

    if (!username) {
      console.log('Username is missing in the request');
      return next(new ErrorHandler('Username is required', 400));
    }

    // Case-insensitive search for the username
    const user = await User.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } });

    console.log('Database query result:', user ? 'User found' : 'User not found');

    if (!user) {
      console.log('User not found for username:', username);
      return next(new ErrorHandler('Profile not found', 404));
    }

    const publicProfileData = {
      name: user.name,
      username: user.username,
      bio: user.Bio || '', // Using 'Bio' as per your User model
      profilePicture: user.profilePicture,
      XP: user.XP,
      level: user.level,
      description: user.description
    };

    console.log('Sending public profile data:', publicProfileData);
    res.json({
      success: true,
      statusCode: 200,
      data: publicProfileData
    });

  } catch (error) {
    console.error('Error in publicProfile:', error);
    next(new ErrorHandler('Server error', 500));
  }
});

module.exports = router;