const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('🔍 Incoming Request Path:', req.path);
  console.log('🔑 Received Token:', token ? 'Present' : 'Not Found');

  // If there's no token, return unauthorized error
  if (!token) {
    console.warn('⚠️ No token provided for path:', req.path);
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token Decoded Successfully:', {
      userId: decoded.id,
      email: decoded.email,
      name: decoded.name
    });

    // Find the user based on the decoded token's id
    const user = await User.findById(decoded.id);
    
    // If user not found, return error
    if (!user) {
      console.warn('❌ User not found for ID:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user to the request object for use in routes
    req.user = user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging
    console.error('🚨 Authentication Error:', {
      name: error.name,
      message: error.message,
      path: req.path
    });
    
    // Return error response for invalid token
    res.status(401).json({ 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;