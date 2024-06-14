const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
