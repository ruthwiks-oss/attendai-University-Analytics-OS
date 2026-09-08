# attendai | University Analytics OS

A production-oriented Next.js + MongoDB foundation for AI-powered attendance and student performance analytics.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## ER model and backend

The MongoDB collections preserve the supplied relationships: departments own students; faculty teach subjects; subjects have classes; classes connect attendance and assessments; students generate timestamped predictions; predictions generate alerts. Assessment documents also retain the `attendanceId` relationship from the diagram. The dashboard route at `/api/dashboard` reads live collection counts. The current prediction engine is explicitly transparent baseline predictive analytics, isolated for a future trained-model adapter.

## Local setup

Copy `.env.example` to `.env.local`, provide `MONGODB_URI` and `AUTH_SECRET`, run `npm install`, then `npm run seed` and `npm run dev`.

The smoke-test super admin is `123456` / `dsmaer`. Set `SUPER_ADMIN_USERNAME` and `SUPER_ADMIN_PASSWORD` in Vercel before production. New accounts created at `/register` are persisted in MongoDB and can sign in with their email and password.

## Deployment

Set `MONGODB_URI` and `AUTH_SECRET` as Vercel production environment variables. MongoDB Atlas must allow the Vercel runtime network access. Never expose `MONGODB_URI` with a `NEXT_PUBLIC_` prefix.

## Presentation flow

- `/` - branded product landing page
- `/login` - working demo sign-in with Administrator, Faculty member, and Student roles
- `/attendance` - teacher register for selecting a class, marking a roster, and saving attendance
`/api/departments`, `/api/students`, `/api/faculty`, `/api/subjects`, `/api/classes`, `/api/attendance`, `/api/assessments`, `/api/predictions`, and `/api/alerts`. `POST /api/attendance` also accepts a validated `records` array and upserts one register in a single request.
The `models/` directory contains Department, Student, Faculty, Subject, Class, Attendance, Assessment, Prediction, Alert, and User models. Attendance has a unique student/class compound index; predictions are timestamped; assessments retain the diagram’s `attendanceId` link. `scripts/seed.ts` populates CHRIST UNIVERSITY demo departments, students, faculty, subjects, and class sessions.

## Smoke test

Run `npm run lint` and `npm run build`. With MongoDB configured, run `npm run seed`, open `/login`, sign in with the smoke-test credentials, open Attendance, choose a class, mark students, and save. Confirm the success toast, then save again to verify the upsert does not create duplicates.
- `/` after sign-in - analytics workspace dashboard
- `/about` - product, ER model, AI architecture, and production handoff brief

The demo login uses a short-lived browser session so the complete presentation works before MongoDB is connected. Replace that session with a real authentication provider and enable the existing Mongoose models/API after adding `.env.local`.

## Final file and feature inventory

### Routes

- `/` - CHRIST UNIVERSITY landing page and protected analytics workspace
- `/login` - demo role sign-in
- `/register` - create an Administrator, Faculty, or Student user
- `/about` - product and architecture brief

### Server API

Every academic collection has paginated/searchable `GET`, Mongoose-validated `POST`, item `GET`, `PUT`, and `DELETE` routes:

`/api/departments`, `/api/students`, `/api/faculty`, `/api/subjects`, `/api/classes`, `/api/attendance`, `/api/assessments`, `/api/predictions`, and `/api/alerts`.

Additional routes are `/api/users`, `/api/dashboard`, the baseline prediction service in `lib/ai/attendancePrediction.ts`, and centralized thresholds in `lib/config/risk.ts`.

### Database files

The `models/` directory contains Department, Student, Faculty, Subject, Class, Attendance, Assessment, Prediction, Alert, and User models. Attendance has a unique student/class compound index; predictions are timestamped; assessments retain the diagram’s `attendanceId` link. `scripts/seed.ts` populates CHRIST UNIVERSITY demo departments, students, faculty, and subjects.

### Remaining production handoff

The application is build- and lint-clean. Before production, replace the demo cookie login with a production identity provider, add server-side authorization checks to protected CRUD handlers, and set production `AUTH_SECRET`/`MONGODB_URI` in Vercel. The supplied Atlas connection is configured and seeded locally.
