# GitHub Deployment Guide - Team Task Manager

## ✅ Setup Complete

Your project is ready to push to GitHub!

### Remote Configuration
```bash
git remote -v
# Should show:
# origin  https://github.com/rishabhgautam1705/team-task-manager.git (fetch)
# origin  https://github.com/rishabhgautam1705/team-task-manager.git (push)
```

---

## 📋 Next Steps

### Step 1: Create Repository on GitHub
1. Visit https://github.com/new
2. Enter repository name: **team-task-manager**
3. Description (optional): "A smart team task management application built with MERN stack"
4. Choose visibility: **Public** or **Private** (your preference)
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push Code to GitHub
After creating the repository, run:

```bash
cd /Users/rishabhgautam/Desktop/Vs\ Code/TTM

# Push to GitHub (you'll be prompted for your GitHub credentials)
git push -u origin main

# Or if your default branch is 'master':
git push -u origin master
```

### Step 3: Authentication
When prompted for credentials, use:
- **Username**: rishabhgautam1705
- **Password**: Your GitHub personal access token (not your password)

Or use SSH if you have it configured.

---

## 📦 Project Structure

```
team-task-manager/
├── client/              # React + Vite frontend
├── server/              # Node.js + Express backend
├── package.json         # Monorepo root
├── .gitignore          # Git ignore rules
└── README.md           # Main documentation
```

---

## 🚀 Features Deployed

✅ MERN Stack Application
✅ MongoDB Atlas Integration
✅ JWT Authentication with CSRF Protection
✅ Role-based Access Control (Admin/Member)
✅ Project Management
✅ Task Tracking
✅ Real-time Dashboard
✅ Responsive Design

---

## ⚙️ Environment Configuration

For this deployment, ensure:
- `server/.env` contains MongoDB Atlas URI
- `client/.env` contains `VITE_API_URL=http://localhost:5001/api`

These files are in `.gitignore` and won't be committed (correct for security).

---

## 🔐 Important Security Notes

- `.env` files are not committed (as intended)
- `node_modules` are not committed
- `node-v*` binaries are not committed
- Create `.env` files locally for development

---

## 📝 Getting Started Locally

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:server  # Backend on http://localhost:5001
npm run dev:client  # Frontend on http://localhost:5173
```

---

## 📖 Default Credentials (Development)

Admin:
- Email: admin@teamtask.com
- Password: Admin@123

Member:
- Email: member@teamtask.com
- Password: Member@123

---

Generated on: May 8, 2026
