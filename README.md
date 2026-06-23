<div align="center">

# 🚀 ProductPulse

### Product Analytics & Experimentation Platform

**Analyze user behavior · Track feature adoption · Run A/B experiments · Monitor retention**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#-features) · [Architecture](#️-architecture) · [API Reference](#-api-reference) · [Getting Started](#-getting-started) · [Testing](#-testing)

</div>

---

## 📖 Overview

**ProductPulse** is a full-stack product analytics platform built for modern product teams. It empowers businesses to make data-driven decisions by providing deep insights into user behavior, funnel performance, retention trends, feature adoption, and A/B experiment results — all powered by real event data.

---

## 🖼️ UI Preview
<img width="1882" height="906" alt="image" src="https://github.com/user-attachments/assets/f423b192-153f-4824-b466-3f40c4fccbf3" />
<img width="1883" height="911" alt="image" src="https://github.com/user-attachments/assets/aea8f8ea-4179-4b47-8265-6ef7affa749c" />
<img width="1902" height="906" alt="image" src="https://github.com/user-attachments/assets/aae4978a-b5b0-4ccb-812d-83204774d3a0" />
<img width="1887" height="911" alt="image" src="https://github.com/user-attachments/assets/d49b5cb1-d678-4569-9059-a1867cd58348" />
<img width="1878" height="906" alt="image" src="https://github.com/user-attachments/assets/c4eaf520-8ed1-4250-a500-76641b7245ad" />
<img width="1868" height="907" alt="image" src="https://github.com/user-attachments/assets/5db27b3a-fb23-45c8-a259-34fb3f9adfa0" />
<img width="1915" height="902" alt="image" src="https://github.com/user-attachments/assets/e3ab6788-ad7a-4a9f-8d04-13ec29f6e535" />


## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with protected routes
- Secure user registration & login
- User-specific data isolation
- Role-based access control

### 📊 Analytics Dashboard
- **DAU / MAU** — Daily & Monthly Active Users
- **Conversion Rate** — End-to-end conversion tracking
- **Event Analytics** — Custom event monitoring
- **KPI Monitoring** — Key performance indicators at a glance

### 🔽 Funnel Analysis
Track user journeys across multi-step flows:
```
Signup  →  Activate  →  Purchase
```
- Step-wise user breakdown
- Drop-off identification
- Conversion rate per stage

### 🔁 Retention Analytics
- Cohort-based retention analysis
- Weekly retention heatmaps
- User engagement trend monitoring

### 🧩 Feature Adoption
- Feature usage analytics & adoption percentages
- Most/least used feature identification
- User interaction tracking per feature

### 🧪 A/B Testing & Experimentation
- Create and manage experiments with multiple variants
- Conversion measurement per variant
- Statistical significance calculation
- Automatic winner identification

### 📁 CSV Data Ingestion
- Drag & drop CSV upload
- Automated event processing
- Per-user dataset management

---

## 🏗️ Architecture

```
┌────────────────────────────────┐
│        React Frontend          │
│     Vite · TypeScript · UI     │
└──────────────┬─────────────────┘
               │  REST API
               ▼
┌────────────────────────────────┐
│       Express Backend          │
│  JWT Auth · REST APIs · Multer │
└──────────────┬─────────────────┘
               │  Mongoose ODM
               ▼
┌────────────────────────────────┐
│         MongoDB Atlas          │
│  Users · Events · Experiments  │
└────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| **Backend** | Node.js, Express.js, JWT, Multer, CSV Parser |
| **Database** | MongoDB Atlas via Mongoose ODM |
| **Testing** | Jest, Supertest |
| **Icons** | Lucide React |
| **Routing** | React Router DOM |

---

## 📂 Project Structure

```
ProductPulse/
├── client/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level page components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Utility functions
│       └── styles/           # Global styles
│
└── server/
    ├── models/
    │   ├── User.js
    │   ├── Event.js
    │   ├── Upload.js
    │   └── Experiment.js
    ├── routes/
    │   ├── auth.js
    │   ├── analytics.js
    │   ├── upload.js
    │   ├── events.js
    │   └── experiments.js
    ├── middleware/           # Auth & error middleware
    ├── tests/               # Jest + Supertest test suites
    └── server.js
```

---

## 🗄️ Data Models

<details>
<summary><strong>User</strong></summary>

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "bcrypt_hash",
  "role": "analyst"
}
```
</details>

<details>
<summary><strong>Event</strong></summary>

```json
{
  "_id": "ObjectId",
  "userId": "123",
  "event": "signup",
  "timestamp": "2026-06-20T00:00:00Z",
  "properties": {},
  "ownerId": "ObjectId"
}
```
</details>

<details>
<summary><strong>Upload</strong></summary>

```json
{
  "_id": "ObjectId",
  "fileName": "events_june.csv",
  "rows": 500,
  "ownerId": "ObjectId",
  "createdAt": "2026-06-20T00:00:00Z"
}
```
</details>

<details>
<summary><strong>Experiment</strong></summary>

```json
{
  "_id": "ObjectId",
  "name": "Homepage CTA Test",
  "status": "running",
  "variants": [{ "name": "Control" }, { "name": "Variant A" }]
}
```
</details>

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get authenticated user info |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/kpis` | DAU, MAU, conversion rate, total events |
| `GET` | `/api/analytics/funnel` | Funnel step breakdown & conversion rates |
| `GET` | `/api/analytics/retention` | Cohort retention matrix |
| `GET` | `/api/analytics/features` | Feature adoption & usage stats |

### Experiments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/experiments` | List all experiments |
| `POST` | `/api/experiments` | Create a new experiment |
| `PATCH` | `/api/experiments/:id` | Update experiment |
| `DELETE` | `/api/experiments/:id` | Delete experiment |

### Events & Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/events` | Ingest a new event |
| `POST` | `/api/upload/csv` | Upload CSV event data |
| `GET` | `/api/upload/history` | View upload history |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ProductPulse.git
cd ProductPulse
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Start the Backend

```bash
cd server
npm install
npm run dev
```

> Server runs at `http://localhost:5000`

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
```

> App runs at `http://localhost:5173`

---

## 🧪 Testing

ProductPulse includes a full API test suite powered by **Jest** and **Supertest**.

```bash
cd server
npm test
```

### Test Coverage

| Test Suite | Status |
|---|---|
| Authentication API | ✅ Passing |
| KPI Analytics API | ✅ Passing |
| Funnel API | ✅ Passing |
| Retention API | ✅ Passing |
| Feature Adoption API | ✅ Passing |
| Experiments API | ✅ Passing |

```
Test Suites: 5 passed, 5 total
Tests:       5 passed, 5 total
```

---

## 🗺️ Roadmap

- [ ] AI-powered insights engine
- [ ] Real-time event streaming
- [ ] Predictive user behavior modeling
- [ ] Multi-tenant organization support
- [ ] Team collaboration & permissions
- [ ] Advanced experimentation (multi-armed bandit)
- [ ] Scheduled email reports
- [ ] Data export (CSV / PDF)

---

## 👨‍💻 Author

**Swayam Sankar Nayak**  
B.Tech Computer Science Engineering  
Full-Stack Developer · Product Analytics · React · Node.js · MongoDB

---

<div align="center">

⭐ **If you found ProductPulse useful, consider giving it a star!** ⭐

</div>
