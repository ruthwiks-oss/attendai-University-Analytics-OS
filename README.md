# attendai

## University Analytics OS

attendai is a Next.js and MongoDB workspace for university attendance operations, student records, academic activity, and explainable attendance-risk signals.

The product is designed around one practical loop: teachers record attendance, administrators monitor the institution, students review their records, and the prediction layer highlights where support may be needed.

## Product Surface

- **Overview**: live dashboard counts, attendance trends, risk signals, reports, and notifications.
- **Teacher workspace**: choose a class, add students, remove students, mark present or absent, and save a complete register.
- **Student directory**: search the live student collection and open an individual attendance dashboard.
- **AI Predictions**: generate transparent baseline predictions from recorded attendance history.
- **Academic workspaces**: departments, faculty, subjects, classes, assessments, and alerts are available from the sidebar.
- **Settings**: configure local attendance and high-risk thresholds.
- **Role-aware access**: Administrator, Faculty, and Student roles are carried through the sign-in and registration flow.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and authenticated overview dashboard |
| `/login` | Sign in with email or username |
| `/register` | Create an Administrator, Faculty, or Student account |
| `/attendance` | Teacher/admin attendance register |
| `/students` | Student directory and dashboard |
| `/students/:id` | Individual student profile |
| `/predictions` | AI prediction studio |
| `/workspace/:section` | Live academic workspace for departments, faculty, subjects, classes, assessments, or alerts |
| `/about` | Product and architecture brief |

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- MongoDB with Mongoose
- Zod request validation
- bcrypt password hashing
- Lucide icons
- Recharts and CSS data visualizations
- Vercel-compatible server routes

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas or a reachable MongoDB deployment

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example`:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendai
   AUTH_SECRET=use-a-long-random-secret
   SUPER_ADMIN_USERNAME=choose-a-private-admin-username
   SUPER_ADMIN_PASSWORD=choose-a-strong-admin-password
   ```

   Never commit `.env.local` or expose `MONGODB_URI` through a `NEXT_PUBLIC_` variable.

3. In MongoDB Atlas, add your current IP under **Security > Network Access**.

4. Seed the academic demo data:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## User Workflows

### Administrator

1. Sign in.
2. Use the sidebar to open live departments, faculty, subjects, classes, assessments, and alerts.
3. Open Settings to save attendance and risk thresholds.
4. Open Attendance to manage the roster and review the register.

### Teacher

1. Register with the Faculty role or sign in with a Faculty account.
2. Open **Attendance**.
3. Select a class session.
4. Use **Add student** to create a student record.
5. Mark each student **Present** or **Absent**.
6. Use the remove action to delete an incorrect student record.
7. Select **Save attendance** to upsert the register without duplicate student/class records.

### Student

1. Register with the Student role or sign in with a Student account.
2. Open **Students** to view the directory and profile dashboards.
3. Review attendance history and present/missed totals.

## API Surface

Academic collection routes support paginated `GET` and CRUD operations:

```text
/api/departments
/api/students
/api/faculty
/api/subjects
/api/classes
/api/attendance
/api/assessments
/api/predictions
/api/alerts
```

Additional routes:

```text
/api/auth/login
/api/users
/api/dashboard
/api/students/:id/attendance
/api/predictions/generate
```

`POST /api/attendance` accepts a validated `records` array and upserts the register by `studentId` and `classId`.

`POST /api/predictions` generates baseline predictions using attendance history. The model is intentionally transparent and isolated in `lib/ai/attendancePrediction.ts` so it can later be replaced by a trained model adapter.

## Database Model

The main Mongoose models are:

- `Department`: academic departments and ownership details
- `Student`: identity, department, section, and semester
- `Faculty`: teaching staff and contact details
- `Subject`: curriculum records and faculty ownership
- `Class`: scheduled class sessions
- `Attendance`: student/class attendance records
- `Assessment`: assessment results linked to classes
- `Prediction`: timestamped predicted attendance and risk level
- `Alert`: generated intervention alerts
- `User`: hashed-password application accounts and role metadata

Attendance has a unique `studentId`/`classId` compound index so saving the same register again updates the existing record instead of creating duplicates.

## Verification

Run the release checks before deployment:

```bash
npm run lint
npm run build
```

Recommended smoke test:

1. Open `/login` and verify the administrator sign-in.
2. Open `/register`, create a Faculty account, and sign in with it.
3. Open `/attendance`, select a class, add a student, mark attendance, save, and save again.
4. Open `/students` and the student profile route.
5. Open `/predictions` and generate predictions.
6. Visit each sidebar workspace and confirm live records load from MongoDB.
7. Log out and confirm the app returns to `/login`.

## Vercel Deployment

1. Import the repository into Vercel.
2. Add these production environment variables:

   ```text
   MONGODB_URI
   AUTH_SECRET
   SUPER_ADMIN_USERNAME
   SUPER_ADMIN_PASSWORD
   ```

3. Configure MongoDB Atlas Network Access for the Vercel runtime or approved egress IP range.
4. Deploy and run the smoke test against the production URL.

## Production Hardening

The current application is build- and lint-clean, but these items should be completed before handling sensitive university data at scale:

- Replace the client demo-session cookie with signed, HttpOnly server-side sessions.
- Enforce role authorization inside protected API routes, not only in the client UI.
- Rotate any database password that has been shared during development.
- Add audit logging for attendance edits and student removal.
- Add automated integration tests against a disposable MongoDB database.
- Add rate limiting and account recovery before public launch.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Reset and seed demo academic data |

## Repository

[attendai-University-Analytics-OS](https://github.com/ruthwiks-oss/attendai-University-Analytics-OS)
