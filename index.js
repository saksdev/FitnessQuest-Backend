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
const settingsRoutes = require('./Route/settingsRoutes');
const uploadRoutes = require('./Route/uploadRoutes');
const { logoutHandler } = require('./Route/Logout');
const publicProfileRoutes = require('./Route/publicProfile');
const dashboardFitbit = require('./Route/dashboardfitbit.js');
const forgotPasswordController = require('./controller/ForgotPasswordController');

const app = express();
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

// Use the public profile routes
app.use('/api', publicProfileRoutes);

// Signup route
app.post('/signup', signupController.signup);

// Login route
app.post('/login', loginController.login);

// Logout route
app.post('/logout', isAuthenticated, logoutHandler);

// Contact route
app.post('/api/contact', contactController.sendContactForm);

// Forgot Password routes
app.post('/forgot-password', forgotPasswordController.forgotPassword);
app.post('/reset-password', forgotPasswordController.resetPassword);

// Auth check route
app.get('/auth', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Profile routes - for viewing profile and updating game-related data
app.use('/api/profile', isAuthenticated, (req, res, next) => {
    console.log('Profile route accessed. User ID:', req.userId);
    next();
}, profileRoutes);

// Settings routes - for updating profile information
app.use('/api/settings', isAuthenticated, settingsRoutes);

// Upload routes
app.use('/api/profile', isAuthenticated, uploadRoutes);

// Protected dashboard route
app.get('/dashboard', authenticateToken, getUserDashboardData);

// Use dashboard routes
app.use('/api/dashboard', dashboardFitbit);

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
