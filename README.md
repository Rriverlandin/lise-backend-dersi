# Student Management System

A full-stack student management project built with **TypeScript**, **Express 5**, **MongoDB**, and **Mongoose**. The application combines a layered REST API with a responsive browser-based dashboard for managing student records.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="ISC License" />
</p>

## Overview

This repository was created as a backend development learning project and has grown into a structured student management application. It demonstrates practical backend concepts such as RESTful API design, layered architecture, validation, database modeling, error handling, testing, health checks, and environment-based configuration.

The main application is located in [`Backend/ogrenci-api`](./Backend/ogrenci-api).

## Features

- Create, read, update, and soft-delete student records
- Responsive browser-based management dashboard
- Search and filter students by class and grade
- Sorting and pagination support
- Student, class, and average-grade statistics
- Request validation with **Zod**
- MongoDB persistence through **Mongoose**
- Case-insensitive student uniqueness rules
- Soft-delete-compatible partial unique indexes
- Centralized error handling
- Configurable JSON logging
- Application liveness and database readiness endpoints
- Automated tests using Node.js' built-in test runner
- Type checking and production builds with TypeScript
- GitHub Actions support for automated project checks

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **TypeScript** | Type-safe application development |
| **Node.js 20+** | JavaScript runtime |
| **Express 5** | HTTP server and REST API |
| **MongoDB** | Database |
| **Mongoose** | MongoDB object modeling |
| **Zod** | Request and input validation |
| **tsx** | TypeScript development runtime |
| **Node Test Runner** | Automated testing |
| **HTML / CSS / JavaScript** | Management dashboard |

## Architecture

The backend follows a layered architecture that keeps HTTP concerns, business logic, and database access separated.

```text
Request
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB
```

This structure makes the project easier to test, maintain, and extend as new features are added.

## Project Structure

```text
lise-backend-dersi/
├── Backend/
│   └── ogrenci-api/
│       ├── public/             # Browser-based management interface
│       │   ├── index.html
│       │   ├── styles.css
│       │   └── app.js
│       ├── src/
│       │   ├── config/         # Environment and database configuration
│       │   ├── controllers/    # HTTP request/response handling
│       │   ├── mappers/        # Database model → API DTO conversion
│       │   ├── middleware/     # Logging, validation, error handling
│       │   ├── models/         # Mongoose schemas and indexes
│       │   ├── repositories/   # Database access layer
│       │   ├── routes/         # REST API routes
│       │   ├── schemas/        # Zod validation schemas
│       │   ├── scripts/        # Maintenance scripts
│       │   ├── services/       # Business logic
│       │   └── types/          # Shared TypeScript types
│       ├── tests/              # Automated tests
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
├── hafta_1/                    # Earlier course exercises
├── package.json                # Root workspace commands
└── README.md
```

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- **Node.js 20 or newer**
- **npm**
- A running **MongoDB** instance

### Installation

```bash
git clone https://github.com/Rriverlandin/lise-backend-dersi.git
cd lise-backend-dersi/Backend/ogrenci-api
npm ci
cp .env.example .env
npm run dev
```

The application runs on:

```text
http://localhost:3000
```

Opening this address in a browser displays the student management dashboard.

## Environment Variables

| Variable | Required | Default | Description |
| --- | ---: | --- | --- |
| `MONGODB_URL` | Yes | — | MongoDB connection string |
| `PORT` | No | `3000` | HTTP server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `LOG_LEVEL` | No | `info` | Logging level |

Example:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/ogrenci-api
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## API Endpoints

Student API base path:

```text
/api/v1/ogrenciler
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Application liveness check |
| `GET` | `/health/ready` | MongoDB readiness check |
| `GET` | `/api/v1/ogrenciler` | List students |
| `GET` | `/api/v1/ogrenciler/:id` | Get a student by ID |
| `POST` | `/api/v1/ogrenciler` | Create a student |
| `PATCH` | `/api/v1/ogrenciler/:id` | Partially update a student |
| `DELETE` | `/api/v1/ogrenciler/:id` | Soft-delete a student |

### Query Parameters

The student list endpoint supports:

- `sinif` — filter by class
- `minNot` — minimum grade average
- `siralama` — field used for sorting
- `yon` — sort direction
- `sayfa` — page number
- `limit` — records per page, up to 100

Example:

```bash
curl "http://localhost:3000/api/v1/ogrenciler?sinif=11-A&minNot=70&siralama=notOrtalamasi&yon=desc&sayfa=1&limit=20"
```

### Create a Student

```bash
curl -X POST http://localhost:3000/api/v1/ogrenciler \
  -H "Content-Type: application/json" \
  -d '{
    "ad": "Ada",
    "soyad": "Lovelace",
    "yas": 17,
    "sinif": "11-A",
    "okul": "Science High School",
    "notOrtalamasi": 95,
    "email": "ada@example.com"
  }'
```

## Available Commands

Commands can be executed from the repository root:

```bash
npm run dev
npm run build
npm run typecheck
npm test
npm run check
npm start
npm run db:sync-indexes
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Compile the TypeScript project |
| `npm run typecheck` | Run TypeScript checks without emitting files |
| `npm test` | Build and run the automated tests |
| `npm run check` | Run type checking, build, and tests |
| `npm start` | Start the compiled application |
| `npm run db:sync-indexes` | Synchronize Mongoose indexes with MongoDB |

## Testing

Run the complete verification pipeline with:

```bash
npm run check
```

This validates the TypeScript code, performs a clean build, and runs the automated test suite.

## Health Checks

The project exposes two health endpoints that can be useful for deployments and monitoring systems:

```text
GET /health
GET /health/ready
```

`/health` checks whether the application is alive, while `/health/ready` also verifies database readiness.

## Security Note

This project is designed primarily for learning and portfolio use. Before deploying it as a public production system, additional protections should be implemented, including authentication, authorization, rate limiting, restricted CORS origins, and managed secrets.

## Learning Goals

This repository documents my progress while learning backend development and applying concepts in a real project rather than isolated examples. The goal is to progressively improve the codebase with stronger architecture, testing, database design, API practices, and production-oriented development habits.

## License

This project is licensed under the [ISC License](./LICENSE).

---

<p align="center">
  Built as part of an ongoing backend development learning journey.
</p>
