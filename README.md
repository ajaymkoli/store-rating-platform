# Multi-Role Store Rating Platform

A robust full-stack application built for a technical internship assignment. This platform includes a centralized login system with Role-Based Access Control (RBAC) for:

- `SYSTEM_ADMIN`
- `NORMAL_USER`
- `STORE_OWNER`

---

## 🚀 Key Features

### 1. System Administrator Dashboard

- Real-time analytics for total users, stores, and ratings
- User management (create/manage System Admins, Store Owners, Normal Users)
- Store management (add / edit stores)
- Advanced data table features:
  - Search users/stores
  - Filter by Name, Email, Address, Role
  - Sort columns (asc/desc)

### 2. Normal User Experience

- Browse stores through searchable grid
- Submit 1-5 star ratings
- Update ratings using PostgreSQL UPSERT behavior
- View personal rating with store-level average

### 3. Store Owner Analytics

- Store performance overview with average rating (1 decimal)
- Reviewer detail table including user contact and score

---

## 🛠️ Tech Stack

- Frontend: React (Vite), React Router, Axios, jwt-decode
- Backend: Node.js, Express
- Database: PostgreSQL
- Security: JWT auth, Bcrypt password hashing

---

## 🛡️ Validation Rules

- Name: 20–60 chars
- Password: 8–16 chars, 1 uppercase, 1 special char
- Address: max 400 chars
- Ratings: integer between 1 and 5

---

## 📦 Installation & Setup

### Prerequisites

- Node.js v16+
- PostgreSQL

### 1. Database Configuration

Create `store_rating_db` and run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id)
);
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=store_rating_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

Start server:

```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access:

- `http://localhost:5173`

> Note: for first admin access, promote a registered user to `SYSTEM_ADMIN` via SQL.
