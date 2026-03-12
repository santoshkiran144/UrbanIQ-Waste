# UrbanIQ Waste Project Details

## 1. Project Overview

**UrbanIQ Waste** is a MERN-based MVP web application for monitoring household waste segregation compliance in urban apartment communities.  
The platform helps:

- **Waste Collectors** capture mixed-waste violations quickly during collection routes
- **RWA Admins** review compliance data, monitor repeat offenders, and manage household/violation records
- **Residents** view their household compliance score and violation history

The product is designed as a demonstration-ready MVP for **user testing with at least 10 real users**.

## 2. Problem Statement

Urban apartment communities often struggle to enforce proper waste segregation because:

- collectors have no quick way to record non-compliance
- RWAs do not have a live dashboard for repeat offenders
- residents lack transparent visibility into their waste behavior
- paper or verbal reporting creates friction and weak accountability

UrbanIQ Waste solves this by digitizing violation reporting, evidence capture, compliance scoring, and analytics.

## 3. Core Objectives

- provide a simple collector workflow for reporting mixed waste
- support role-based login and dashboard access
- track household compliance scores
- provide RWA analytics for violations and performance trends
- support image uploads as evidence
- offer an MVP suitable for demos, screenshots, and usability testing

## 4. Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Multer for image upload

## 5. User Roles

### 1. Waste Collector

- login to collector dashboard
- start route
- search/select or simulate QR scan of household
- upload waste evidence image
- submit violation
- view recent reports

### 2. RWA Admin

- login to admin dashboard
- view analytics and repeat offenders
- manage households
- manage violations
- open household detail pages
- update/delete household data
- create/update/delete violations for a household
- open violation detail pages

### 3. Resident

- login to resident dashboard
- see household compliance score
- see household violation history

## 6. Key Features

### Public Website

- startup-style landing page
- hero section with CTA
- features section
- how-it-works section
- live compliance snapshot

### Authentication

- signup for collector, admin, or resident
- JWT-based login
- role-based dashboard redirects

### Collector Workflow

- route toggle UI
- household lookup
- simulated QR scan support
- image evidence capture modal
- quick violation submission

### Compliance Scoring

- every household starts at **100**
- each verified violation deducts **10 points**
- repeat violations reduce score further

### Admin Analytics

- compliance percentage
- total violations
- tracked households
- repeat offenders
- building performance charts
- monthly violation trends

### Household Management

- admin can create household
- admin can edit household
- admin can delete household
- admin can open a dedicated household detail page

### Violation Management

- collector can create violation
- admin can create violation
- admin can edit violation
- admin can delete violation
- admin can verify or dismiss violation

### UI Features

- dark/light mode toggle
- notification panel
- compliance info panel
- back buttons on main pages
- modern glassmorphism-based dashboards

## 7. Project Structure

```text
Playground/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── uploads/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── project-details.md
│   ├── report-template.md
│   └── usability-feedback-template.csv
└── README.md
```

## 8. Important Frontend Pages

### Public Pages

- `/`
- `/login`
- `/signup`

### Protected Pages

- `/dashboard/collector`
- `/dashboard/admin`
- `/dashboard/admin/households/:householdId`
- `/dashboard/admin/violations/:violationId`
- `/dashboard/collector/violations/:violationId`
- `/dashboard/resident`

## 9. Backend Data Models

### User

Fields:

- `role`
- `name`
- `email`
- `password`
- `buildingName`
- `unitNumber`
- `phone`

### Household

Fields:

- `householdId`
- `buildingName`
- `unitNumber`
- `resident`
- `complianceScore`
- `violationCount`

### Violation

Fields:

- `household`
- `householdId`
- `collector`
- `imageUrl`
- `date`
- `location`
- `notes`
- `status`
- `pointsDeducted`

## 10. Main API Endpoints

### Public

- `GET /api/health`
- `GET /api/public/overview`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Collector

- `POST /api/violations`
- `GET /api/violations/my-reports`
- `GET /api/violations/households`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/households`
- `POST /api/admin/households`
- `PUT /api/admin/households/:id`
- `DELETE /api/admin/households/:id`
- `GET /api/admin/violations`
- `POST /api/admin/violations`
- `PUT /api/admin/violations/:id`
- `DELETE /api/admin/violations/:id`

### Resident

- `GET /api/resident/dashboard`

## 11. Authentication Flow

1. user signs up or logs in
2. backend returns JWT token
3. token is stored in local storage
4. frontend attaches token in `Authorization` header
5. protected routes verify token and role

## 12. Compliance Score Logic

- default score = `100`
- for each verified violation:
  - `pointsDeducted = 10`
- score formula:

```text
complianceScore = max(0, 100 - totalPointsDeducted)
```

- household violation count is synced from stored verified violations

## 13. QR Scan and Violation Flow

### Collector flow

1. open collector dashboard
2. search/select a household
3. click **Simulate QR Scan**
4. household ID is auto-filled
5. upload evidence image
6. enter location and notes
7. submit violation

## 14. Admin Household Detail Flow

From the admin dashboard:

1. click a household card or top offender card
2. navigate to household detail page
3. manage household details
4. create/update/delete violations related to that household
5. open detailed violation pages if needed

## 15. Theme and UI Controls

- dark/light mode toggle in app shell
- notification panel from bell icon
- compliance info panel from sidebar
- back buttons across major screens

## 16. Demo / Seed Data

Seed script creates:

- admin users
- collector users
- resident users
- households
- demo violations

Seed command:

```bash
npm run seed
```

Demo accounts after seeding:

- Admin: `admin@urbaniq.test` / `password123`
- Collector: `collector1@urbaniq.test` / `password123`
- Resident: `asha@urbaniq.test` / `password123`

## 17. Environment Configuration

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urbaniq_waste
JWT_SECRET=dev_secret_change_me
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

## 18. Local Setup

Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Run project:

```bash
npm run seed
npm run dev:backend
npm run dev:frontend
```

## 19. Testing Checklist

### Landing Page

- home page loads correctly
- CTA works for logged-out users
- CTA works for logged-in users
- snapshot metrics update from backend

### Login / Signup

- signup works for all roles
- login works for all roles
- redirects correctly by role

### Collector

- route button toggles
- QR simulation works
- violation form accepts image
- submit stores record successfully

### Admin

- dashboard loads analytics
- refresh updates dashboard
- household cards open detail page
- household CRUD works
- violation CRUD works
- violation details page opens

### Resident

- resident dashboard shows score
- violation history renders correctly

## 20. Submission Support

The project already includes files for final MVP submission:

- [report-template.md](/c:/Users/91995/Documents/Playground/docs/report-template.md)
- [usability-feedback-template.csv](/c:/Users/91995/Documents/Playground/docs/usability-feedback-template.csv)

These can be used to document:

- screenshots
- user testing observations
- usage data
- feedback from 10 real users

## 21. Current MVP Scope

This project is a **working MVP**, not a production platform. It demonstrates:

- role-based access
- violation reporting
- compliance scoring
- image evidence
- dashboard analytics
- household and violation management

## 22. Possible Future Improvements

- real QR scanning using device camera
- AI image classification for mixed waste detection
- live notifications using WebSockets
- resident dispute workflow
- better audit logs
- exportable analytics reports
- pagination and filtering across admin records
- deployment to cloud hosting

## 23. Summary

UrbanIQ Waste is a complete demonstration-ready MVP showing how apartment communities can digitally monitor waste segregation compliance.  
It combines a modern web UI, real CRUD flows, evidence uploads, compliance scoring, and role-based dashboards in a single MERN application suitable for evaluation, demos, and academic submission.
