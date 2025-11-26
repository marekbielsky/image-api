# 🖼️ Image API

[![CI](https://github.com/marekbielsky/image-api/actions/workflows/ci.yml/badge.svg)](https://github.com/marekbielsky/image-api/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-24.11.1_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-ea2845?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?logo=swagger&logoColor=black)](http://localhost:3000/docs)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A **NestJS-based REST API** for uploading and serving images.  
Built with **Prisma**, **PostgreSQL**, **Docker**, **Swagger**, and **GitHub Actions CI** for automated testing and linting.

---

## 🚀 Features

- ⚙️ **NestJS** (latest LTS)
- 🗄️ **Prisma ORM** with PostgreSQL
- 🐳 **Dockerized environment** (API + DB + Adminer)
- 🧭 **Swagger UI** auto-generated API documentation
- 🧹 **ESLint + Prettier** for code quality
- 🧪 **Jest testing** ready (with `--passWithNoTests` for initial setup)
- 🤖 **GitHub Actions CI** pipeline (lint → test → build)
- 🔧 CI and Docker integration ready for deployment pipelines

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
