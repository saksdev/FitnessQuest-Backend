const Profile = require('../models/User');
const { ErrorHandler } = require('../utils/errorhandler');

const profileController = {
  // Get profile
  getProfile: async (req, res, next) => {
    try {
      console.log('getProfile called. User ID:', req.userId);

      if (!req.userId) {
        console.log('User ID is missing in the request');
        return next(new ErrorHandler('User not authenticated', 401));
      }

      const profile = await Profile.findById(req.userId);
      console.log('Profile found:', profile);

      if (!profile) {
        console.log('Profile not found for User ID:', req.userId);
        return next(new ErrorHandler('Profile not found', 404));
      }

      res.json(profile);
    } catch (error) {
      console.error('Error in getProfile:', error);
      next(new ErrorHandler('Server error', 500));
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;

      const profile = await Profile.findById(req.userId);

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      if (name) profile.name = name;
      if (email) profile.email = email;

      profile.updatedAt = Date.now();

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update XP
  updateXP: async (req, res) => {
    try {
      const { xp } = req.body;
      const profile = await Profile.findById(req.userId);

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      profile.XP += xp;
      profile.updatedAt = Date.now();

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error('Error in updateXP:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update Points
  updatePoints: async (req, res) => {
    try {
      const { points } = req.body;
      const profile = await Profile.findById(req.userId);

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      profile.Points += points;
      profile.updatedAt = Date.now();

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error('Error in updatePoints:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Upload Profile Picture
  uploadProfilePicture: async (req, res) => {
    try {
      console.log('uploadProfilePicture called');
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      console.log('Request file:', req.file);
  
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
  
      const profile = await Profile.findById(req.userId);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
  
      profile.profilePicture = req.file.path;
      profile.updatedAt = Date.now();
  
      await profile.save();
      res.json({ success: true, message: 'Profile picture updated successfully', profilePicture: profile.profilePicture });
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
  }

};

module.exports = profileController;