const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user ID to request
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
