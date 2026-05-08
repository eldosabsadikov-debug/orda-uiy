import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

let supabaseClient = null;

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        realtime: {
          transport: ws
        }
      }
    );
  }

  return supabaseClient;
}

function safeExtension(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "image/gif") return ".gif";

  return ".jpg";
}

function getStoragePathFromUrl(url) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "property-images";
  const marker = `/storage/v1/object/public/${bucket}/`;

  if (!url || !url.includes(marker)) return null;

  const rawPath = url.split(marker)[1]?.split("?")[0];

  if (!rawPath) return null;

  return decodeURIComponent(rawPath);
}

function getLocalUploadPath(url) {
  if (!url || !url.includes("/uploads/")) return null;

  try {
    const parsedUrl = new URL(url);
    const relativePath = decodeURIComponent(parsedUrl.pathname.split("/uploads/")[1] || "");

    if (!relativePath) return null;

    const fullPath = path.normalize(path.join(uploadDir, relativePath));

    if (!fullPath.startsWith(uploadDir)) return null;

    return fullPath;
  } catch {
    return null;
  }
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

export async function deleteStoredImages(urls = []) {
  const cleanUrls = Array.isArray(urls) ? urls.filter(Boolean) : [];

  if (!cleanUrls.length) return;

  const localPaths = cleanUrls
    .map(getLocalUploadPath)
    .filter(Boolean);

  for (const localPath of localPaths) {
    try {
      if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
      }
    } catch (error) {
      console.error("Local image delete error:", error.message);
    }
  }

  if (!supabaseConfigured()) return;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "property-images";
  const storagePaths = cleanUrls
    .map(getStoragePathFromUrl)
    .filter(Boolean);

  if (!storagePaths.length) return;

  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove(storagePaths);

  if (error) {
    throw new Error(`Supabase delete error: ${error.message}`);
  }
}

export async function uploadImages(req, res, next) {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        message: "Сурет таңдаңыз / Выберите фото"
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

export async function deleteImages(req, res, next) {
  try {
    const urls = Array.isArray(req.body?.urls) ? req.body.urls : [];

    if (!urls.length) {
      return res.status(400).json({
        message: "Сурет сілтемесі жоқ / Нет ссылки на фото"
      });
    }

    await deleteStoredImages(urls);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}