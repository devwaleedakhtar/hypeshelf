# HypeShelf | Project Delivery

This is the submission for the **HypeShelf** application, built according to your requirements using **Next.js**, **Convex**, and **Clerk**.

## 🎯 Executive Summary

The goal was to build a shared recommendations hub where friends can collect and share movies. My approach focused on delivering a production-grade application that is not only functional but also **secure**, **scalable**, and **delightful to use**.

I have implemented all requested features (Authentication, Database, Real-time updates) and added significant enhancements to the User Experience and Security architecture.

---

## 🏗️ Execution & Architecture

### 1. Robust Security (Database-Backed RBAC)
Your requirements called for distinct **User** and **Admin** roles.
*   **Decision**: Instead of relying on static token metadata (which causes delays in permission updates), I implemented a **real-time role system** backed by the Convex database.
*   **Benefit**: Admin privileges (like deleting any post or setting "Staff Picks") are applied **instantly** without requiring the user to log out and back in. This ensures a seamless administrative experience.

### 2. Premium User Experience (UX)
To ensure high engagement, the application was built with a "feel" that goes beyond standard utility:
*   **Fluid Animations**: Integrated `framer-motion` for smooth filtering and layout transitions.
*   **Clean Interface**: Implemented "interaction-heavy" cards where administrative actions are tucked away until hover, keeping the main view clutter-free.
*   **Accessibility**: Added proper loading states, empty states, and dialogs to guide the user at every step.

---

## 🛠️ Setup Instructions

To deploy or run this project locally, please follow these steps:

### 1. Environment Setup
Create a `.env.local` file in the root directory with your API keys:

```bash
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### 2. Installation & Run
Install dependencies and start the development environment:

```bash
npm run dev
npx convex dev
```

### 3. Granting Admin Access
The system uses a secure Database-Backed role assignment. To test Admin features:
1.  Log in to the application.
2.  Open the **Convex Dashboard**.
3.  Navigate to the `users` table.
4.  Locate your user record and set the `role` field to `"admin"`.
5.  Your interface will instantly update to reveal Admin controls (Delete buttons, Staff Pick toggles).

---

## � Tech Stack Verification

*   ✅ **Framework**: Next.js 16 (App Router)
*   ✅ **Database**: Convex (Real-time reactivity)
*   ✅ **Auth**: Clerk (Secure Identity Management)
*   ✅ **Styling**: Tailwind CSS (Responsive Design)

Thank you for the opportunity to build this. I look forward to your feedback.
