# Life Stream - Project Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Backend Models](#backend-models)
4. [Backend Controllers](#backend-controllers)
5. [Frontend Views/Pages](#frontend-viewspages)
6. [Database Schema](#database-schema)
7. [API Routes](#api-routes)
8. [Authentication & Authorization](#authentication--authorization)

## Project Overview

Life Stream is a comprehensive blood donation management system built with a **MERN stack** (MySQL, Express.js, React.js, Node.js). The application serves three main user types:

- **Regular Users**: Can donate blood and request blood
- **Hospitals**: Manage blood inventory, approve donations, handle blood requests
- **Administrators**: Oversee the entire system, manage users and hospitals

## Architecture Pattern

The project follows a **Model-View-Controller (MVC)** pattern with a clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│   (React.js)    │◄──►│   (Express.js)   │◄──►│    (PSQL)      │
│   Views/Pages   │    │   Controllers    │    │     Tables      │
│   Components    │    │   Models         │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Backend Models

Models handle all database operations and business logic. Each model corresponds to a specific database table and provides CRUD operations.

### 1. User Model (`UserModel.js`)

Manages user authentication and profile operations.

```javascript
// backend/models/UserModel.js
export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, name, blood_type AS blood_group, created_at FROM ${TABLE} WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function updateUserProfile(email, name, bloodType) {
  await pool.query(
    `UPDATE ${TABLE} SET name = $1, blood_type = $2 WHERE email = $3`,
    [name, bloodType, email]
  );
}
```

**Key Functions:**

- `getUserByEmail()` - Retrieve user profile information
- `updateUserProfile()` - Update user name and blood type
- `updatePassword()` - Change user password with bcrypt hashing
- `listUsers()` - Admin function to list all users with pagination

### 2. Blood Inventory Model (`BloodInventoryModel.js`)

Manages hospital blood inventory operations.

```javascript
// Create a new blood unit in inventory
createBloodUnit: async (data) => {
  const {
    donationId,
    bloodType,
    donorName,
    donorEmail,
    hospitalId,
    expiryDate,
    status = "Available",
  } = data;
  const result = await pool.query(
    `INSERT INTO blood_inventory (donation_id, blood_type, donor_name, donor_email, hospital_id, expiry_date, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
    [
      donationId,
      bloodType,
      donorName,
      donorEmail,
      hospitalId,
      expiryDate,
      status,
    ]
  );
  return result.rows[0];
};
```

**Key Functions:**

- `createBloodUnit()` - Add blood units to hospital inventory
- `getHospitalInventory()` - Retrieve inventory with filters (blood type, status, expiry)
- `getInventorySummary()` - Get summary statistics by blood type
- `updateBloodUnitStatus()` - Mark units as used/expired
- `markExpiredUnits()` - Automatically expire old blood units

### 3. Blood Request Model (`BloodRequestModel.js`)

Handles blood requests from recipients.

```javascript
createRequest: async (data) => {
  const { name, email, blood_type, location, urgency } = data;
  const result = await db.query(
    `INSERT INTO blood_requests (name, email, blood_type, location, urgency)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, blood_type, location, urgency]
  );
  return result.rows[0];
};
```

**Key Functions:**

- `createRequest()` - Create new blood requests
- `getPendingRequests()` - Get all pending requests
- `getRequestsByEmail()` - Get user's request history
- `updateApprovalStatus()` - Approve/decline requests
- `getHospitalRequests()` - Filter requests for hospitals

### 4. Donation Model (`donationModel.js`)

Manages blood donation submissions and approvals.

```javascript
export const insertDonation = async ({
  userId,
  name,
  email,
  bloodType,
  location,
}) => {
  const query = `
    INSERT INTO donations (user_id, name, email, blood_type, location, status)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  await pool.query(query, [
    userId || null,
    name,
    email,
    bloodType,
    location,
    "Pending",
  ]);
};
```

**Key Functions:**

- `insertDonation()` - Submit new donation applications
- `fetchDonationsByEmail()` - Get user's donation history
- `getPendingDonations()` - Get pending donations for approval
- `updateDonationStatus()` - Approve/decline donations
- `getPendingDonationsForHospital()` - Hospital-specific pending donations

### 5. Donor Request Matching Model (`DonorRequestMatchingModel.js`)

Implements blood compatibility matching algorithm.

```javascript
getBloodCompatibility: () => {
  return {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"], // Universal recipient
  };
};
```

**Key Functions:**

- `getBloodCompatibility()` - Blood type compatibility matrix
- `findCompatibleDonors()` - Match donors to blood requests
- `findPotentialRecipients()` - Match recipients to available donors
- `createDonorRequestMatch()` - Record successful matches

### 6. Hospital Model (`HospitalModel.js`)

Manages hospital authentication and information.

```javascript
export const findHospitalByUsername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM hospital_users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};
```

**Key Functions:**

- `findHospitalByUsername()` - Hospital authentication lookup
- Hospital user management and credentials

## Backend Controllers

Controllers handle HTTP requests and coordinate between models and routes.

### 1. User Controller (`userController.js`)

```javascript
// GET /api/user/profile/:email
export const fetchProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  const { email, name, bloodType } = req.body;
  try {
    await updateUserProfile(email, name, bloodType);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};
```

### 2. Blood Inventory Controller (`bloodInventoryController.js`)

Handles hospital blood inventory management with comprehensive CRUD operations and statistics.

### 3. Blood Request Controller (`bloodRequestController.js`)

Manages blood request lifecycle from creation to fulfillment.

### 4. Donation Controller (`donationController.js`)

Processes donation submissions and approval workflows.

### 5. Auth Controller (`authController.js`)

Handles user registration and login with JWT token generation.

### 6. Admin Controllers

- `adminController.js` - Administrative functions
- `adminUserController.js` - User management
- `adminHospitalController.js` - Hospital management

### 7. Hospital Controllers

- `hospitalAuthController.js` - Hospital authentication
- `hospitalBloodRequestController.js` - Hospital blood request management
- `hospitalToHospitalController.js` - Inter-hospital transfers

## Frontend Views/Pages

The frontend is organized into three main sections: **Public Pages**, **User Dashboard**, **Hospital Dashboard**, and **Admin Dashboard**.

### Public Pages (`src/pages/`)

#### 1. Landing Page (`LandingPage.jsx`)

- Hero section with call-to-action
- Features overview
- Statistics display
- Navigation to registration/login

#### 2. Authentication Pages

- **Login** (`Login.jsx`) - User authentication
- **Register** (`Register.jsx`) - User registration
- **HospitalLogin** (`hospital/pages/HospitalLogin.jsx`) - Hospital authentication
- **AdminLogin** (`admin/pages/AdminLogin.jsx`) - Admin authentication

#### 3. Information Pages

- **About** (`About.jsx`) - Organization information
- **Contact** (`Contact.jsx`) - Contact forms and information

#### 4. Core Functionality Pages

- **Donation** (`Donation.jsx`) - Blood donation submission form
- **FindBlood** (`FindBlood.jsx`) - Blood request submission
- **PendingRequests** (`PendingRequests.jsx`) - View submitted requests

### User Dashboard (`src/pages/`)

#### User Dashboard (`UserDashboard.jsx`)

```jsx
export default function UserDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");

    fetch(`${API_BASE_URL}/api/donation/user/${email}`)
      .then((res) => res.json())
      .then(setDonations)
      .catch((err) => console.error("Donation fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-8">
        {/* Dashboard content */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Your Donation Submissions
          </h2>
          {/* Donation history table */}
        </section>
      </main>
    </div>
  );
}
```

**Features:**

- View donation history and status
- Profile management
- Blood request tracking
- Responsive design with mobile-friendly layout

#### Profile Management (`Profile.jsx`)

- Update personal information
- Change blood type
- Password management

### Hospital Dashboard (`src/hospital/pages/`)

#### Hospital Dashboard (`HospitalDashboard.jsx`)

```jsx
export default function HospitalDashboard() {
  const [stats, setStats] = useState({
    pendingDonors: 12,
    pendingRecipients: 5,
    totalInventoryUnits: 0,
    expiringUnits: 0,
    urgentPending: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      const res = await fetch(`${API_BASE_URL}/api/hospital/dashboard/stats`, {
        credentials: "include",
      });
      if (res.ok) {
        const dashboardStats = await res.json();
        setStats((prev) => ({ ...prev, ...dashboardStats }));
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <HospitalSidebar />
      {/* Dashboard content with statistics cards */}
    </div>
  );
}
```

#### Blood Inventory Management (`BloodInventory.jsx`)

- View current blood stock
- Track expiry dates
- Manage blood unit status
- Generate inventory reports

#### Donor Approval (`DonorApproval.jsx`)

- Review pending donations
- Approve/decline donors
- Schedule donation appointments

#### Blood Request Management (`BloodRequests.jsx`)

- View incoming blood requests
- Match requests with inventory
- Fulfill or transfer requests

#### Donor-Request Matching (`DonorRequestMatching.jsx`)

- Automated compatibility matching
- Priority-based request handling
- Communication with donors

### Admin Dashboard (`src/admin/pages/`)

#### Admin Dashboard (`AdminDashboard.jsx`)

```jsx
export default function AdminDashboard() {
  const quickLinks = [
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/donations", label: "Donations", icon: Droplet },
    { to: "/admin/requests", label: "Blood Requests", icon: Activity },
    { to: "/admin/reports", label: "Reports", icon: FileText },
    { to: "/admin/hospitals", label: "Hospitals", icon: ShieldPlus },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <AdminSidebar />
      <main className="p-6 md:p-10 max-w-6xl mx-auto">
        {/* Statistics overview */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value="1,248" />
          <StatCard label="Donations Today" value="34" />
          <StatCard label="Open Requests" value="12" />
          <StatCard label="Pending Approvals" value="7" />
        </section>

        {/* Quick actions grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <QuickActionCard key={to} to={to} label={label} icon={Icon} />
          ))}
        </section>
      </main>
    </div>
  );
}
```

#### User Management (`Users.jsx`)

- View all registered users
- Search and filter users
- User activity monitoring
- Account management

#### Hospital Management (`Hospitals.jsx`)

- Register new hospitals
- Manage hospital credentials
- Monitor hospital activity

#### System Monitoring

- **AdminDonations** (`AdminDonations.jsx`) - Overall donation oversight
- **AdminBloodRequests** (`AdminBloodRequests.jsx`) - System-wide request monitoring

## Database Schema

### Core Tables

1. **users**

   - `id`, `email`, `name`, `blood_type`, `password`, `created_at`

2. **donations**

   - `id`, `user_id`, `name`, `email`, `blood_type`, `location`, `status`, `created_at`

3. **blood_requests**

   - `id`, `name`, `email`, `blood_type`, `location`, `urgency`, `status`, `approved`, `created_at`

4. **blood_inventory**

   - `id`, `donation_id`, `blood_type`, `donor_name`, `donor_email`, `hospital_id`, `expiry_date`, `status`, `created_at`, `used_date`

5. **hospital_users**

   - `id`, `username`, `password`, `hospital_name`, `location`, `created_at`

6. **donor_request_matches**
   - `id`, `request_id`, `donor_id`, `match_type`, `status`, `created_at`

## API Routes

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login

### User Routes (`/api/user`)

- `GET /profile/:email` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /profile/password` - Change password

### Donation Routes (`/api/donation`)

- `POST /` - Submit donation
- `GET /user/:email` - Get user's donations
- `GET /pending` - Get pending donations
- `PUT /:id/status` - Update donation status

### Blood Request Routes (`/api/blood-requests`)

- `POST /` - Create blood request
- `GET /user/:email` - Get user's requests
- `GET /pending` - Get pending requests
- `PUT /:id/approve` - Approve request

### Hospital Routes (`/api/hospital`)

- `POST /auth/login` - Hospital login
- `GET /inventory` - Get inventory
- `POST /inventory` - Add blood units
- `GET /blood-requests` - Get hospital requests
- `GET /dashboard/stats` - Dashboard statistics

### Admin Routes (`/api/admin`)

- `POST /login` - Admin login
- `GET /users` - List all users
- `GET /donations` - All donations
- `GET /hospitals` - All hospitals

## Authentication & Authorization

### JWT Token System

- Users receive JWT tokens upon successful login
- Tokens stored in localStorage for persistence
- Middleware validates tokens for protected routes

### Role-Based Access Control

1. **Public Access**: Landing page, registration, login
2. **User Access**: Dashboard, profile, donations, requests
3. **Hospital Access**: Inventory, donor approval, request management
4. **Admin Access**: System oversight, user management, hospital management

### Security Features

- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- CORS configuration for API security
- Session management with credentials

## Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - Authentication tokens

### Frontend

- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Vite** - Build tool

### Development Tools

- **ESLint** - Code linting
- **Git** - Version control
- **VS Code** - Development environment

## Key Features

1. **Blood Type Compatibility Matching** - Automated donor-recipient matching
2. **Inventory Management** - Real-time blood stock tracking
3. **Multi-Role Dashboard** - Tailored interfaces for users, hospitals, and admins
4. **Responsive Design** - Mobile-friendly across all components
5. **Real-time Updates** - Dynamic data fetching and updates
6. **Security** - Comprehensive authentication and authorization
7. **Scalability** - Modular architecture for easy expansion

This architecture provides a robust foundation for a blood donation management system, with clear separation of concerns, secure authentication, and intuitive user interfaces for all stakeholders.
