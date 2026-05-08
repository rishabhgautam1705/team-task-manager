# TeamTask

Production-ready full-stack SaaS task manager with role-based dashboards for admins and members.

## Stack

- Frontend: React + Vite + Tailwind + Zustand + React Router + React Hook Form + Zod + Recharts + FullCalendar
- Backend: Node.js + Express + MongoDB + JWT + bcryptjs + Multer + Cloudinary

## Local setup

1. Install dependencies:
   - `npm install`
2. Create env files from examples:
   - `client/.env.example`
   - `server/.env.example`
3. Start both apps:
   - `npm run dev`

If you are using the bundled local Node.js included in this workspace, run:

- `./run-teamtask.sh`

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas
