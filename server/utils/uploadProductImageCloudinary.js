import { v2 as cloudinary } from 'cloudinary';

const uploadProductImageCloudinary = async (image) => {
    try {
        // Validate input
        if (!image) {
            throw new Error('No image provided for upload.');
        }
        if (!image.buffer) {
            throw new Error('Invalid image format. Expected a Buffer.');
        }
        if (image.size >  1024 * 1024) { // 1MB
            throw new Error('Image size exceeds the limit of 1MB.');
        }
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(image.mimetype)) {
            throw new Error('Invalid image format. Expected JPEG, PNG, JPG, or WEBP.');
        }
        
        if (!image.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            throw new Error('Invalid file name. Expected a valid image file format.');
        }


        // Cloudinary Configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Missing Cloudinary configuration environment variables.');
        }
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

           // Upload image using Buffer
           return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'productImages',
                    width: 500,
                    height: 500,
                    crop: 'limit',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );

            uploadStream.end(image?.buffer);
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }

};

export default uploadProductImageCloudinary; 