# UrbanIQ Waste MVP

UrbanIQ Waste is a MERN MVP for apartment-community waste segregation compliance monitoring. It includes:

- Public landing page with product positioning and access to login/signup
- JWT-based authentication with role-aware routing
- Waste collector reporting with image uploads via Multer
- Resident compliance view with household score and evidence history
- RWA admin analytics for compliance, violations, repeat offenders, building performance, and monthly trends

## Stack

- Frontend: React + Vite + Recharts
- Backend: Node.js + Express + MongoDB + Mongoose + JWT + Multer

## Run locally

1. Copy [backend/.env.example](/c:/Users/91995/Documents/Playground/backend/.env.example) to `backend/.env`.
2. Copy [frontend/.env.example](/c:/Users/91995/Documents/Playground/frontend/.env.example) to `frontend/.env`.
3. Install dependencies:
   - `npm install`
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
4. Start MongoDB locally at `mongodb://localhost:27017`.
5. Seed demo users and households:
   - `npm run seed`
6. Start the backend:
   - `npm run dev:backend`
7. Start the frontend:
   - `npm run dev:frontend`

## Demo accounts

After seeding, use these credentials:

- Admin: `admin@urbaniq.test` / `password123`
- Collector: `collector1@urbaniq.test` / `password123`
- Resident: `asha@urbaniq.test` / `password123`

## API overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/violations`
- `GET /api/violations/my-reports`
- `GET /api/admin/dashboard`
- `GET /api/resident/dashboard`

## Submission support

Artifacts for the final submission are in [docs/report-template.md](/c:/Users/91995/Documents/Playground/docs/report-template.md) and [docs/usability-feedback-template.csv](/c:/Users/91995/Documents/Playground/docs/usability-feedback-template.csv).
