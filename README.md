# Life Stream – Blood Donation Management System

Life Stream is a full-stack web application for managing blood donations, requests, and approvals across hospitals and users in Sri Lanka.

**Note: This project is configured for local development only.**

## Features

- User registration, login, and profile management
- Blood donation submission and history
- Blood request submission and tracking
- Hospital dashboard for donor/recipient approvals
- Admin dashboard for user/hospital management
- Informational pages (About, Contact, Landing)
- Responsive UI built with React, Tailwind CSS, and Vite
- RESTful backend API with Express, PostgreSQL, and session-based authentication

---

## Quick Start

For detailed setup instructions, see [LOCAL_SETUP.md](LOCAL_SETUP.md).

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/life-stream.git
cd life-stream
```

### 2. Install Dependencies

#### Frontend

```sh
npm install
```

#### Backend

```sh
cd backend
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the `backend/` directory with your PostgreSQL credentials:

```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_NAME=your_db_name
DB_PORT=5432
SESSION_SECRET=your_secret_key
```

---

### 4. Database Setup

Create the required tables in your PostgreSQL database. Example schema:

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  blood_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hospital Users
CREATE TABLE hospital_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  location TEXT
);

-- Admins
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
);

-- Donations
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT,
  email TEXT,
  blood_type TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blood Requests
CREATE TABLE blood_requests (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  blood_type TEXT,
  location TEXT,
  urgency BOOLEAN,
  status TEXT DEFAULT 'pending',
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 5. Seed Admin/Hospital Accounts

Run the backend scripts to create initial admin/hospital accounts:

```sh
# Admin (from backend/scripts/hashAdmin.cjs)
node backend/scripts/hashAdmin.cjs

# Hospital (from backend/scripts/hash-hospital-password.js)
node backend/scripts/hash-hospital-password.js
```

---

### 6. Running the Backend

```sh
cd backend

node index.js
```

The backend runs on [http://localhost:5000](http://localhost:5000).

---

### 7. Running the Frontend

```sh
npm run client
```

The frontend runs on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Project Structure

```
.env
.gitignore
index.html
package.json
README.md
tailwind.config.js
vite.config.js
backend/
  index.js
  package.json
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
public/
src/
  App.jsx
  main.jsx
  components/
  pages/
  admin/
  hospital/
```

---

## Useful Scripts

- **Frontend:**

  - `npm run dev` – Start development server
  - `npm run build` – Build for production
  - `npm run lint` – Run ESLint

- **Backend:**
  - `npm start` – Start backend server
  - `node scripts/hashAdmin.cjs` – Seed admin
  - `node scripts/hash-hospital-password.js` – Seed hospital

---

## API Endpoints

- `/api/auth/register` – User registration
- `/api/auth/login` – User login
- `/api/donation` – Submit donation
- `/api/donation/user/:email` – Get user donations
- `/api/blood/request` – Submit blood request
- `/api/blood/pending` – Get pending blood requests
- `/api/hospital/login` – Hospital login
- `/api/hospital/donations/pending` – Hospital pending donations
- `/api/recipient/pending` – Hospital pending recipient requests
- `/api/admin/login` – Admin login
- `/api/admin/users` – Admin user management
- `/api/admin/hospitals` – Admin hospital management

---

## Environment Notes

- **Frontend:** Uses Vite + React + Tailwind CSS
- **Backend:** Uses Express + PostgreSQL + session-based auth
- **CORS:** Configured for production frontend URL in backend/index.js

---

## License

MIT

---

## Support

For help, contact [support@bloodlink.com](mailto:support@bloodlink.com) or open an issue.
