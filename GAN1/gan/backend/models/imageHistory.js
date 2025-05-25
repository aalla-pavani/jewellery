const mongoose = require('mongoose');

const imageHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sketchImage: {
        type: String,  // Will store complete data URL with base64 data
        required: true
    },
    generatedImage: {
        type: String,  // Will store complete data URL with base64 data
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if the model exists before compiling it
module.exports = mongoose.models.ImageHistory || mongoose.model('ImageHistory', imageHistorySchema);
