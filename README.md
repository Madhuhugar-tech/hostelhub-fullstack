# HostelHub

A full-stack hostel management web application built to digitize day-to-day hostel operations for students and wardens. HostelHub provides role-based dashboards, complaint tracking, mess billing, and a private student community space in one centralized platform.

---

## Overview

HostelHub is designed to solve common hostel management problems such as manual complaint handling, lack of billing transparency, and poor communication between students and hostel administration. The system offers separate interfaces for students and wardens, with secure authentication and real-time data flow powered by a PostgreSQL database.

Students can raise complaints, track their status, view bills, and use a private community space. Wardens can monitor complaints, update issue statuses, manage unpaid bills, and view overall hostel analytics.

---

## Features

### Student Module
- Secure student login
- Personal dashboard with room and block details
- Raise hostel complaints
- View complaint history and live status updates
- View mess bill history
- Check unpaid bills
- Access private community rooms
- Create community posts
- Anonymous posting support

### Warden Module
- Secure warden login
- Warden dashboard with hostel analytics
- View all student complaints
- Update complaint status:
  - Pending
  - In Progress
  - Escalated
  - Resolved
- Track unpaid bills
- Generate student bills
- Restricted access to student-only community

### General
- Role-based authentication
- JWT-based authorization
- PostgreSQL database with Prisma ORM
- Responsive modern UI
- Separate protected routes for students and wardens

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Authentication
- JWT
- bcryptjs

---

## Project Structure

```bash
hostelhub-fullstack/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── complaints/
│   │   │   ├── dashboard/
│   │   │   ├── bills/
│   │   │   └── community/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   └── warden/
│   │   ├── routes/
│   │   └── main.jsx
│   └── package.json
│
└── README.md

## 1) Create the PostgreSQL database

Open **pgAdmin** or **psql** and create this database:

```sql
CREATE DATABASE hostelhub;
```

You can also use the ready file:

```text
backend/scripts/setup-db.sql
```

## 2) Configure backend environment

Inside `backend/`, create a `.env` file from `.env.example`.

Example:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=my-super-secret-key
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hostelhub?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

## 3) Install backend dependencies

```bash
cd backend
npm install
```

## 4) Generate Prisma client + push schema + seed demo data

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

That creates the tables and inserts demo users, complaints, bills, and community posts.

## 5) Start backend

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/api/health
```

## 6) Configure frontend environment

Inside `frontend/`, create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:4000/api
```

## 7) Install frontend dependencies and run

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Important Notes

### Complaint statuses
The backend stores complaint statuses in database-safe enum form:
- `Pending`
- `InProgress`
- `Escalated`
- `Resolved`

The API converts them to frontend-friendly labels like **In Progress**.

### Community privacy
The route `/api/warden/community` always returns **403 Forbidden**.
This is intentional and matches the app design: the student community is private.

### Billing generation
The warden can generate a bill for a month only once per student.
Duplicate month generation is skipped automatically.

## Troubleshooting

### Prisma can't connect to PostgreSQL
Check:
- PostgreSQL service is running
- database name is `hostelhub`
- username is `postgres`
- password in `DATABASE_URL` is correct
- port `5432` is correct

### Login fails for demo users
Run seed again:

```bash
npm run db:seed
```

### Backend starts but frontend shows network error
Make sure:
- backend is running on port `4000`
- frontend `.env` has correct `VITE_API_URL`
- CORS origin matches `http://localhost:5173`

## Suggested Next Upgrade
- Razorpay or Stripe payment integration
- Image/file upload for complaints
- Real-time updates with Socket.IO on frontend
- Admin panel for room allocation
- Notification center
- Deployment to Vercel + Railway/Render
