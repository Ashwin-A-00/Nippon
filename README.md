# Nippon Toyota - Smart Incentive Calculator
### SDE Internship - Round 2 Submission | Task 2

> A production-ready full-stack web app for managing and calculating tiered sales 
> incentives for Toyota Sales Officers. Built with React, Node.js, and PostgreSQL.

## 🔗 Live Demo
**→ [https://nippon-n19r.vercel.app](https://nippon-n19r.vercel.app)**

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nippon.com | Admin@123 |
| Sales Officer | ravi@nippon.com | Officer@123 |

> ⚠️ Note: The backend runs on Render's free tier. The first login after idle time 
> can take 30-60 seconds while the server wakes up. After that, requests are fast.

## 🧠 How It Works

The **Admin** sets up tiered incentive slabs and manages the car list.  
The **Sales Officer** logs monthly sales per car model and sees payout update in real time.

**Slab calculation example:**

| Cars Sold | Rate | Payout |
|-----------|------|--------|
| 1 - 3 | ₹1,000/car | ₹3,000 max |
| 4 - 7 | ₹2,000/car | ₹14,000 max |
| 8+ | ₹3,500/car | Unlimited |

Admins can change the full slab structure whenever they need to.

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Supabase |
| Auth | JWT + Role-Based Access Control (RBAC) |
| Hosting | Vercel (frontend) + Render (backend) |

## 🏗️ Architecture

```
client/                          server/
├── src/                         ├── config/
│   ├── api/        API calls    │   ├── db.js        Supabase client
│   ├── components/ UI widgets   │   └── jwt.js       Token helpers
│   ├── hooks/      State logic  ├── controllers/     Business logic
│   ├── lib/        Pure utils   ├── middleware/      Auth + RBAC
│   ├── pages/      App screens  ├── routes/          API endpoints
│   └── types/      TS types     └── utils/           Pure functions
```

**Database schema:** 5 tables - `users`, `car_models`, `slab_configs`, `slab_tiers`, `sales_entries`

**RBAC:** Role on the `users` table, checked on every backend route via `authenticate.js` and `requireRole.js`, and on the frontend via `ProtectedRoute.tsx`.

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)

### 1. Clone
```bash
git clone https://github.com/Ashwin-A-00/Nippon.git
cd Nippon/nippon-incentive
```

### 2. Database
- Create a project at [supabase.com](https://supabase.com)
- Run `server/schema.sql` in the Supabase SQL Editor

### 3. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

```bash
node index.js
# Server running on port 5000
```

### 4. Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# App at http://localhost:5173
```

## ✅ Features Implemented

### Admin Portal
- [x] Secure login with JWT
- [x] Car model management (Add / Delete)
- [x] Dynamic incentive slab configuration
- [x] Multiple slabs with one-click activation
- [x] Tier management per slab (min, max, rate)

### Sales Officer Portal
- [x] Secure login with role-based redirect
- [x] Monthly sales entry per car model
- [x] Pre-fills saved values on load
- [x] Real-time incentive tracker (updates as you type)
- [x] Live tier highlight for the current slab
- [x] Instant total payout
- [x] Save sales to the database

### System
- [x] RBAC on all backend routes
- [x] RBAC on all frontend routes
- [x] JWT auth with 7-day expiry
- [x] Consistent API response shape
- [x] Global error handler
- [x] Responsive layout (mobile + desktop)

## 👨‍💻 Submitted by
**Ashwin A**  
B.Tech Information Technology, CUSAT (2027)  
[GitHub](https://github.com/Ashwin-A-00) · [LinkedIn](https://linkedin.com/in/ashwina00)
