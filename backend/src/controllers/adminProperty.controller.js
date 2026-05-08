import { prisma } from "../lib/prisma.js";
import { normalizePropertyInput, validateProperty } from "../utils/validation.js";
import { deleteStoredImages } from "./upload.controller.js";

function getRemovedImages(oldImages = [], newImages = []) {
  return oldImages.filter((url) => !newImages.includes(url));
}

export async function createProperty(req, res) {
  const data = normalizePropertyInput(req.body);
  validateProperty(data);

  const property = await prisma.property.create({ data });

  res.status(201).json({ property });
}

export async function updateProperty(req, res) {
  const existing = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!existing) {
    return res.status(404).json({
      message: "Нысан табылмады / Объект не найден"
    });
  }

  const data = normalizePropertyInput(req.body);
  validateProperty(data);

  const removedImages = getRemovedImages(existing.images || [], data.images || []);

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data
  });

  if (removedImages.length) {
    deleteStoredImages(removedImages).catch((error) => {
      console.error("Removed image cleanup error:", error.message);
    });
  }

  res.json({ property });
}

export async function deleteProperty(req, res) {
  const existing = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!existing) {
    return res.status(404).json({
      message: "Нысан табылмады / Объект не найден"
    });
  }

  await prisma.property.delete({
    where: { id: req.params.id }
  });

  if (existing.images?.length) {
    deleteStoredImages(existing.images).catch((error) => {
      console.error("Property image cleanup error:", error.message);
    });
  }

  res.json({ ok: true });
}

export async function changeStatus(req, res) {
  const status = req.body.status;

  if (!["active", "hidden", "draft"].includes(status)) {
    return res.status(400).json({
      message: "Статус қате / Неверный статус"
    });
  }

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json({ property });
}