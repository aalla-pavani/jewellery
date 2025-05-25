const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }  // Only required if not a Google user
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // Allows multiple null values
  },
  profilePhoto: {
    data: String, // base64 string
    contentType: String
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
}, {
  timestamps: true
});

// Modify pre-save hook to handle Google OAuth users
UserSchema.pre('save', async function (next) {
  // Only hash password if it's modified and not a Google user
  if (!this.isModified('password') || this.googleId) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);  // Pass the error to the next middleware
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  // Skip password comparison for Google users
  if (this.googleId) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;