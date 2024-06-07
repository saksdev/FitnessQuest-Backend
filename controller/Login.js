const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 400, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { status: 200, message: "Login successful", token };
  } catch (err) {
    console.error('Error:', err);
    return { status: 500, message: "An error occurred. Please try again later." };
  }
};

module.exports = { login };
