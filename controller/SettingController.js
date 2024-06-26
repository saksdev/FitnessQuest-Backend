const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorhandler');

const settingsController = {
  updateProfile: async (req, res, next) => {
    try {
      const { name, twitterUrl, bio, profilePicture } = req.body;

      console.log('Received data:', req.body); // Log received data

      const user = await User.findById(req.userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      if (name) user.name = name;
      if (twitterUrl !== undefined) user.twitterUrl = twitterUrl;
      if (bio !== undefined) user.bio = bio;
      if (profilePicture !== undefined) user.profilePicture = profilePicture;

      user.updatedAt = Date.now();

      await user.save();

      console.log('Updated user:', user); // Log updated user

      res.json({
        message: 'Profile updated successfully',
        user: {
          name: user.name,
          twitterUrl: user.twitterUrl,
          bio: user.bio, // Changed from Bio to bio
          profilePicture: user.profilePicture
        }
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      next(new ErrorHandler('Server error', 500));
    }
  },
};

module.exports = settingsController;