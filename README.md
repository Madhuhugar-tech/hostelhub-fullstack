# 🏠 HostelHub – Full Stack Hostel Management System

A modern full-stack hostel management platform designed to streamline student and warden operations with real-world features like complaint tracking, billing, and a private community system.

![image alt](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/38deb99700fc1ded2872579f19ff0f83fe5e3638/Screenshot%202026-04-25%20102257.png)

## 🚀 Features

### 👨‍🎓 Student

* Raise complaints
* Track complaint status (Pending, In Progress, Resolved)
* View and pay mess bills
* Access private hostel community
* Post messages (with anonymous option)
  
![image alt](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/b9f9f435aaa5a85ef2adcfc9ac06f83aaa12bb77/Screenshot%202026-04-25%20103248.png)

![image alt](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/2a5e8aabe2db5210faad10697a5fdde637418d21/Screenshot%202026-04-25%20103342.png)

![image alt](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/879f1a1997204bd80fca2f8eb3d516bd1d233813/Screenshot%202026-04-25%20103422.png)

![image alt](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/6af494dff2341a93f2413c6f33ac3d650a3c2b62/Screenshot%202026-04-25%20103439.png)

### 👩‍💼 Warden

* Monitor all complaints
* Update complaint statuses
* View dashboard analytics
* Manage billing for students

![image al](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/e662d2281deaa1522b6f3f2d816fcccb790c0a42/Screenshot%202026-04-25%20103514.png)

![image al](https://github.com/Madhuhugar-tech/hostelhub-fullstack/blob/90a3c498c0aa8d024ad38b77c697683e69598c3e/Screenshot%202026-04-25%20103541.png)

![image al]()

---

## 🛠 Tech Stack

**Frontend**

* React.js (Vite)
* Axios
* React Router
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

**Authentication**

* JWT (JSON Web Tokens)
* bcryptjs

---
### 📸 Screenshots

### 🔐 Login Page
![Login](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/login.png)

### 🎓 Student Dashboard
![Student Dashboard](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/student-dashboard.png)

### 🛠 Student Issues
![Student Issues](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/student-complaints.png)

### 💬 Student Community
![Student Community](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/student-community.png)

### 💳 Student Bills
![Student Bills](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/student-bills.png)

### 📊 Warden Dashboard
![Warden Dashboard](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/warden-dashboard.png)

### 📋 Warden Complaints
![Warden Complaints](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/warden-complaints.png)

### 💰 Warden Billing
![Warden Billing](https://raw.githubusercontent.com/Madhuhugar-tech/hostelhub-fullstack/main/warden-billing.png)

---

## 📂 Project Structure

```
hostelhub-fullstack/
├── backend/
├── frontend/
├── screenshots/
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


## 📌 Key Highlights

* Role-based authentication system
* Complaint lifecycle tracking
* Dashboard analytics for wardens
* Private student community module
* Clean and responsive UI

---

## 🔮 Future Enhancements

* Online payment integration (Razorpay / Stripe)
* Real-time updates (Socket.IO)
* Notification system
* File upload for complaints
* Admin panel for room allocation

---

## 👩‍💻 Author

Madhupriya Hugar


⭐ If you like this project, give it a star!
