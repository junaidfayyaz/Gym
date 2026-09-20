import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary SDK with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads an image Buffer to Cloudinary using upload_stream.
 * Automatically resizes, crops to face, and converts to modern WebP format.
 * 
 * @param {Buffer} buffer - Image file buffer from multipart/form-data upload
 * @param {string} folder - Target Cloudinary folder name
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadToCloudinary(buffer, folder = 'gym_members') {
  // If Cloudinary keys are not configured, fallback gracefully
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary environment variables not set. Using compressed base64 fallback.');
    const base64Data = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return { secure_url: base64Data, public_id: '' };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'webp' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
