# LeadMS — Lead Management System

A modern, responsive **Lead Management System (LeadMS)** built with **Next.js, React, TypeScript, Tailwind CSS, Zustand, Axios, React Hook Form, and Zod**.

LeadMS provides role-based workflows for **Traders, Vendors, Team Members, and Administrators**, allowing businesses to manage products, leads, quotations, vendor settings, team members, and analytics from a centralized platform.

---

## 🚀 Live Application

**Live URL:**  
_Add your Vercel production URL here after deployment._

**GitHub Repository:**  
https://github.com/ramukathi/leadms-frontend

---

## 📌 Project Overview

LeadMS is a role-based business management application designed to streamline the complete lead-to-quote workflow.

The application supports four primary roles:

- **Trader**
- **Vendor**
- **Team Member**
- **Admin**

Each role receives a dedicated dashboard and access to functionality relevant to their responsibilities.

### Core Workflow

```text
Trader
   │
   ├── Manages global product catalog
   ├── Creates products
   ├── Updates products
   └── Sets product base prices
           │
           ▼
Vendor
   │
   ├── Browses available products
   ├── Locks products
   ├── Configures pricing
   ├── Invites team members
   ├── Creates leads
   ├── Assigns leads
   └── Creates quotations
           │
           ▼
Team Member
   │
   ├── Views vendor-locked products
   ├── Creates leads
   └── Builds quotations
           │
           ▼
Admin
   │
   ├── Views analytics
   ├── Manages users
   └── Monitors leads
