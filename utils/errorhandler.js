class ErrorHandler extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (err, res) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

module.exports = { ErrorHandler, handleError };
