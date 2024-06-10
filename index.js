require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/dbconnection');
const signupController = require('./controller/Signup');
const loginController = require('./controller/login');
const userController = require('./controller/userController');

// Import the authenticateToken function from the module
const { authenticateToken } = require('./models/authenticateToken');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World');
});

// Signup
app.post("/signup", async (req, res) => {
  await signupController.signup(req, res);
});

// Login
app.post("/login", async (req, res) => {
  let result = await loginController.login(req);
  return res.status(result.status).json({ message: result.message, token: result.token });
});

app.get('/api/user', authenticateToken, userController.getUserData);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});