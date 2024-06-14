// api/UserDashboard.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// API endpoint to fetch user data
const getUserDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data, excluding sensitive fields if needed
    const userData = {
      name: user.name,
      // email: user.email,
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { authenticateToken, getUserDashboardData };