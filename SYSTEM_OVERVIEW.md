# TutorsPoint System Architecture & Workflow Overview (2026)

This document provides a high-level overview of the **TutorsPoint** platform, its technology stack, and its core business logic.

## 1. Core Goal
TutorsPoint is a hyper-local tuition marketplace for Kolkata. It connects parents looking for home tutors with qualified educators through a **Credit-Based Lead System**, eliminating the need for expensive OTP gateways by using algorithmic trust.

## 2. Technology Stack (MERN)
* **Frontend:** React 19 (Vite), Tailwind CSS (Utility), Lucide (Icons), Axios (API calls).
* **Backend:** Node.js (Express), MongoDB (Mongoose), JWT (Authentication), Multer (Image uploads).

## 3. Key Business Systems

### **A. Monetization: Wallet & Credit System**
* **Currency:** 1 Credit = ₹1.
* **Flow:** Tutors spend credits to "Unlock" parent contact details.
* **Lead Barriers:** 
    *   Class 1-5: 10 Credits
    *   Class 6-10: 25 Credits
    *   Class 11-12 / JEE: 50 Credits
* **Escrow:** High-value leads stay "Locked" for 15 minutes for Pro Users only, creating a competitive advantage.

### **B. Fraud Protection: Trust Scoring**
* **Verification:** Tutors aim for 100% "Profile Strength".
* **Components:** Basic Info (50%), ID Proof (+25%), Intro Video (+25%).
* **Velocity Lock:** Tutors who unlock >3 leads in 1 hour are automatically suspended for review.
* **Auto-Lock:** Changing "Critical Fields" (College, Area, Subjects) after 10 days of signup triggers an automatic status regression to `PENDING` and alerts the Admin.

### **C. Admin Cockpit**
* **Command Center:** Specialized UI for reviewing pending tutors. 
* **Audit Trail:** Every profile edit is logged. Admins see "Old Value ➔ New Value" diffs to detect "bait-and-switch" fraud.
* **Review Checklist:** Mandatory manual human verification steps before "Approve" is clickable.

## 4. Directory Structure Map

```text
tutorsite/
├── client/                  # Frontend React App
│   └── src/
│       ├── context/        # Auth & Global State
│       ├── services/       # Axios API config
│       ├── pages/          # Full Page Components
│       │   ├── admin/      # Admin specialized tabs & cockpits
│       │   ├── tutor/      # Tutor specific management pages
│       │   └── ...         # Public landing, search, details
│       ├── components/     # Reusable UI Elements (Cards, Nav, Footer)
│       └── App.jsx         # Router & Entry Point
│
└── server/                  # Backend Express App
    └── src/
        ├── models/         # Mongoose Schemas (User, Tutor, Requirement, Ledger)
        ├── controllers/    # Business Logic (Lead unlocking, Credit logic)
        ├── routes/         # API Endpoint definitions
        ├── middleware/     # Role-based access (requireApprovedTutor)
        └── server.js       # Entry point
```

## 5. How to Contribute
1. **Frontend:** Look at `src/pages/TutorDashboard.jsx` or `src/pages/EditProfile.jsx` to see how we handle profile states.
2. **Backend:** Check `src/controllers/tutor.controller.js` to understand how `calculateCompleteness()` and `criticalFieldLock` work.
3. **Database:** Review `src/models/Tutor.js` to see the schema fields.
