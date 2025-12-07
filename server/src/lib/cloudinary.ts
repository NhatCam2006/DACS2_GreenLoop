import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (only if credentials are provided)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "greenloop"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" }, // Limit max size
            { quality: "auto" }, // Auto optimize quality
            { fetch_format: "auto" }, // Auto select best format
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error("Upload failed"));
          }
        }
      )
      .end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

// Upload image from URL to Cloudinary
export const uploadFromUrl = async (
  imageUrl: string,
  folder: string = "greenloop"
): Promise<string> => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });
  return result.secure_url;
};

export { cloudinary };
