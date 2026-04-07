# 🔒 PERSONAL REVISION FILE — DO NOT PUSH TO GITHUB
# RawMart B2B Marketplace — Interview & Viva Prep
# Student: [Your Name] | College: [Your College] | Year: 4th Year
# ============================================================

---

## 📌 WHAT IS THIS PROJECT?

A full-stack B2B (Business-to-Business) ecommerce platform where:
- **Buyers** (manufacturers, factories) can search and order raw materials in bulk
- **Sellers** (suppliers, distributors) can list materials with tiered pricing
- **Admins** manage users and platform health

Real-world example: A textile factory in Pune ordering cotton bales from a Gujarat supplier directly through the platform, with GST invoice, bulk pricing, and logistics tracking — all without a middleman.

---

## 🏗️ ARCHITECTURE — How the System is Built

```
Browser (React)
     ↓  HTTP/JSON
Express API (Node.js + TypeScript)
     ↓  Mongoose ODM
MongoDB (Database)
     ↑
GitHub Actions CI/CD → AWS EC2 (Deployment)
```

### Why this stack?
- **React** — component-based UI, fast rendering, huge ecosystem
- **Node.js + Express** — same language (JS/TS) across stack, non-blocking I/O good for API servers
- **TypeScript** — catches bugs at compile time, makes code self-documenting
- **MongoDB** — flexible schema good for products with varying specifications (steel has different specs than chemicals)
- **JWT** — stateless auth, scales horizontally (no session store needed)

---

## 🗂️ FOLDER STRUCTURE — What Goes Where & Why

```
rawmart/
├── shared/types/          ← TypeScript interfaces shared by both frontend and backend
│                            Avoids duplication, ensures API contract is consistent
├── backend-ts/src/
│   ├── models/            ← Mongoose schemas + TypeScript interfaces (IUser, IProduct, IOrder)
│   ├── controllers/       ← Business logic — what happens when an API endpoint is hit
│   ├── routes/            ← URL definitions — maps URL + HTTP method to controller
│   ├── middleware/        ← Functions that run BETWEEN request and controller
│   │                        (auth check, error handling)
│   ├── config/            ← DB connection, environment setup
│   └── types/             ← Express type extensions (adding `user` to Request)
├── frontend/src/
│   ├── components/        ← Reusable UI pieces (Button, Navbar, ProductCard)
│   ├── pages/             ← Full page components (one per route)
│   ├── hooks/             ← Custom React hooks (useAuth, useFetch)
│   ├── services/          ← All API calls centralized in one place
│   └── __tests__/         ← Frontend unit tests (Jest + React Testing Library)
├── .github/workflows/     ← CI/CD pipeline definitions (GitHub Actions)
├── scripts/               ← Shell scripts for setup and deployment
└── cypress/e2e/           ← End-to-end test flows (real browser simulation)
```

**Interview answer:** "We followed separation of concerns — every folder has one clear responsibility. Controllers don't touch the DB directly, models don't know about HTTP, and routes just map URLs to functions."

---

## 🔐 AUTHENTICATION — How Login Works Step by Step

1. User submits email + password to `POST /api/auth/login`
2. Server finds user in DB by email (with `.select('+password')` to include hidden field)
3. `bcrypt.compare()` checks entered password against stored hash
4. If valid → `jwt.sign({ id: user._id }, JWT_SECRET)` creates a token
5. Token sent back to frontend → stored in `localStorage`
6. Every subsequent request sends `Authorization: Bearer <token>` header
7. `protect` middleware verifies token with `jwt.verify()` and attaches user to `req.user`
8. `authorize('seller')` middleware checks `req.user.role` before sensitive routes

**Why JWT over sessions?**
- Stateless — server doesn't need to store sessions
- Works across multiple servers (horizontal scaling)
- Token contains user ID and role — no DB lookup needed for auth check

**Why bcrypt?**
- One-way hash — even if DB is stolen, passwords can't be reversed
- Salt rounds (12) make brute-force attacks slow

---

## 💰 BULK PRICING LOGIC — The Core Business Feature

Every product can have **price tiers**:
```
1–499 kg    → ₹75/kg
500–999 kg  → ₹68/kg   (9% discount)
1000+ kg    → ₹58/kg   (22% discount)
```

