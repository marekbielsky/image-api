# 🖼️ Image API

[![CI](https://github.com/marekbielsky/image-api/actions/workflows/ci.yml/badge.svg)](https://github.com/marekbielsky/image-api/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-24.11.1_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-ea2845?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?logo=swagger&logoColor=black)](http://localhost:3000/docs)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A **NestJS-based REST API** for uploading, resizing, and serving images.  
Built with **Prisma**, **PostgreSQL**, **Docker**, **Swagger**, and **GitHub Actions CI** for automated linting, testing, and type checking.

---

## 🚀 Features

- ⚙️ **NestJS** (latest LTS)
- 🗄️ **Prisma ORM** with PostgreSQL
- 🐳 **Dockerized environment** (API + DB + Adminer)
- 🧭 **Swagger UI** auto-generated API documentation  
  _→ available at [http://localhost:3000/docs](http://localhost:3000/docs) after container startup_
- 🧹 **ESLint + Prettier** for consistent code quality
- 🧪 **Unit testing** with Jest (`services`, `repositories`, and `controllers`)
- 🤖 **GitHub Actions CI** (lint → test → typecheck → build)
- 🔧 **Type checking** scripts for runtime and test code
- ☁️ **AWS S3 integration** for file uploads

---

## 🧰 Requirements

- **Node.js** → `v24.11.1 (LTS)`
- **npm** → `>= 10`
- **Docker** & **Docker Compose**

---

## ⚙️ Setup

### 1️⃣ Clone & install dependencies

```bash
git clone https://github.com/marekbielsky/image-api.git
cd image-api
npm install
```

### 2️⃣ Environment configuration

Create your local `.env` file based on the provided example:

```bash
cp .env.example .env
```

Then update AWS and database settings as needed.

## 🐳 Docker Commands

| Command | Description |
|----------|-------------|
| `npm run docker:up` | Start containers in detached mode |
| `npm run docker:down` | Stop and remove containers |
| `npm run docker:rebuild` | Rebuild API image (quick rebuild) |
| `npm run docker:rebuild:full` | Full rebuild (clear cache & volumes) |

After startup, you can access:

- **API** → [http://localhost:3000](http://localhost:3000)
- **Swagger docs** → [http://localhost:3000/docs](http://localhost:3000/docs)
- **Adminer (PostgreSQL UI)** → [http://localhost:8080](http://localhost:8080)

## 🧪 Testing & Type Checking

| Command | Description |
|----------|-------------|
| `npm test` | Run all Jest unit tests |
| `npm run typecheck` | Validate source TypeScript types |
| `npm run typecheck:test` | Validate test files only |

> 🧠 **Note:** CI is configured to fail automatically on any type or linting errors.

## 🧩 Architecture Overview

```bash
src/
├── common/       # shared decorators, utils, types
├── health/       # app health check module
├── images/       # core business logic (controllers, services, repository)
├── prisma/       # Prisma service and schema
├── s3/           # AWS S3 integration layer
└── main.ts       # application bootstrap
```

- Controllers → expose REST API endpoints

- Services → contain main business logic

- Repositories → interact with Prisma (database layer)

- DTOs / Types → define data contracts & Swagger docs

## 📦 Endpoints

### **Upload Image**
`POST /images`
- Uploads and resizes an image
- Stores metadata in the database and file in S3

---

### **Get All Images**
`GET /images?title={query}&page=1&limit=10`
- Returns a paginated list of images
- Supports optional filtering by `title`

---

### **Get Single Image**
`GET /images/:id`
- Returns metadata for a specific image

---

### **Health Checks**
`GET /health`  
`GET /s3/health`
- Application and S3 connection health checks

## 🧾 Review Instructions

This repository is ready for review and can be shared:

- **Publicly** via GitHub, or
- **Privately** with reviewers (grant **Read** access)

### Running the project for review:

```bash
npm install
npm run docker:up
```

## 🧾 License

This project is licensed under the [MIT License](./LICENSE).

---

**Author:** [@marekbielsky](https://github.com/marekbielsky)  
Built with ❤️ using **NestJS**, **Prisma**, **Docker**, and **AWS S3**.
