# 🗄️ Manual Database Migration Guide

If the automated migration script has issues, you can migrate manually using these steps:

## Prerequisites

1. **Install PostgreSQL client tools** (if not already installed):

   ```bash
   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   ```

2. **Verify Azure PostgreSQL connection**:
   ```bash
   psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin postgres
   # Password: AmmoEka1234
   ```

## Step 1: Export Local Database

### Export Schema Only

```bash
pg_dump -h localhost -p 5432 -U postgres -d life-stream \
  --schema-only --no-owner --no-privileges \
  -f local_schema.sql
```

### Export Data Only

```bash
pg_dump -h localhost -p 5432 -U postgres -d life-stream \
  --data-only --no-owner --no-privileges --disable-triggers \
  -f local_data.sql
```

## Step 2: Import to Azure PostgreSQL

### Import Schema

```bash
psql -h life-stream-postgres.postgres.database.azure.com \
     -p 5432 -U lifestream_admin postgres \
     -f local_schema.sql
```

### Import Data

```bash
psql -h life-stream-postgres.postgres.database.azure.com \
     -p 5432 -U lifestream_admin postgres \
     -f local_data.sql
```

## Step 3: Alternative - Use Complete Schema

If you want to start fresh or have issues, you can use the complete schema file:

```bash
psql -h life-stream-postgres.postgres.database.azure.com \
     -p 5432 -U lifestream_admin postgres \
     -f complete-schema.sql
```

## Step 4: Verify Migration

### Check Tables

```sql
-- Connect to Azure database
psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin postgres

-- List all tables
\dt

-- Check table counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'blood_requests', COUNT(*) FROM blood_requests
UNION ALL
SELECT 'hospital_users', COUNT(*) FROM hospital_users
UNION ALL
SELECT 'admins', COUNT(*) FROM admins;
```

## Step 5: Test Application Connection

Update your backend to test with Azure database:

```bash
# Temporarily set environment variables for testing
export NODE_ENV=production
export DB_USER=lifestream_admin
export DB_HOST=life-stream-postgres.postgres.database.azure.com
export DB_NAME=postgres
export DB_PASSWORD=AmmoEka1234
export DB_PORT=5432

# Start backend
cd backend
npm start
```

## Troubleshooting

### Connection Issues

- **Firewall**: Ensure Azure PostgreSQL allows connections from your IP
- **SSL**: Azure PostgreSQL requires SSL connections
- **Authentication**: Verify username/password combination

### Import Issues

- **Constraints**: Some foreign key constraints might fail if referenced data doesn't exist
- **Permissions**: Use `--no-owner --no-privileges` flags
- **Large Data**: For large datasets, consider using `COPY` commands

### Common Errors

1. **SSL Required**:
   Add `?sslmode=require` to connection string

2. **Permission Denied**:
   Ensure you have CREATE privileges on the database

3. **Duplicate Key Errors**:
   Tables might already exist - either drop them or use `INSERT ... ON CONFLICT`

## Azure Database Configuration

In Azure Portal, ensure:

- **Firewall rules** allow your IP address
- **SSL enforcement** is enabled
- **Connection security** settings are correct

## Final Steps

1. ✅ Verify all tables exist in Azure
2. ✅ Check data counts match local database
3. ✅ Test backend connection with Azure database
4. ✅ Deploy updated environment variables to Azure App Service
5. ✅ Test your application end-to-end
