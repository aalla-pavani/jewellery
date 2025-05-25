const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator'); // Import express-validator
const router = express.Router();
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'), // Ensure name is not empty
    body('email').isEmail().withMessage('Email is required and must be valid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      user = new User({ name, email, password: hashedPassword });
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (error) {
      console.error('Signup Error:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email is required and must be valid'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Login Error:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Google OAuth Routes with Enhanced Logging and Error Handling
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Force account selection
  })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔍 Google OAuth Callback Received');
    console.log('Request Query:', req.query);
    next();
  },
  passport.authenticate('google', { 
    session: false,
    failureRedirect: 'http://localhost:5173/login',
    failureMessage: true 
  }),
  (req, res) => {
    try {
      if (!req.user) {
        console.error('❌ No user object in Google OAuth callback');
        return res.redirect('http://localhost:5173/login?error=authentication_failed');
      }

      console.log('✅ Google OAuth Authentication Successful');
      console.log('User:', {
        id: req.user.user._id,
        email: req.user.user.email
      });

      // Redirect with token
      res.redirect(`http://localhost:5173/login?token=${req.user.token}`);
    } catch (error) {
      console.error('❌ Google OAuth Callback Error:', error);
      res.redirect('http://localhost:5173/login?error=server_error');
    }
  }
);

router.post('/google-login', async (req, res) => {
  try {
    const { googleToken } = req.body;
    console.log('🔍 Received Google Token Verification Request');

    if (!googleToken) {
      console.error('❌ No token provided');
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('✅ Google Token Verified');
    console.log('User Details:', {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub
    });

    // Check if user exists, if not create a new user
    let user = await User.findOne({ 
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });
    
    if (!user) {
      console.log('🆕 Creating new user from Google OAuth');
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profilePhoto: {
          data: payload.picture,
          contentType: 'url'
        }
      });
      await user.save();
    } else if (!user.googleId) {
      // If existing user without googleId, update the record
      user.googleId = payload.sub;
      user.profilePhoto = {
        data: payload.picture,
        contentType: 'url'
      };
      await user.save();
    }

    // Generate JWT token with more comprehensive payload
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ 
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePhoto?.data
      }
    });

  } catch (error) {
    console.error('❌ Google Token Verification Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed', 
      details: error.message 
    });
  }
});

router.post('/google/token', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        console.log('Google Token Payload:', { email, name, googleId });

        // Check if user exists or create new user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: name,
                email: email,
                googleId: googleId
            });
            await user.save();
            console.log('New user created via Google OAuth:', user);
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });

    } catch (error) {
        console.error('Google Token Verification Error:', error);
        res.status(403).json({ 
            message: 'Invalid Google token', 
            error: error.message 
        });
    }
});

module.exports = router;