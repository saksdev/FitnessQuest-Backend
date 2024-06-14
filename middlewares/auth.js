const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/errorhandler');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        if (!token) {
            return next(new ErrorHandler('Not authenticated', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next(new ErrorHandler('Not authenticated', 401));
    }
};

module.exports = { isAuthenticated };
