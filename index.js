require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/dbconnection');
const { authenticateToken, getUserDashboardData } = require('./Route/UserDashboard');
const { isAuthenticated } = require('./middlewares/auth');
const { handleError } = require('./utils/errorhandler');
const corsMiddleware = require('./config/corsConfig');

const signupController = require('./controller/SignupController');
const loginController = require('./controller/LoginController');
const contactController = require('./controller/contactController');
const profileRoutes = require('./Route/profileRoutes');
const { logoutHandler } = require('./Route/Logout');

const app = express();
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

// Signup route
app.post('/signup', signupController.signup);

// Login route
app.post('/login', loginController.login);

// Auth check route
app.get('/auth', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Protected dashboard route
app.get('/dashboard', authenticateToken, getUserDashboardData);

// Contact route
app.post('/api/contact', contactController.sendContactForm);

// Logout route
app.post('/logout', isAuthenticated, logoutHandler);

// MyProfile routes - ensure these use the isAuthenticated middleware
app.use('/api/profile', isAuthenticated, (req, res, next) => {
    console.log('Profile route accessed. User ID:', req.userId);
    next();
}, profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});