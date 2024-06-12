require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/dbconnection');
const signupController = require('./controller/Signup');
const loginController = require('./controller/login');

// Import the authenticateToken middleware and getUserDashboardData function
const { authenticateToken, getUserDashboardData } = require('./api/UserDashboard');

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

// Fetch user data for the dashboard
app.get('/api/userdashboard', authenticateToken, getUserDashboardData);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});