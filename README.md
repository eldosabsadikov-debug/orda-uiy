# Orda Uiy full project

Бұл жоба Orda Uiy жылжымайтын мүлік агенттігіне арналған толық платформа.
Проект включает публичный сайт, страницу квартир, страницу деталей, админ-вход и панель управления.

## Құрылым / Структура

```text
orda-uiy-platform/
├── frontend/   React + Vite
└── backend/    Node.js + Express + Prisma + PostgreSQL
```

## Жергілікті іске қосу / Локальный запуск

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend default:

```text
http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default:

```text
http://localhost:5173
```

## Admin кіру / Вход администратора

`.env` ішінде өзгертуге болады:

```text
ADMIN_EMAIL=admin@orda-uiy.kz
ADMIN_PASSWORD=orda-uiy-admin
```

## Deploy ұсынысы / Рекомендация для хостинга

- Frontend: Netlify немесе Vercel
- Backend: Render немесе Railway
- Database: Supabase PostgreSQL
- Images: Cloudinary

## Соңғы өзгерістер / Последние изменения

- Мобильді мәзірге админ кіру сілтемесі қосылды.
- Мобильді мәзір және Admin dropdown сыртқа басқанда жабылады.
- Әдепкі қала: Қызылорда.
- Жаңа хабарландыру үшін әдепкі статус: Белсенді / Активный.
- Жаңа хабарландыру үшін әдепкі мәміле: Сату / Продажа.
- Контакты popup ішінде тек телефон қалды.
- Пәтер карточкасындағы контакт бөлімінде телефон және optional басқа байланыстар ғана көрсетіледі.
- Admin формада WhatsApp/Instagram орнына optional басқа байланыстар өрісі қосылды.
- Пәтер суреттеріне алдыңғы/келесі басқару батырмалары қосылды.

Егер база бұрын жасалған болса, backend ішінде жаңа миграция жасаңыз:

```bash
npx prisma migrate dev --name update_contacts_and_defaults
```
