const express = require('express');
const router = express.Router();
const profileController = require('../controller/ProfileController');

// Get user profile
router.get('/', profileController.getProfile);

// Update XP
router.put('/xp', profileController.updateXP);

// Update Points
router.put('/points', profileController.updatePoints);

module.exports = router;