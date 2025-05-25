const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneNumber: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

ContactSchema.index({ user: 1, submittedAt: -1 }); // Create an index for efficient querying

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;