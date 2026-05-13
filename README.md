# Miraj Gajera Portfolio

Personal portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- Portfolio home, about, logs, and project pages
- Admin login for managing project records
- Project CRUD API routes
- Local JSON-backed project storage in `data/projects.json`
- Uploaded project images stored in `public/uploads/projects`

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set secure values in `.env.local`, then run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Required Environment Variables

`ADMIN_PASSWORD` is the password used to access admin project management routes.

`ADMIN_SESSION_SECRET` is used to sign the admin session cookie. Use a long random value in production.

Never commit `.env.local` or real credential values.

## Admin Routes

- `/admin/login`
- `/admin/projects`

Admin routes are preserved and require the environment variables above for production use.
