# LeadMS – Lead Management System

A production-oriented, role-based Lead Management System frontend built with **Next.js, React, TypeScript, Tailwind CSS, Zustand, Axios, React Hook Form, and Zod**.

LeadMS provides dedicated workflows for **Traders, Vendors, Team Members, and Administrators**, covering product management, vendor product locking, lead management, team invitations, quotation workflows, vendor pricing configuration, and administrative analytics.

---

## 🚀 Live Application

> **Production URL:**  
> Add your Vercel production URL here after deployment.

```text
[https://leadms-frontend.vercel.app](https://leadms-frontend.vercel.app)
```

**GitHub Repository:**  
[https://github.com/ramukathi/leadms-frontend](https://github.com/ramukathi/leadms-frontend)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Role-Based Access](#-role-based-access)
- [Application Workflow](#-application-workflow)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#️-installation)
- [Run the Application](#️-run-the-application)
- [Application URLs](#-application-urls)
- [Supported Roles](#-supported-roles)
- [Recommended Development Workflow](#-recommended-development-workflow)
- [Project Track](#-project-track)
- [Author](#-author)

---

## 📌 Project Overview

LeadMS is a role-based Lead Management System designed to streamline the complete journey from product management to customer lead handling and quotation.

The application provides separate interfaces and workflows for:
- **Trader**
- **Vendor**
- **Team Member**
- **Admin**

The frontend is designed using a modular component-based architecture and communicates with the LeadMS backend through REST APIs. The application supports both data-driven interfaces and backend-integrated workflows.

---

## ✨ Key Features

### 🔐 Authentication & Security
- User registration with role selection (Trader / Vendor)
- Login / Logout
- Forgot password & reset password workflows
- Team invitation acceptance flow
- JWT-based authentication with access and refresh tokens
- Automatic token refresh interception
- Role-based route guards and navigation
- Email verification messaging

---

## 👤 Role-Based Access

LeadMS provides dedicated dashboards and permissions based on the authenticated user's role:

- **Trader:** Manage and publish global product offerings.
- **Vendor:** Browse catalog, lock products, set custom margins, manage leads, send quotes, and invite team members.
- **Team Member:** Access assigned leads, follow up, and issue quotations based on vendor catalog rules.
- **Admin:** System-wide monitoring, user management, global leads oversight, and performance analytics.

---

## 🔄 Application Workflow

```text
Trader
   │
   │ Creates products
   ▼
Global Product Catalog
   │
   │ Products become available
   ▼
Vendor
   │
   │ Browses products
   ▼
Vendor Locks Product
   │
   ▼
Locked Product Catalog
   │
   ├───────────────┐
   │               │
   ▼               ▼
Vendor          Team Member
   │               │
   │ Creates       │ Creates
   │ Leads         │ Leads
   ▼               ▼
Lead Management
   │
   ▼
Quotation
   │
   ▼
Customer Price
   │
   ▼
Lead Status
   │
   ├── New
   ├── Contacted
   ├── Quoted
   ├── Accepted
   └── Rejected
```

---

## 🏗 Project Architecture

The project uses Next.js App Router:

```text
Pages
   │
   ├── Public Pages
   │
   ├── Authentication
   │
   └── Role-Based Dashboards
            │
            ├── Trader
            ├── Vendor
            ├── Team Member
            └── Admin

Reusable Components
   │
   ├── Layout
   ├── Navigation
   ├── UI Components
   └── Dashboard Components

Services
   │
   ├── API Client (Axios interceptors)
   └── Product Services

State
   │
   └── Zustand Authentication Store
```

---

## 📁 Folder Structure

```text
leadms-frontend/
│
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── leads/
│   │   │   ├── users/
│   │   │   └── page.tsx
│   │   │
│   │   ├── team/
│   │   │   ├── leads/
│   │   │   ├── quotes/
│   │   │   └── page.tsx
│   │   │
│   │   ├── trader/
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   │
│   │   └── vendor/
│   │       ├── products/
│   │       ├── locked-products/
│   │       ├── leads/
│   │       ├── quotes/
│   │       ├── team/
│   │       ├── profile/
│   │       └── page.tsx
│   │
│   ├── invitation/
│   │   └── accept/
│   │
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── layout/
│       ├── AppShell.tsx
│       └── DashboardLayout.tsx
│
├── services/
│   ├── api.ts
│   └── productService.ts
│
├── store/
│   └── authStore.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 💻 Prerequisites

Install the following dependencies before getting started:

- **Node.js (v20+)**
  ```bash
  node -v
  ```
- **npm**
  ```bash
  npm -v
  ```
- **Git**
  ```bash
  git --version
  ```

---

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ramukathi/leadms-frontend.git](https://github.com/ramukathi/leadms-frontend.git)
   ```

2. **Navigate into the project directory:**
   ```bash
   cd leadms-frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Build:**
   ```bash
   npm run build
   ```

---

## ▶️ Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Application URLs

| Scope | Path | Description |
|---|---|---|
| **Public** | `/` | Home / Landing Page |
| | `/register` | Sign up with role picker |
| | `/login` | User authentication |
| | `/forgot-password` | Request password reset |
| | `/reset-password` | Submit new password |
| **Trader** | `/dashboard/trader` | Trader dashboard overview |
| | `/dashboard/trader/products` | Manage catalog products |
| **Vendor** | `/dashboard/vendor` | Vendor dashboard overview |
| | `/dashboard/vendor/products` | Browse all products |
| | `/dashboard/vendor/locked-products` | Locked products catalog |
| | `/dashboard/vendor/leads` | Lead pipeline |
| | `/dashboard/vendor/quotes` | Manage quotes |
| | `/dashboard/vendor/team` | Manage team members & invites |
| | `/dashboard/vendor/profile` | Vendor profile & company details |
| **Team Member** | `/dashboard/team` | Team workspace overview |
| | `/dashboard/team/leads` | Assigned leads pipeline |
| | `/dashboard/team/quotes` | Generate & manage quotes |
| **Admin** | `/dashboard/admin` | Global administrative hub |
| | `/dashboard/admin/analytics` | System reports & insights |
| | `/dashboard/admin/users` | Global user management |
| | `/dashboard/admin/leads` | Full lead visibility |

---

## 🧪 Supported Roles

- `trader`
- `vendor`
- `team_member`
- `admin`

---

## 🔄 Recommended Development Workflow

```text
Clone Repository
       │
       ▼
Install Dependencies
       │
       ▼
Configure .env.local
       │
       ▼
npm run dev
       │
       ▼
Develop / Test
       │
       ▼
npx tsc --noEmit
       │
       ▼
npm run lint
       │
       ▼
npm run build
       │
       ▼
Commit Changes
       │
       ▼
Push to GitHub
       │
       ▼
Deploy to Vercel
```

## 👨‍💻 Author

**Ramu Kathi**

- **GitHub:** [@ramukathi](https://github.com/ramukathi)
