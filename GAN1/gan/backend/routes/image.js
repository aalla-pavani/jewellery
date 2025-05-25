const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const User = require('../models/User');
const ImageHistory = require('../models/imageHistory');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Helper function to convert Buffer to base64 data URL
const bufferToDataUrl = (buffer, mimetype) => {
    if (!buffer) return null;
    const base64 = buffer.toString('base64');
    return `data:${mimetype};base64,${base64}`;
};

// Upload both sketch and generated images
router.post('/upload', auth, upload.fields([
    { name: 'sketch', maxCount: 1 },
    { name: 'generated', maxCount: 1 }
]), async (req, res) => {
    if (!req.files || !req.files.sketch || !req.files.generated) {
        return res.status(400).json({ error: 'Both sketch and generated images are required' });
    }

    try {
        const sketchFile = req.files.sketch[0];
        const generatedFile = req.files.generated[0];

        // Convert files to base64 data URLs
        const sketchBase64 = bufferToDataUrl(sketchFile.buffer, sketchFile.mimetype);
        const generatedBase64 = bufferToDataUrl(generatedFile.buffer, generatedFile.mimetype);

        if (!sketchBase64 || !generatedBase64) {
            throw new Error('Failed to convert images to base64');
        }

        // Create new image history document
        const imageHistory = new ImageHistory({
            userId: req.user.id,
            sketchImage: sketchBase64,
            generatedImage: generatedBase64
        });

        await imageHistory.save();

        // Update user's images array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { images: imageHistory._id } },
            { new: true }
        );

        res.json({
            message: 'Images saved successfully',
            imageId: imageHistory._id
        });

    } catch (error) {
        console.error('Error saving images:', error);
        res.status(500).json({ error: error.message || 'Error saving images' });
    }
});

// Get user's images
router.get('/history', auth, async (req, res) => {
    try {
        const history = await ImageHistory.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        // Verify that images are properly stored as base64
        const formattedHistory = history.map(item => {
            // Ensure both images are proper base64 data URLs
            const sketchImage = item.sketchImage.startsWith('data:') 
                ? item.sketchImage 
                : `data:image/jpeg;base64,${item.sketchImage}`;
            
            const generatedImage = item.generatedImage.startsWith('data:') 
                ? item.generatedImage 
                : `data:image/jpeg;base64,${item.generatedImage}`;

            return {
                _id: item._id,
                userId: item.userId,
                sketchImage,
                generatedImage,
                createdAt: item.createdAt
            };
        });

        res.json(formattedHistory);
    } catch (error) {
        console.error('Error fetching image history:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete image
router.delete('/:id', auth, async (req, res) => {
    try {
        const history = await ImageHistory.findById(req.params.id);
        if (!history) {
            return res.status(404).json({ msg: 'Image not found' });
        }

        // Check user owns the image
        if (history.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Remove from user's images array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { images: history._id } }
        );

        // Delete from database
        await history.deleteOne();

        res.json({ msg: 'Images deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;