**How it works in code:**
```typescript
getPriceForQty(qty: number): number {
  const matchingTier = this.priceTiers
    .filter(t => qty >= t.minQty && (!t.maxQty || qty <= t.maxQty))
    .sort((a, b) => b.minQty - a.minQty)[0]; // highest matching tier wins
  return matchingTier ? matchingTier.pricePerUnit : this.basePrice;
}
```

**Interview answer:** "We implemented tiered pricing as an array of `PriceTier` objects on the Product document. The `getPriceForQty()` instance method filters tiers where quantity falls within the range, then picks the most specific (highest minQty) match. This is a Mongoose instance method defined on the schema."

---

## 📋 RFQ (Request for Quotation) — What It Is

A buyer can say: *"I need 5 tonnes of copper wire by March 31, budget ₹400/kg"*
Multiple sellers can then submit competitive quotes/bids.
Buyer picks the best offer → becomes an order.

**Why RFQ?**
- For large orders, buyers don't want fixed prices — they want to negotiate
- Very common in industrial B2B — this is how steel, chemicals, construction materials are actually bought in India
- Differentiates this project from a regular ecommerce site

---

## 🔄 ORDER LIFECYCLE — Status Flow

```
pending → confirmed → processing → shipped → delivered
    ↘ cancelled (any stage by admin)
```

- `pending` — buyer placed order, waiting for seller
- `confirmed` — seller accepted
- `processing` — being packed/prepared
- `shipped` — dispatched, tracking number added
- `delivered` — received, payment marked `paid`

**Status history** is stored as an array on the order:
```json
"statusHistory": [
  { "status": "pending",   "timestamp": "...", "note": "Order placed" },
  { "status": "confirmed", "timestamp": "...", "note": "Accepted by seller" }
]
```
This gives a full audit trail — important for disputes and compliance.

---

## 🧪 TESTING STRATEGY — 3 Layers

### Layer 1: Unit Tests (Jest)
- Test individual functions/methods **in isolation**
- DB is mocked with `mongodb-memory-server` (in-memory DB, no real MongoDB needed)
- Examples:
  - `getPriceForQty()` returns correct tier price
  - `matchPassword()` returns true/false correctly
  - User model rejects invalid email formats
  - Password is hashed before saving

**Why unit tests?**
- Fast (milliseconds each)
- Catch logic bugs early
- Can run without any infrastructure

### Layer 2: Integration Tests (Jest + Supertest)
- Test **API endpoints** — real HTTP request → controller → model → response
- Still uses `mongodb-memory-server` (no real DB, but real Mongoose queries)
- Examples:
  - `POST /api/auth/register` creates user and returns token
  - `POST /api/products` fails with 403 if user is a buyer
  - `GET /api/products/:id/price?qty=1000` returns bulk price

**Why integration tests?**
- Validates the whole chain: route → middleware → controller → DB
- Catches bugs that unit tests miss (e.g., middleware not applied to route)

### Layer 3: E2E Tests (Cypress) — Bonus
- Runs a **real browser**, simulates real user clicking
- Examples:
  - User visits site → clicks Register → fills form → lands on products page
  - Buyer searches for steel → opens product → enters quantity → places order
  - Seller logs in → sees new order → clicks Confirm

**Why E2E?**
- Catches bugs that only appear in the browser (CSS issues, JS errors)
- Closest thing to real user testing
- Adds significant weight in evaluation

---

## ⚙️ CI/CD PIPELINE — GitHub Actions

### What happens on every `git push`:
```
1. GitHub detects push
2. Spins up Ubuntu runner (virtual machine)
3. Checks out code
4. Installs Node.js 20
5. npm install (backend + frontend)
6. ESLint runs → fails pipeline if bad code
7. TypeScript compiler runs → fails if type errors
8. Jest unit tests run → fails if any test fails
9. Jest integration tests run
10. React frontend build → fails if broken
11. ✅ All green → pipeline passes
```

### What happens on Pull Request:
```
Same pipeline PLUS:
- PR is blocked from merging if lint or tests fail
- Reviewer can see test results directly in GitHub
```

### What happens on merge to main:
```
1. All above checks pass
2. GitHub Actions SSH into AWS EC2
3. Runs deploy.sh script on server
4. Script pulls latest code, reinstalls deps, restarts app
5. App is live with new changes
```

