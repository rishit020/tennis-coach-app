import Constants from 'expo-constants';

// Get Cloudinary configuration from environment variables or app config
// Note: We use direct API calls instead of the cloudinary SDK since it's Node.js-only
const cloudName = Constants.expoConfig?.extra?.cloudinaryCloudName || process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = Constants.expoConfig?.extra?.cloudinaryUploadPreset || process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

/**
 * Upload a video file to Cloudinary
 * @param videoUri - Local file URI or base64 string
 * @param onProgress - Optional progress callback
 * @returns Promise with upload result containing Cloudinary URL
 */
export async function uploadVideoToCloudinary(
  videoUri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }

  try {
    // For React Native, we need to upload using FormData
    const formData = new FormData();
    
    // Determine if it's a local file URI
    const isLocalUri = videoUri.startsWith('file://') || videoUri.startsWith('content://') || videoUri.startsWith('ph://');
    
    if (isLocalUri) {
      // For local files in React Native, FormData expects this format
      formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'tennis-video.mp4',
      } as any);
    } else if (videoUri.startsWith('data:')) {
      // For base64 data URIs
      formData.append('file', videoUri);
    } else {
      // For remote URLs, Cloudinary can fetch them
      formData.append('file', videoUri);
    }
    
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'video');
    formData.append('folder', 'tennis-coach-app/videos');

    // Upload to Cloudinary using direct API call
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.url,
              publicId: response.public_id,
              secureUrl: response.secure_url,
              format: response.format,
              width: response.width,
              height: response.height,
              duration: response.duration,
              bytes: response.bytes,
            });
          } catch (error) {
            reject(new Error('Failed to parse Cloudinary response'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error?.message || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });
  } catch (error) {
    throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(cloudName && uploadPreset);
}

