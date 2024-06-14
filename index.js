require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/dbconnection');
const { isAuthenticated } = require('./middlewares/auth');
const { handleError } = require('./utils/errorhandler');
const corsMiddleware = require('./config/corsConfig');

const signupController = require('./controller/Signup');
const loginController = require('./controller/Login');

const app = express();

// Use CORS middleware
app.use(corsMiddleware);

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Fitness Quest');
});

app.post('/signup', async (req, res) => {
    await signupController.signup(req, res);
});

app.post('/login', async (req, res) => {
    await loginController.login(req, res);
});

// Auth check route
app.get('/auth', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Protected route
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome to the dashboard, User ID: ${req.userId}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
