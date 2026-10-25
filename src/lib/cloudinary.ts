/**
 * Cloudinary Media Storage Helper
 * Used for avatars, community challenge proof uploads, and temporary media.
 */

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'balance-studio-demo';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'balance_unsigned_preset';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  created_at: string;
  format: string;
}

/**
 * Uploads a File object to Cloudinary or returns local base64 preview on demo/fallback.
 */
export async function uploadToCloudinary(
  file: File,
  folder: 'avatars' | 'challenges' | 'general' = 'general'
): Promise<string> {
  const isDemo = !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'balance-studio-demo';

  if (!isDemo) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `balance_studio/${folder}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data: CloudinaryUploadResult = await res.json();
        return data.secure_url;
      }
    } catch (err) {
      console.warn('[Cloudinary Upload] Falling back to local data preview:', err);
    }
  }

  // Fallback demo upload handler: converts file to Data URL with small simulated delay
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        resolve(reader.result as string);
      }, 600);
    };
    reader.onerror = () => reject(new Error('Failed to read file for upload'));
    reader.readAsDataURL(file);
  });
}
