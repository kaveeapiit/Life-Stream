# Life Stream - Local Development Setup

This project is configured for local development only.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (local installation)
- npm or yarn

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5050

# Backend Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=life_stream
DB_USER=your_username
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-local-secret-key
PORT=5050
NODE_ENV=development
```

## Database Setup

1. Install PostgreSQL locally
2. Create a database named `life_stream`
3. Run the SQL scripts in `backend/scripts/` to create the necessary tables

## Running the Application

### Development Mode (Both Frontend and Backend)

```bash
npm run dev
```

This will start:

- Frontend on http://localhost:5173
- Backend on http://localhost:5050

### Individual Services

```bash
# Frontend only
npm run client

# Backend only
npm run server
```

## Testing Your Setup

Run the environment check script:

```bash
./check-env.sh
```

This will verify that all necessary environment variables are configured correctly.

## Project Structure

- `/src` - React frontend application
- `/backend` - Express.js backend API
- `/public` - Static assets

## Local Development Features

- Hot reload for frontend changes
- Automatic server restart on backend changes (nodemon)
- Local PostgreSQL database
- No SSL/HTTPS requirements
- Session-based authentication

## Building for Production

If you ever need to create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.
