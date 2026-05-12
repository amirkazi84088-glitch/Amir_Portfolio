# 🚀 Amir Kazi Portfolio — Deployment Guide
> Team Error 404 | @2026 Amir Kazi

---

## 📁 Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Main portfolio homepage
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── blog/
│   │   │   ├── page.tsx          ← Blog listing (visitors)
│   │   │   └── [slug]/page.tsx   ← Individual blog post
│   │   ├── admin/
│   │   │   ├── page.tsx          ← Redirects to dashboard
│   │   │   ├── login/page.tsx    ← YOUR login page
│   │   │   └── dashboard/page.tsx← Admin panel (projects/blogs/visitors)
│   │   └── api/
│   │       ├── auth/login/       ← POST login
│   │       ├── auth/logout/      ← POST/GET logout/me
│   │       ├── track/            ← Silent visitor tracking
│   │       ├── public/blogs/     ← Public blog API
│   │       ├── public/projects/  ← Public projects API
│   │       └── admin/            ← Protected CRUD APIs
│   ├── components/
│   │   └── Tracker.tsx           ← Silent visitor tracker
│   └── lib/
│       ├── db.ts                 ← MySQL connection
│       ├── auth.ts               ← JWT + bcrypt helpers
│       └── middleware.ts         ← Admin auth guard
├── scripts/
│   └── init-db.js               ← Creates all DB tables + seeds data
├── railway.json                 ← Railway config
├── nixpacks.toml                ← Build config
└── .env.example                 ← Copy to .env.local
```

---

## 🛠️ STEP 1 — Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Edit .env.local with your local MySQL details
# (or skip and go straight to Railway deployment)

# 4. Init the database (creates tables + seeds data)
node scripts/init-db.js

# 5. Start dev server
npm run dev
# Open: http://localhost:3000
```

---


## ✅ Features Checklist

| Feature | Status |
|---------|--------|
| Portfolio homepage (Hero, About, Skills, Projects, Blog, Contact) | ✅ |
| Animated typing effect | ✅ |
| Custom cursor glow | ✅ |
| Scroll reveal animations | ✅ |
| Skill bar animations | ✅ |
| Responsive (mobile/tablet/desktop) | ✅ |
| Admin login (JWT + bcrypt) | ✅ |
| Add/Edit/Delete Projects (admin only) | ✅ |
| Write/Edit/Delete Blogs (admin only) | ✅ |
| Visitors can only READ (no add/edit) | ✅ |
| Silent visitor tracking (IP + geo + browser) | ✅ |
| Visitor dashboard in admin panel | ✅ |
| MySQL database on Railway | ✅ |
| LinkedIn, Email, Phone links | ✅ |
| Blog pages with full content | ✅ |

---

*Built by Amir Kazi — Team Error 404 — @2026*
