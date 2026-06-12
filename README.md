# Premium MERN Stack Portfolio Template

A professional, modern, creative, minimalist, and elegant portfolio template designed for software engineers and digital creators. Built using the **MERN** stack (MongoDB, Express, React, Node.js) with standard Vanilla CSS for ultimate styling flexibility.

---

## 🌟 Key Features

- **Dark-Theme Aesthetics**: A rich, responsive design with glassmorphic cards and subtle gradient accent glow.
- **Dynamic Projects Showcase**: Filterable gallery of projects. It gracefully falls back to mock data if the database is not seeded yet.
- **Skill Telemetry**: Neatly categorized progress bars visualizing your tool stacks.
- **Timeline Milestones**: Modern vertical timeline representing professional history.
- **Active Contact Form**: Seamless contact interface storing message submissions in MongoDB.
- **Admin Dashboard**: Log in securely to manage:
  - Projects (Add, Edit, Delete)
  - Skills (Add, Delete)
  - Messages (View, Mark Read, Delete)
- **Safe Boot System**: The backend stays active even if your local MongoDB server is offline, showing helpful alerts while retaining full functionality with client-side fallback data.

---

## 📂 Folder Structure

```text
mern-portfolio/
├── backend/          # Node & Express server, MongoDB connectivity
└── frontend/         # React SPA built with Vite
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

---

### 1. Server Configuration & Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file using the example template:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Mac/Linux:
     ```bash
     cp .env.example .env
     ```
3. Update `.env` with your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio   # Or your MongoDB Atlas connection string
   JWT_SECRET=your_jwt_signing_token_key_here
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

*The server will run on `http://localhost:5000`.*

---

### 2. Client Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```

*The website will open on `http://localhost:5173`.*

---

## 🔐 Setting up your Admin Account

When you launch the application, you can navigate to the admin portal by clicking **Admin Login** in the navigation bar, or going directly to:
`http://localhost:5173/admin`

1. On the login card, click **"Setup first admin account?"** at the bottom.
2. Enter your desired **Username** and **Password**, then click **Register**.
3. Once registered, the registration portal is permanently locked (only one admin user is allowed in the DB for security).
4. You will be redirected to the **Admin Dashboard**, where you can begin adding your real projects and skills!
