import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
