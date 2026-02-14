import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// 1. Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadImage = async (localFilePath: string, folderName: string) => {
    try {
        if (!localFilePath) return null;

        // 2. Upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: folderName,
        });

        // 3. SUCCESS: Remove the local file from your server
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return {
            url: response.secure_url,
            public_id: response.public_id,
        };
    } catch (error) {
        // 4. FAILURE: Still remove the local file so it doesn't waste space
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 */
export const deleteImage = async (publicId: string) => {
    try {
        if (!publicId) return null;

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        return null;
    }
};