import { prisma } from "../lib/prisma.js";

function buildWhere(query, includeInactive = false) {
  const where = {};
  if (!includeInactive) where.status = "active";
  if (includeInactive && query.status) where.status = query.status;
  if (query.propertyType) where.propertyType = query.propertyType;
  if (query.dealType) where.dealType = query.dealType;
  if (query.city) where.city = { contains: query.city, mode: "insensitive" };
  if (query.district) where.district = { contains: query.district, mode: "insensitive" };
  if (query.rooms) {
    if (query.rooms === "4plus") where.rooms = { gte: 4 };
    else where.rooms = Number(query.rooms);
  }
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }
  if (query.search) {
    const search = String(query.search);
    where.OR = [
      { titleKk: { contains: search, mode: "insensitive" } },
      { titleRu: { contains: search, mode: "insensitive" } },
      { descriptionKk: { contains: search, mode: "insensitive" } },
      { descriptionRu: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } }
    ];
  }
  return where;
}

function orderBy(sort) {
  if (sort === "cheapest") return { price: "asc" };
  if (sort === "expensive") return { price: "desc" };
  return { createdAt: "desc" };
}

export async function getProperties(req, res) {
  const properties = await prisma.property.findMany({
    where: buildWhere(req.query, false),
    orderBy: orderBy(req.query.sort)
  });
  res.json({ properties });
}

export async function getProperty(req, res) {
  const property = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!property || (property.status !== "active" && !req.headers.authorization)) {
    return res.status(404).json({ message: "Нысан табылмады / Объект не найден" });
  }
  res.json({ property });
}

export async function getAdminProperties(req, res) {
  const properties = await prisma.property.findMany({
    where: buildWhere(req.query, true),
    orderBy: orderBy(req.query.sort)
  });
  res.json({ properties });
}
