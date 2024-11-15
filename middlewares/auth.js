const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/errorhandler');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            console.log('No token found'); // Debug log
            return next(new ErrorHandler('Not authenticated', 401));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debug log
            req.userId = decoded.userId;
            next();
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError); // Debug log
            return next(new ErrorHandler('Invalid token', 401));
        }
    } catch (error) {
        console.error('Authentication error:', error); // Debug log
        next(new ErrorHandler('Authentication failed', 401));
    }
};

module.exports = { isAuthenticated };
