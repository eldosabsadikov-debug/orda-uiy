import "dotenv/config";
import { prisma } from "./lib/prisma.js";

async function main() {
  await prisma.property.createMany({
    data: [
      {
        titleKk: "2-бөлмелі пәтер",
        titleRu: "2-комнатная квартира",
        descriptionKk: "Жарық, таза пәтер. Инфрақұрылымы жақсы аудан.",
        descriptionRu: "Светлая, чистая квартира в районе с хорошей инфраструктурой.",
        price: 25000000,
        city: "Қызылорда",
        district: "Сырдария",
        propertyType: "apartment",
        dealType: "sale",
        rooms: 2,
        area: 55,
        floor: 7,
        totalFloors: 12,
        phone: "8 700 502 20 01",
        otherContacts: "",
        status: "active",
        images: []
      },
      {
        titleKk: "3-бөлмелі пәтер",
        titleRu: "3-комнатная квартира",
        descriptionKk: "Отбасыға ыңғайлы кең пәтер.",
        descriptionRu: "Просторная квартира, удобная для семьи.",
        price: 36500000,
        city: "Қызылорда",
        district: "Орталық",
        propertyType: "apartment",
        dealType: "sale",
        rooms: 3,
        area: 78,
        floor: 5,
        totalFloors: 9,
        phone: "8 700 502 20 01",
        otherContacts: "",
        status: "active",
        images: []
      }
    ],
    skipDuplicates: true
  });
  console.log("Seed done");
}

main().finally(async () => prisma.$disconnect());
