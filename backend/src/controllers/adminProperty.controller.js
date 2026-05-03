import { prisma } from "../lib/prisma.js";
import { normalizePropertyInput, validateProperty } from "../utils/validation.js";

export async function createProperty(req, res) {
  const data = normalizePropertyInput(req.body);
  validateProperty(data);
  const property = await prisma.property.create({ data });
  res.status(201).json({ property });
}

export async function updateProperty(req, res) {
  const data = normalizePropertyInput(req.body);
  validateProperty(data);
  const property = await prisma.property.update({ where: { id: req.params.id }, data });
  res.json({ property });
}

export async function deleteProperty(req, res) {
  await prisma.property.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
}

export async function changeStatus(req, res) {
  const status = req.body.status;
  if (!["active", "hidden", "draft"].includes(status)) {
    return res.status(400).json({ message: "Статус қате / Неверный статус" });
  }
  const property = await prisma.property.update({ where: { id: req.params.id }, data: { status } });
  res.json({ property });
}
