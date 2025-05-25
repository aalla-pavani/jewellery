const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hardcoded fallback credentials (for development ONLY)
const FALLBACK_CLIENT_ID = '';
const FALLBACK_CLIENT_SECRET = '';

// Enhanced environment variable validation
const validateOAuthConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID || FALLBACK_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || FALLBACK_CLIENT_SECRET;
  
  console.log('🕵️ OAuth Configuration:');
  console.log('  Client ID:', clientId.substring(0, 10) + '...');
  console.log('  Client Secret:', clientSecret ? '***MASKED***' : 'UNSET');

  return { clientId, clientSecret };
};

// Call validation and get configuration
const { clientId, clientSecret } = validateOAuthConfig();

passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: 'http://localhost:4000/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔐 Google OAuth Profile:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });

        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user if doesn't exist
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
          console.log('✨ New user created:', user.email);
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email }, 
          process.env.JWT_SECRET || 'fallback_secret', 
          { expiresIn: '1h' }
        );

        return done(null, { user, token });
      } catch (error) {
        console.error('🚨 Google OAuth Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