**Interview answer:** "We set up three workflow files — `ci.yml` for push/PR checks, `deploy.yml` for EC2 deployment, and `pr-check.yml` specifically for linting PRs. The deploy uses GitHub Secrets to store the EC2 SSH key securely — it's never in the code."

---

## 🖥️ AWS EC2 DEPLOYMENT — How It Works

1. EC2 instance (Ubuntu) running Node.js
2. App managed by **PM2** (process manager — auto-restarts on crash)
3. **Nginx** as reverse proxy (EC2:80 → localhost:5000)
4. GitHub Actions SSHs into EC2 using a private key stored in GitHub Secrets
5. Runs `deploy.sh` which:
   - `git pull origin main`
   - `npm install --production`
   - `npm run build` (TypeScript compile)
   - `pm2 restart rawmart`

**Idempotent script example:**
```bash
# BAD — fails if directory exists
mkdir project

# GOOD — same result every time, never fails
mkdir -p project

# BAD — fails if already installed
npm install -g pm2

# GOOD — idempotent
which pm2 || npm install -g pm2
```

**Interview answer:** "Idempotent means running the script 10 times gives the same result as running it once. This is critical in deployment — if the server crashes mid-deploy and restarts, the script should safely resume without breaking anything."

---

## 🔧 TYPESCRIPT — Why We Used It

**JS without TypeScript:**
```javascript
function createOrder(items, buyer) {
  // items could be anything — array? object? string?
  // No way to know without reading all callers
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
}
```

**With TypeScript:**
```typescript
interface OrderItem { productId: string; quantity: number; }

function createOrder(items: OrderItem[], buyer: string): Promise<IOrder> {
  // TypeScript guarantees items is OrderItem[]
  // Editor shows autocomplete, catches typos instantly
}
```

**Key concepts used:**
- `interface` — defines shape of objects (IUser, IProduct, IOrder)
- `type` — defines unions (`UserRole = 'buyer' | 'seller' | 'admin'`)
- `DTO` (Data Transfer Object) — typed shape of data crossing API boundary
- `generic types` — `Request<Params, ResBody, ReqBody, Query>`
- `declare global` — extending Express Request type to add `req.user`
- `strict mode` — strictest TypeScript settings, catches most bugs

---

## 📦 DEPENDABOT — Auto Dependency Updates

File: `.github/dependabot.yml`

- Automatically opens Pull Requests when npm packages have new versions
- Runs weekly (configurable)
- Each PR triggers CI — if tests pass, safe to merge
- Keeps project secure (patches CVEs automatically)

---

## 🔍 LINTING — Code Quality Gates

**ESLint** catches:
- Unused variables
- Missing semicolons
- `var` instead of `const`/`let`
- Implicit `any` types (TypeScript rule)
- Floating promises (async bugs)

**Prettier** formats:
- Consistent indentation (2 spaces)
- Consistent quotes (single quotes)
- Trailing commas

**How it's enforced:**
- Pre-commit: runs automatically before every commit
- PR check: GitHub Actions runs `npm run lint` — PR blocked if it fails

---

## 🎯 ROLE-BASED ACCESS CONTROL (RBAC)

| Action | Buyer | Seller | Admin |
|--------|-------|--------|-------|
| Browse products | ✅ | ✅ | ✅ |
| Place order | ✅ | ❌ | ✅ |
| Create product | ❌ | ✅ | ✅ |
| Confirm order | ❌ | ✅ | ✅ |
| Post RFQ | ✅ | ❌ | ✅ |
| Submit quote | ❌ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |

Implemented via `authorize('buyer')`, `authorize('seller')` middleware on routes.

---

## 💡 DESIGN DECISIONS — What & Why

