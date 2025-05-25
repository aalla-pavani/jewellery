const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ImageHistory = require('../models/imageHistory');
const path = require('path');
const fs = require('fs');

// Get user's image history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await ImageHistory.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete image history entry
router.delete('/history/:id', auth, async (req, res) => {
    try {
        const history = await ImageHistory.findById(req.params.id);
        if (!history) {
            return res.status(404).json({ msg: 'History entry not found' });
        }
        
        // Make sure user owns the history entry
        if (history.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await history.remove();
        res.json({ msg: 'History entry removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
