# TutorsPoint System Architecture & Workflow Overview

This document provides a high-level overview of how the **TutorsPoint** platform works, its technology stack, and its core data workflows.

## 1. Technology Stack (MERN)

The application is built using the **MERN** stack (MongoDB, Express, React, Node.js). 
It is divided into two separate directories: `/client` (Frontend) and `/server` (Backend).

### **Frontend (`/client`)**
* **Framework:** React 19 powered by Vite for fast development and building.
* **Styling:** Tailwind CSS (`v4`) for utility-first styling, paired with custom CSS in `index.css` for gradients, glassmorphism UI components, and animations.
* **Routing:** `react-router-dom` for client-side Single Page Application (SPA) navigation.
* **State Management:** React Context API (`AuthContext`) is used for global state management (handling active user sessions, login/logout, and roles). Local state is managed via React hooks (`useState`, `useEffect`).
* **Icons:** `lucide-react` for standard UI iconography.
* **HTTP Client:** `axios` (configured in `src/services/api.js`) is used to make API calls to the Express backend.

### **Backend (`/server`)**
* **Environment:** Node.js.
* **Framework:** Express.js for building the RESTful API routing and handling requests.
* **Database:** MongoDB with **Mongoose** as the Object Data Modeling (ORM) library (`/models`).
* **Authentication:** JSON Web Tokens (JWT) for stateless authentication.
* **Architecture:** MVC (Model-View-Controller) structure:
  * **Routes (`/routes`)**: Define the API endpoints (e.g., auth, requirements, tutors, admins).
  * **Controllers (`/controllers`)**: Handle the business logic and database interactions for the routes.
  * **Middleware (`/middleware`)**: Handles route protection (checking JWTs, verifying user roles) and file uploads.
  * **Models (`/models`)**: Define the MongoDB schemas (User, Requirement, etc.).

---

## 2. Core Entities & Roles

The system is built around three primary user roles:
1. **Parent/Student**: Can post tuition requirements, browse tutor profiles, and receive applications.
2. **Tutor**: Can browse the requirements board, apply to active tuition jobs, and manage their public profile.
3. **Admin**: Has overarching access to moderate users, requirements, and platform settings.

---

## 3. How the System Works (Data Flow)

### **A. Authentication & Identity Flow**
1. A user visits the platform and signs up (Tutor or Student/Parent).
2. The React frontend sends a POST request to `/api/auth/signup`.
3. The Express backend hashes the password, saves the user to MongoDB, and returns a **JWT token**.
4. The frontend's `AuthContext` stores the token (usually in `localStorage` or memory) and keeps the user logged in across page reloads.
5. All protected API requests include this JWT token in the `Authorization` header. The backend's `auth.middleware.js` verifies this token before allowing the action.

### **B. Posting & Viewing Requirements Flow**
1. **Posting**: A logged-in Parent/Student fills out the Post Requirement form (budget, subjects, location, days per week).
2. **Database**: The backend controller validates this data and saves a `Requirement` document to MongoDB.
3. **Browsing**: Tutors go to the `/requirements` page. The frontend makes a GET request to fetch all active requirements. 
4. **UI**: Requirements are displayed using the `RequirementCard` component. Unregistered or Parent users see a masked contact number (e.g., `98XXXXXX10`).

### **C. Applying to a Tuition Job (The Core Interaction)**
1. A Tutor clicks **"Apply Now"** on a `RequirementDetails` page or `RequirementCard`.
2. The frontend triggers the `handleApply` function, doing a POST request to `/requirement/:id/apply`.
3. The backend checks if the user is a Tutor and hasn't already applied.
4. If valid, the backend adds the Tutor's User ID to the requirement's `appliedTutors` array in the database.
5. **Contact Revelation**: Once the application is successful, the backend returns the full, unmasked phone number of the Parent/Student to the Tutor, which the frontend immediately updates in the UI. 
6. Both the Tutor and Student can now see each other in their respective dashboards (`TutorDashboard`, "My Requirements").

### **D. Global UI Layout**
* **Navbar (`Navbar.jsx`)**: Sticky header containing navigation links, responsive mobile drawer (hamburger menu), user avatar dropdown, and a notification bell. It adapts dynamically based on the user's role (showing different dropdown options for Tutors vs. Parents).
* **Footer (`Footer.jsx`)**: 4-column responsive grid providing quick links, support, contact info, and copyright logic.

---

## 4. Directory Structure Map

```text
c:\ROAD TO !L\tutorsite\
├── client\                  # Frontend React App
│   ├── index.html           # HTML Entry Point
│   ├── package.json         # Frontend dependencies (React, Vite, Tailwind)
│   ├── vite.config.js       # Vite bundler config
│   └── src\
│       ├── App.jsx          # Main React Router component mapping
│       ├── index.css        # Global CSS, Tailwind imports, variables
│       ├── context\         # AuthContext (Global state)
│       ├── components\      # Reusable UI (Navbar.jsx, Footer.jsx, Cards)
│       ├── pages\           # Full page components (Home, Login, Details)
│       └── services\        # Backend communication (api.js, axios setup)
│
├── server\                  # Backend Node.js/Express App
│   ├── package.json         # Backend dependencies (Express, Mongoose, JWT)
│   └── src\
│       ├── server.js        # Express app initialization, DB connection
│       ├── config\          # Environment variables, DB setup
│       ├── routes\          # API endpoint declarations
│       ├── controllers\     # API logic handlers
│       ├── middleware\      # Auth guards, Error handling
│       └── models\          # MongoDB Schemas (User, Requirement)
```
