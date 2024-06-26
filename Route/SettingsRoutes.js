const express = require('express');
const router = express.Router();
const settingsController = require('../controller/SettingController');
const { isAuthenticated } = require('../middlewares/auth');

// Update user profile
router.put('/', isAuthenticated, settingsController.updateProfile);

module.exports = router;