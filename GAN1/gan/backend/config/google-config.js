const { OAuth2Client } = require('google-auth-library');

// Comprehensive Google OAuth configuration validation
const validateGoogleOAuthConfig = () => {
  const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing Google OAuth Configuration:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName} is not set`);
    });
    
    // Detailed environment variable logging
    console.log('🔍 Current Environment Variables:');
    requiredVars.forEach(varName => {
      console.log(`   ${varName}: ${process.env[varName] ? 'SET' : 'UNSET'}`);
    });

    throw new Error(`Missing required Google OAuth configuration: ${missingVars.join(', ')}`);
  }

  console.log('✅ Google OAuth Configuration validated');
};

// Perform validation
validateGoogleOAuthConfig();

// Create OAuth2 client with comprehensive error handling
const createOAuth2Client = () => {
  try {
    // Explicitly log the client ID (masked for security)
    console.log('🔐 Initializing OAuth2Client');
    console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...`);

    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    });

    // Additional verification
    if (!client) {
      throw new Error('Failed to create OAuth2Client');
    }

    console.log('🔐 OAuth2Client initialized successfully');
    return client;
  } catch (error) {
    console.error('❌ Error creating OAuth2Client:', error);
    
    // Log additional diagnostic information
    console.error('Diagnostic Information:');
    console.error('   - Client ID length:', process.env.GOOGLE_CLIENT_ID?.length);
    console.error('   - Client Secret length:', process.env.GOOGLE_CLIENT_SECRET?.length);
    
    throw error;
  }
};

// Export the created client
module.exports = createOAuth2Client();
