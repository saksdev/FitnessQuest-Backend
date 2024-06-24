const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const profileController = require('../controller/ProfileController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('Received file:', file);
    cb(null, true);
  }
}).single('profilePicture'); // Change back to .single()

// Upload profile picture
router.post('/upload-picture', (req, res, next) => {
  console.log('Raw request body:', req.body);
  upload(req, res, function (err) {
    console.log('Multer processed request body:', req.body);
    console.log('Multer processed file:', req.file);

    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ success: false, message: 'Multer error: ' + err.message });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ success: false, message: 'Unknown upload error: ' + err.message });
    }

    // If no file is uploaded, return an error
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    next();
  });
}, profileController.uploadProfilePicture);

// Get user profile
router.get('/', profileController.getProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Update XP
router.put('/xp', profileController.updateXP);

// Update Points
router.put('/points', profileController.updatePoints);

module.exports = router;