const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Update profile photo
router.post('/profile/photo', auth, async (req, res) => {
    try {
        const { photoData, contentType } = req.body;

        if (!photoData || !contentType) {
            return res.status(400).json({ error: 'Photo data and content type are required' });
        }

        // Validate base64 string
        if (!photoData.match(/^data:image\/(jpeg|png|gif);base64,/)) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        const user = await User.findById(req.user.id);
        user.profilePhoto = {
            data: photoData,
            contentType: contentType
        };
        await user.save();

        res.json({ profilePhoto: user.profilePhoto });
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ error: 'Error uploading profile photo' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;

        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

module.exports = router;
