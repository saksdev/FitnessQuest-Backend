const User = require('../models/User'); // Assuming you have a User model for your database
const jwt = require('jsonwebtoken');

// Function to fetch user data based on the provided token
const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    const userId = decodedToken.userId; // Assuming the token contains the user's ID

    const user = await User.findById(userId); // Find the user in the database by ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data, excluding sensitive fields if needed
    const userData = {
      name: user.name,
      email: user.email,
      // Add any other relevant fields
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserData };