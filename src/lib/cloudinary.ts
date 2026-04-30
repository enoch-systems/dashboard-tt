import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'deafv5ovi',
  api_key: process.env.CLOUDINARY_API_KEY || '154519651234136',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LWpWFH8T3YzO7uuiWWiQSjI_cmY',
  secure: true,
});

// Function to get optimized image URL
export function getOptimizedImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
  quality?: number;
}) {
  const defaultOptions = {
    width: 600,
    height: 300,
    crop: 'fill',
    format: 'auto',
    quality: 80,
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
}

// Banner image constants
export const BANNER_IMAGE_ID = 'tech-trailblazer-banner';
export const BOOTCAMP_BANNER_IMAGE_ID = 'tech-trailblazer-bootcamp-banner';

// Pre-configured banner URLs
export function getBannerImageUrl() {
  return getOptimizedImageUrl(BANNER_IMAGE_ID, {
    width: 600,
    height: 300,
    crop: 'fill',
    quality: 85,
    format: 'webp'
  });
}

export function getBootcampBannerImageUrl() {
  return getOptimizedImageUrl(BOOTCAMP_BANNER_IMAGE_ID, {
    width: 600,
    height: 300,
    crop: 'fill',
    quality: 85,
    format: 'webp'
  });
}

// Upload image to Cloudinary
export async function uploadImageToCloudinary(file: File, folder: string = 'payment-receipts') {
  try {
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'image',
      format: 'webp',
      quality: 'auto:good',
      fetch_format: 'auto'
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      originalFilename: file.name
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}
