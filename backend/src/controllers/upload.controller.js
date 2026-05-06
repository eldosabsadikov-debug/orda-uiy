import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

function safeExtension(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "image/gif") return ".gif";

  return ".jpg";
}

async function uploadToSupabase(file) {
  const supabase = getSupabaseClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "property-images";
  const ext = safeExtension(file);
  const storagePath = `properties/${Date.now()}-${crypto.randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "31536000",
      upsert: false
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

function saveLocal(file, req) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext = safeExtension(file);
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const fullPath = path.join(uploadDir, name);

  fs.writeFileSync(fullPath, file.buffer);

  return `${req.protocol}://${req.get("host")}/uploads/${name}`;
}

export async function uploadImages(req, res, next) {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        message: "Сурет таңдалмады / Изображение не выбрано"
      });
    }

    const urls = [];

    for (const file of files) {
      if (!file.mimetype?.startsWith("image/")) {
        return res.status(400).json({
          message: "Тек сурет файлдарын жүктеңіз / Загружайте только изображения"
        });
      }

      if (supabaseConfigured()) {
        urls.push(await uploadToSupabase(file));
      } else {
        urls.push(saveLocal(file, req));
      }
    }

    res.json({ urls });
  } catch (error) {
    next(error);
  }
}