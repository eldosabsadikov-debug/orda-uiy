import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

async function uploadToCloudinary(file) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, { folder: "orda-uiy" });
  return result.secure_url;
}

function saveLocal(file, req) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const ext = path.extname(file.originalname) || ".jpg";
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const fullPath = path.join(uploadDir, name);
  fs.writeFileSync(fullPath, file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/${name}`;
}

export async function uploadImages(req, res) {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "Сурет таңдаңыз / Выберите фото" });

  const urls = [];
  for (const file of files) {
    if (cloudinaryConfigured()) urls.push(await uploadToCloudinary(file));
    else urls.push(saveLocal(file, req));
  }

  res.json({ urls });
}
