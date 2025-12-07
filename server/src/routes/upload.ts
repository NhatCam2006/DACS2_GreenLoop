import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { uploadToCloudinary, uploadFromUrl } from "../lib/cloudinary";

const router = Router();

// Local storage (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Memory storage for Cloudinary
const memoryStorage = multer.memoryStorage();

// Use Cloudinary if configured, otherwise use local storage
const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const upload = multer({
  storage: useCloudinary ? memoryStorage : localStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Upload to Cloudinary or local storage
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    let imageUrl: string;

    // Get folder from query param, default to "donations"
    const folder = (req.query.folder as string) || "donations";

    if (useCloudinary && req.file.buffer) {
      // Upload to Cloudinary
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        `greenloop/${folder}`
      );
    } else {
      // Local storage fallback
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Upload image from URL to Cloudinary
router.post("/from-url", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

    if (!useCloudinary) {
      // If Cloudinary not configured, just return the original URL
      res.json({ imageUrl: url });
      return;
    }

    const imageUrl = await uploadFromUrl(url, "greenloop/rewards");
    res.json({ imageUrl });
  } catch (error) {
    console.error("Upload from URL error:", error);
    res.status(500).json({ error: "Failed to upload image from URL" });
  }
});

export const uploadRouter = router;
