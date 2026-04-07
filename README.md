# ⚙️ RawMart — B2B Raw Material Marketplace

> A production-grade B2B ecommerce platform for sourcing raw materials directly from verified manufacturers across India.


[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green)](https://mongodb.com/)

---

## 🏭 What is RawMart?

RawMart connects **industrial buyers** (factories, manufacturers) with **raw material suppliers** for bulk B2B transactions. Key differentiators from standard ecommerce:

- **Bulk tiered pricing** — price per unit drops at 500kg, 1000kg, 5000kg thresholds
- **RFQ system** — buyers post requirements, multiple sellers bid competitively  
- **GST-compliant orders** — auto-calculated tax with proper invoice generation
- **Role-based access** — Buyer / Seller / Admin with different permissions
- **Multi-level order tracking** — full status history audit trail

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + JSX | Component model, fast dev |
| Backend | Node.js + Express + **TypeScript** | Type safety, self-documenting |
| Database | MongoDB + Mongoose | Flexible schema for varied product specs |
| Auth | JWT + bcrypt | Stateless, scalable |
| Testing | Jest + Supertest + Cypress | Unit → Integration → E2E |
| CI/CD | GitHub Actions | Automated lint + test + deploy |
| Deployment | AWS EC2 + PM2 + Nginx | Production-grade hosting |
| Code Quality | ESLint + Prettier | Enforced in PR checks |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (or Docker)

### 1. Clone & setup
```bash
git clone https://github.com/YOUR_USERNAME/rawmart.git
cd rawmart
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure environment
```bash
cp backend-ts/.env.example backend-ts/.env
# Edit backend-ts/.env with your MongoDB URI
```

### 3. Start with Docker (easiest)
```bash
docker-compose up -d        # Start MongoDB
npm run dev                 # Start backend + frontend
```

### 4. Open in browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB GUI: http://localhost:8081

---

## 🧪 Running Tests

```bash
# All tests
npm test

# Backend unit tests only
cd backend-ts && npm run test:unit

# Backend integration tests
cd backend-ts && npm run test:integration

# Frontend tests
cd frontend && npm run test:ci

# E2E tests (requires running app)
npx cypress open
```

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register buyer/seller |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List with filters |
| GET | `/api/products/:id` | Public | Product detail |
| GET | `/api/products/:id/price?qty=500` | Public | Get bulk price |
| POST | `/api/products` | Seller | Create product |
| PUT | `/api/products/:id` | Seller | Update product |
| DELETE | `/api/products/:id` | Seller | Deactivate product |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Buyer | Place order |
| GET | `/api/orders/my` | Private | My orders |
| GET | `/api/orders/:id` | Private | Order detail |
| PATCH | `/api/orders/:id/status` | Seller | Update status |

### RFQ
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/rfq` | Private | List RFQs |
| POST | `/api/rfq` | Buyer | Post RFQ |
| POST | `/api/rfq/:id/quote` | Seller | Submit quote |

---

## 🏗 Architecture

```
Browser (React)
      │  HTTP/JSON
      ▼
Express API (TypeScript)
  ├── Middleware (JWT auth, rate limiting, CORS, helmet)
  ├── Controllers (business logic)
  ├── Models (Mongoose + TypeScript interfaces)
  └── Shared Types (/shared/types — used by frontend too)
      │  Mongoose ODM
      ▼
MongoDB
      │
      ◄── GitHub Actions CI/CD ──► AWS EC2
```

---

## 🔐 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/rawmart
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

---

## 📁 Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for detailed breakdown.

---

## 👨‍💻 Author

**[Isha Singh]** — Second Year B.Tech, [Newton School of Technology]  
[https://www.linkedin.com/in/isha-singh-045212348/] | [https://github.com/Ishiezz]
