// Utility functions for handling images and fallbacks

// API base URL for constructing full image URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://histro.replit.app';

// Backup images for different contexts
export const BACKUP_IMAGES = {
  // Professional doctor avatar
  doctor: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  
  // Generic user avatar
  user: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  
  // Female user avatar
  female: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  
  // Male user avatar
  male: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  
  // Patient avatar
  patient: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  
  // Default fallback
  default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
};

/**
 * Get a backup image URL based on the context
 * @param context - The context for the image (doctor, user, patient, etc.)
 * @returns The backup image URL
 */
export const getBackupImage = (context: keyof typeof BACKUP_IMAGES = 'default'): string => {
  return BACKUP_IMAGES[context];
};

/**
 * Get a safe image URL with fallback
 * @param imageUrl - The primary image URL
 * @param context - The context for the fallback image
 * @returns The safe image URL with fallback
 */
export const getSafeImageUrl = (imageUrl?: string | null, context: keyof typeof BACKUP_IMAGES = 'default'): string => {
  console.log('🖼️ getSafeImageUrl Debug:', {
    imageUrl,
    context,
    isBase64: imageUrl?.startsWith('data:image/'),
    imageUrlLength: imageUrl?.length,
    API_BASE_URL
  });

  if (!imageUrl || imageUrl.trim() === '') {
    console.log('❌ getSafeImageUrl: No image URL, using backup');
    const backupUrl = getBackupImage(context);
    console.log('🔄 getSafeImageUrl: Using backup URL:', backupUrl);
    return backupUrl;
  }
  
  // If it's a base64 image, return as is
  if (imageUrl.startsWith('data:image/')) {
    console.log('✅ getSafeImageUrl: Returning base64 image as is');
    console.log('📄 Base64 image length:', imageUrl.length);
    return imageUrl;
  }
  
  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || !imageUrl.startsWith('http')) {
    // Remove leading slash if present
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    const fullUrl = `${API_BASE_URL}/${cleanPath}`;
    console.log('🔗 getSafeImageUrl: Constructed full URL:', fullUrl);
    console.log('📝 Original path:', imageUrl);
    console.log('🧹 Cleaned path:', cleanPath);
    console.log('🌐 API Base URL:', API_BASE_URL);
    return fullUrl;
  }
  
  // If it's a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('✅ getSafeImageUrl: Returning full URL as is');
    console.log('🌐 Full URL:', imageUrl);
    return imageUrl;
  }
  
  // Default fallback
  console.log('❌ getSafeImageUrl: Using default fallback');
  const fallbackUrl = getBackupImage(context);
  console.log('🔄 Fallback URL:', fallbackUrl);
  return fallbackUrl;
};

/**
 * Handle image error by setting a fallback image
 * @param event - The error event from the img element
 * @param context - The context for the fallback image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, context: keyof typeof BACKUP_IMAGES = 'default') => {
  const img = event.currentTarget;
  img.src = getBackupImage(context);
  img.onerror = null; // Prevent infinite loop
}; 