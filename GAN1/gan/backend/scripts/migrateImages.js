const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ImageHistory = require('../models/imageHistory');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/sketch2real';

// Function to read file and convert to base64
const fileToBase64 = (filePath) => {
    try {
        const fullPath = path.join(__dirname, '..', filePath.replace('/api/images/', ''));
        if (!fs.existsSync(fullPath)) {
            console.error(`File not found: ${fullPath}`);
            return null;
        }
        const file = fs.readFileSync(fullPath);
        const extension = path.extname(filePath).toLowerCase();
        const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';
        return `data:${mimeType};base64,${file.toString('base64')}`;
    } catch (error) {
        console.error(`Error converting file to base64: ${filePath}`, error);
        return null;
    }
};

async function migrateImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all image records
        const images = await ImageHistory.find({});
        console.log(`Found ${images.length} images to migrate`);

        let successCount = 0;
        let failCount = 0;

        // Process each image
        for (const image of images) {
            try {
                // Check if the image paths are already base64
                if (image.sketchImage.startsWith('data:')) {
                    console.log(`Image ${image._id} is already in base64 format`);
                    continue;
                }

                // Convert file paths to base64
                const sketchBase64 = fileToBase64(image.sketchImage);
                const generatedBase64 = fileToBase64(image.generatedImage);

                if (!sketchBase64 || !generatedBase64) {
                    console.error(`Failed to convert images for record ${image._id}`);
                    failCount++;
                    continue;
                }

                // Update the record
                await ImageHistory.findByIdAndUpdate(image._id, {
                    sketchImage: sketchBase64,
                    generatedImage: generatedBase64
                });

                successCount++;
                console.log(`Successfully migrated image ${image._id}`);
            } catch (error) {
                console.error(`Error processing image ${image._id}:`, error);
                failCount++;
            }
        }

        console.log('\nMigration Summary:');
        console.log(`Total images: ${images.length}`);
        console.log(`Successfully migrated: ${successCount}`);
        console.log(`Failed: ${failCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('Closed MongoDB connection');
    }
}

// Run the migration
migrateImages().then(() => {
    console.log('Migration script completed');
    process.exit(0);
}).catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
});
