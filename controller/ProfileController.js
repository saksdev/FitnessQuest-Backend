const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorhandler');

const profileController = {
  getProfile: async (req, res, next) => {
    try {
      console.log('getProfile called. User ID:', req.userId);

      if (!req.userId) {
        console.log('User ID is missing in the request');
        return next(new ErrorHandler('User not authenticated', 401));
      }

      const profile = await User.findById(req.userId);
      console.log('Profile found:', profile);

      if (!profile) {
        console.log('Profile not found for User ID:', req.userId);
        return next(new ErrorHandler('Profile not found', 404));
      }

      const profileData = {
        name: profile.name,
        email: profile.email,
        username: profile.username,
        XP: profile.XP,
        Points: profile.Points,
        level: profile.level,
        bio: profile.Bio,
        description: profile.description,
        profilePicture: profile.profilePicture,
        createdAt: profile.createdAt,
        twitterUrl: profile.twitterUrl
      };

      res.json(profileData);
    } catch (error) {
      console.error('Error in getProfile:', error);
      next(new ErrorHandler('Server error', 500));
    }
  },

  updateXP: async (req, res, next) => {
    try {
      const { xp } = req.body;
      const profile = await User.findById(req.userId);

      if (!profile) {
        return next(new ErrorHandler('Profile not found', 404));
      }

      profile.XP += xp;
      profile.updatedAt = Date.now();

      // Check if level up is needed
      if (profile.XP >= profile.level * 100) {  // Simple level up condition
        profile.level += 1;
        profile.description = `Level ${profile.level} User`;  // Update description based on level
      }

      await profile.save();
      res.json({ XP: profile.XP, level: profile.level, description: profile.description });
    } catch (error) {
      console.error('Error in updateXP:', error);
      next(new ErrorHandler('Server error', 500));
    }
  },

  updatePoints: async (req, res, next) => {
    try {
      const { points } = req.body;
      const profile = await User.findById(req.userId);

      if (!profile) {
        return next(new ErrorHandler('Profile not found', 404));
      }

      profile.Points += points;
      profile.updatedAt = Date.now();

      await profile.save();
      res.json({ Points: profile.Points });
    } catch (error) {
      console.error('Error in updatePoints:', error);
      next(new ErrorHandler('Server error', 500));
    }
  }
};

module.exports = profileController;