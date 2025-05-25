const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { generateJewelryImage } = require('./model');  // Import your model logic for image generation
const passport = require('passport');
require('./config/passport');

// Manually load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log('🔍 Attempting to load .env from:', envPath);

// Manually read and set environment variables
try {
  if (fs.existsSync(envPath)) {
    const envContents = fs.readFileSync(envPath, 'utf8');
    const envLines = envContents.split('\n');
    
    envLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });

    console.log('✅ .env file loaded manually');
  } else {
    console.error('❌ .env file not found at:', envPath);
  }
} catch (error) {
  console.error('🚨 Error loading .env file:', error);
}

// Validate environment variables
const requiredVars = ['PORT', 'DB_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
  } else {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***MASKED***' : process.env[varName]}`);
  }
});

// Fallback to dotenv if manual loading fails
if (requiredVars.some(varName => !process.env[varName])) {
  console.log('🔄 Attempting fallback dotenv loading');
  dotenv.config({ path: envPath });
}

const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/image');
const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');

const app = express();

// Enhanced error logging middleware
const errorLogger = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
    });
    next(err);
};

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // Include x-auth-token
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));  // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Passport
app.use(passport.initialize());

// Ensure the uploads directory exists with proper permissions
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    fs.chmodSync(uploadDirectory, '777');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDirectory));

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Store uploaded files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filenames
    }
});

// File upload validation: Only allow jpg, jpeg, png images, and limit file size
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // Max file size 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpg, jpeg, png) are allowed.'));
        }
    }
});

// Routes
app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/contact', contactRoutes);  // Contact routes
app.use('/api/images', imageRoutes);  // Image routes
app.use('/api/profile', profileRoutes);  // Profile routes
app.use('/api/user', userRoutes);  // User routes

// Static file serving for uploaded images - moved before error handlers
app.use('/api/images/uploads', express.static(uploadDirectory));

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        path: req.path
    });
});

// Handle invalid routes
app.use((req, res) => {
    console.log('404 Not Found:', req.originalUrl);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Server startup with comprehensive error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🌿 Connected to MongoDB successfully');

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server Startup Failed:', error);
    process.exit(1);
  }
};

startServer();