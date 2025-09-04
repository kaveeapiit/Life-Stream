# Environment Configuration

This project is configured to work in both local development and production environments using environment variables.

## Setup Instructions

### Local Development

1. **Frontend Environment** (`.env.local`):

   ```env
   VITE_API_BASE_URL=http://localhost:5050
   ```

2. **Backend Environment** (`.env`):

   ```env
   # Database
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=life-stream
   DB_PASSWORD=your_password
   DB_PORT=5432

   # Server
   PORT=5050
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your-secret-key
   ```

### Production Environment

#### Frontend (Vercel)

Set environment variables in Vercel dashboard:

- `VITE_API_BASE_URL=https://life-stream-production-2f47.up.railway.app`

#### Backend (Railway)

Set environment variables in Railway dashboard:

- `DATABASE_URL=your_railway_postgres_url`
- `FRONTEND_URL=https://life-stream-flame.vercel.app`
- `NODE_ENV=production`
- `SESSION_SECRET=your-production-secret`
- `PORT=5050` (or use Railway's PORT if different)

## Environment Files

- `.env` - Default environment variables (committed to git)
- `.env.local` - Local development overrides (not committed)
- `.env.production` - Production defaults (committed to git)

## API Configuration

All API calls in the frontend use the `API_BASE_URL` from `src/config/api.js`, which automatically picks up the environment variable `VITE_API_BASE_URL`.

## CORS Configuration

The backend automatically configures CORS based on the `FRONTEND_URL` environment variable, allowing seamless switching between local and production environments.

## Testing Your Setup

Run the environment check script:

```bash
./check-env.sh
```

This will show you which environment variables are set and provide configuration guidance.
