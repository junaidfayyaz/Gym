# TITANFIT | Single Unified Next.js 14+ Gym Management System (PKR)

A single, unified, fully functional Gym Web Application built with **Next.js 14+ (App Router)**, **Tailwind CSS**, **Lucide React**, and **MongoDB Atlas (Mongoose)**. All monetary values and subscription tiers are strictly displayed in **Pakistani Rupee (PKR / Rs.)**.

---

## 📁 Single Next.js Project Structure

```
Gym/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .env
├── app/
│   ├── layout.jsx
│   ├── page.jsx                      # Single Public Landing Page
│   ├── globals.css
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.jsx             # Admin Login Page (/admin/login)
│   │   ├── page.jsx                 # Protected Executive Analytics Dashboard (/admin)
│   │   ├── members/
│   │   │   └── page.jsx             # Member Management Directory (/admin/members)
│   │   ├── attendance/
│   │   │   └── page.jsx             # Attendance Tracker (/admin/attendance)
│   │   ├── financials/
│   │   │   └── page.jsx             # Fee Reconciliation & CSV Hub (/admin/financials)
│   │   └── inquiries/
│   │       └── page.jsx             # Public Leads Inbox (/admin/inquiries)
│   └── api/
│       ├── auth/
│       │   ├── login/route.js        # Admin JWT Authentication & HTTP-only Cookie
│       │   ├── logout/route.js       # Logout API Route
│       │   └── me/route.js           # Session Verification API Route
│       ├── members/
│       │   ├── route.js              # GET & POST Member Enrollment (PKR)
│       │   ├── [id]/route.js         # PUT Update & DELETE Member
│       │   └── import/route.js       # Bulk CSV Member Import
│       ├── export/
│       │   ├── members/route.js      # 1-Click CSV Export Members
│       │   └── attendance/route.js   # 1-Click CSV Export Attendance
│       ├── attendance/
│       │   └── route.js              # GET & POST Attendance Check-in Entry
│       ├── inquiries/
│       │   ├── route.js              # POST Contact Form + Nodemailer Email Trigger
│       │   └── [id]/route.js         # Status Update
│       └── analytics/
│           └── route.js              # Executive KPI & Recharts Data in PKR
├── components/
│   ├── public/
│   │   ├── Navbar.jsx                # Top Navbar with prominent "Admin Login" button
│   │   ├── HeroSection.jsx
│   │   ├── FacilitiesSection.jsx
│   │   ├── PlansSection.jsx          # PKR Pricing Cards (Rs. 3,500, Rs. 9,000, Rs. 30,000)
│   │   ├── ScheduleSection.jsx
│   │   ├── BMICalculator.jsx
│   │   ├── ContactForm.jsx           # Zod validation + Nodemailer Email Trigger
│   │   └── Footer.jsx
│   └── admin/
│       ├── AdminSidebar.jsx
│       ├── ExecutiveAnalytics.jsx    # KPI Cards & Recharts Revenue Chart in PKR
│       ├── MemberTable.jsx           # Member CRUD, JazzCash/EasyPaisa/Cash, Printable Receipts
│       ├── AttendanceTracker.jsx     # Member ID & Phone check-in
│       ├── CSVImportExport.jsx       # 1-Click Export & Bulk Import Hub
│       └── InquiriesInbox.jsx        # Public Website Leads Inbox
├── lib/
│   ├── db.js                         # Mongoose DB Connection + Mongo Memory Fallback
│   ├── auth.js                       # JWT Session Cookie Helper
│   ├── mailer.js                     # Nodemailer Email Notification Service
│   └── seedHelper.js                 # Automatic PKR Seeder Module
├── models/
│   ├── Admin.js
│   ├── Member.js
│   ├── Attendance.js
│   ├── Plan.js
│   └── Inquiry.js
└── scripts/
    └── seed.js                       # CLI Seeder Script
```

---

## 🔑 Admin Login Credentials

| Role | Entry Point | Email | Password |
|---|---|---|---|
| **Admin** | Top Navbar → **"Admin Login"** button | `admin@gym.com` | `admin123` |

*(An **Autofill Demo Admin Credentials** button is also provided on the `/admin/login` page for instant 1-click testing).*

---

## ⚡ Quick Start (Single Project Command)

### 1. Start Development Server
```bash
# In project root:
npm run dev
```

* The Next.js App Router project will run on **`http://localhost:3000`**.

> [!NOTE]
> **Zero-Config Database**:
> If MongoDB is not installed locally on your machine, the application will automatically launch an **In-Memory Mongo Database** and populate demo PKR accounts & plans!

---

## 🛠️ Key Technical Features Implemented

1. **Single Project Architecture**:
   - Single repository with Next.js App Router for frontend UI and Next.js Route Handlers (`app/api/...`) for backend logic.
2. **PKR Monetary Standard**:
   - Membership plans displayed in Pakistani Rupees (`Rs. 3,500 / Month`, `Rs. 9,000 / Quarter`, `Rs. 30,000 / Year`).
   - Payment modes include `JazzCash`, `EasyPaisa`, `Cash`, and `Bank Transfer`.
   - Fee receipts render with PKR formatting.
3. **Public Landing Page & Contact Form**:
   - Top Header Navbar with prominent **"Admin Login"** CTA button.
   - Contact form validates Pakistani phone numbers (`03XX-XXXXXXX`) using Zod, saves inquiries to MongoDB, and triggers email notifications to gym management via Nodemailer.
4. **Protected Admin Operations Dashboard**:
   - `/admin` access protected via HTTP-only JWT cookies.
   - Executive Analytics with KPI cards and Recharts revenue graph in PKR.
   - Member CRUD table with search, status filters, payment modes, and printable HTML/PDF fee receipts.
   - Attendance Tracker with phone number check-in search.
   - 1-Click CSV Export for members & attendance, plus bulk CSV Import tool.
   - Leads inbox with status tracking (`new`, `contacted`, `resolved`).