| Decision | What We Did | Why |
|----------|-------------|-----|
| Database | MongoDB | Products have varying specs (steel ≠ chemicals), flexible schema suits this |
| Auth | JWT, not sessions | Stateless, scales without sticky sessions |
| Password | bcrypt salt 12 | Balance of security vs. speed |
| Soft delete | `isActive: false` | Preserve order history (can't delete product that has orders) |
| Shared types | `/shared/types/` folder | Single source of truth for frontend + backend API contract |
| Tiers on product | Array of PriceTier | Simple, query-free, calculated in app layer |
| Status history | Array on Order | Full audit trail for disputes, no separate table needed |
| Error middleware | Centralized handler | Consistent error format, no try-catch duplication |

---

## ❓ EXPECTED INTERVIEW QUESTIONS & ANSWERS

**Q: What is the difference between unit and integration testing?**
A: Unit tests test a single function/method in isolation — dependencies are mocked. Integration tests test how multiple components work together — like testing an API endpoint that hits a real (in-memory) database. Unit tests are faster; integration tests give more confidence.

**Q: What is middleware in Express?**
A: A function that runs between the HTTP request arriving and the route handler executing. It has access to `req`, `res`, and `next()`. We use it for: JWT authentication (`protect`), role checking (`authorize`), error handling, and request logging.

**Q: What does `req.user` mean and how does it work?**
A: After `protect` middleware verifies the JWT, it fetches the user from DB and attaches them to `req.user`. All subsequent middleware and controllers can access the logged-in user through `req.user` without hitting the DB again. In TypeScript, we extend the Express `Request` type using a declaration file (`express.d.ts`) to make this type-safe.

**Q: Why TypeScript over JavaScript?**
A: TypeScript catches bugs at compile time that would only appear at runtime in JavaScript. It also makes the code self-documenting — you can see exactly what shape of data a function expects and returns. Our shared type definitions between frontend and backend prevent mismatches in API contracts.

**Q: What is idempotency? Give an example from your project.**
A: An operation is idempotent if running it multiple times produces the same result as running it once. In our `deploy.sh`, we use `mkdir -p` instead of `mkdir` — if the folder exists, it doesn't fail. We use `pm2 restart` which works whether the app is running or not.

**Q: How does your CI/CD pipeline work?**
A: On every push, GitHub Actions runs: install → lint → typecheck → unit tests → integration tests → build. On merge to main, it additionally SSHs into our AWS EC2 instance and runs the deploy script. If any step fails, the pipeline stops and merge is blocked.

**Q: What is JWT and how is it different from sessions?**
A: JWT (JSON Web Token) is a self-contained token that holds user data (id, role). The server doesn't store it — it just verifies the signature. Sessions require storing session data on the server (in memory or Redis), creating state. JWT is stateless and scales better across multiple server instances.

**Q: How did you implement bulk pricing?**
A: Each product document has a `priceTiers` array. Each tier has `minQty`, optional `maxQty`, and `pricePerUnit`. The `getPriceForQty()` instance method filters tiers where the quantity falls within the range, sorts by highest minQty match, and returns that tier's price. If no tier matches, it returns `basePrice`.

**Q: What is a DTO?**
A: Data Transfer Object — a typed interface that defines the exact shape of data crossing a system boundary (like an API request body). For example, `CreateOrderDTO` defines exactly what fields a buyer must send when placing an order. Using DTOs with TypeScript means the compiler catches mismatches between what the frontend sends and what the backend expects.

**Q: What is Dependabot?**
A: A GitHub feature configured via `.github/dependabot.yml` that automatically opens Pull Requests when your npm dependencies have new versions available. Since each PR triggers our CI pipeline, we can merge updates safely knowing tests still pass.

---

## 🚀 CHALLENGES FACED (Good to mention in viva)

1. **TypeScript with Mongoose** — Mongoose document types and TypeScript interfaces need careful alignment. Used `Document` extension pattern to type model instances correctly.

2. **Testing without real MongoDB** — Used `mongodb-memory-server` to spin up an in-memory MongoDB for tests. No external DB dependency needed in CI pipeline.

3. **Shared types across projects** — Frontend (React/JSX) and backend (TypeScript) needed to share types without creating circular dependencies. Solved with a `/shared/types` folder at root level.

4. **Multi-seller order validation** — Ensured all items in one order belong to the same seller. Checked seller ID consistency in `createOrder` controller before creating the order.

5. **Idempotent deployment** — Making `deploy.sh` safe to run multiple times required using flags like `mkdir -p`, `|| true`, and `pm2 start || pm2 restart` patterns.

---

## 📊 PROJECT METRICS (Fill in before viva)

- Total files: ___
- Lines of code (backend): ___
- Lines of code (frontend): ___
- Test cases written: ___
- Test coverage: ___%
- API endpoints: 20+
- GitHub commits: ___

---
*Last updated: [Date] | This file is in .gitignore — never push to GitHub*