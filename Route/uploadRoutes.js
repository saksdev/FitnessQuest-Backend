const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/profile/upload-picture - Upload profile picture
router.post('/upload-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Upload to Cloudinary failed', error });
        }

        // Update user's profile picture in database
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.profilePicture = result.secure_url;
        await user.save();

        res.json({ success: true, message: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
