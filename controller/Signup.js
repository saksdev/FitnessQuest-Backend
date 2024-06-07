const User = require('../models/User');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: { status: 400, message: "Passwords do not match" } });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: { status: 400, message: "Email already exists" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: { status: 201, message: "Account created successfully" } });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: { status: 500, message: "An error occurred. Please try again later." } });
  }
};

module.exports = { signup };
