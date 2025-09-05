# 🗄️ Database Migration to Azure PostgreSQL - Complete Guide

## Overview

I've created a complete database migration solution for moving your local PostgreSQL database to Azure PostgreSQL.

## 📁 Files Created

### 1. Automated Migration

- **`migrate-to-azure.sh`** - Complete automated migration script
- **`test-azure-connection.sh`** - Tests Azure PostgreSQL connectivity
- **`analyze-local-db.sh`** - Analyzes your local database structure

### 2. Manual Migration

- **`complete-schema.sql`** - Complete database schema for manual setup
- **`MANUAL_MIGRATION_GUIDE.md`** - Step-by-step manual migration instructions

## 🚀 Quick Start (Recommended)

### Step 1: Test Azure Connection

```bash
./test-azure-connection.sh
```

This verifies that your Azure PostgreSQL is accessible and has proper permissions.

### Step 2: Analyze Local Database

```bash
./analyze-local-db.sh
```

This shows you what data will be migrated from your local database.

### Step 3: Run Migration

```bash
./migrate-to-azure.sh
```

This performs the complete migration automatically.

## 🔧 Your Azure PostgreSQL Details

```bash
Host: life-stream-postgres.postgres.database.azure.com
Port: 5432
User: lifestream_admin
Database: postgres
Password: AmmoEka1234
```

**Connection Command:**

```bash
psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin postgres
```

## 📊 What Gets Migrated

Your Life Stream application includes these tables:

- **users** - Registered donors/recipients
- **hospital_users** - Hospital staff accounts
- **admins** - System administrators
- **donations** - Blood donation requests and status
- **blood_requests** - Patient blood requests
- **blood_inventory** - Physical blood units in hospitals
- **hospital_blood_requests** - Hospital-to-hospital requests
- **donor_request_matches** - Donor-request matching system

## 🔄 Migration Process

1. **Export local database** (schema + data)
2. **Test Azure connection**
3. **Import schema** to Azure
4. **Import data** to Azure
5. **Verify migration** with table counts
6. **Test application** connection

## 🛠️ Troubleshooting

### Common Issues:

1. **Connection Refused**

   - Check Azure firewall rules
   - Ensure your IP is whitelisted
   - Verify server is running

2. **SSL Errors**

   - Azure PostgreSQL requires SSL
   - The scripts handle this automatically

3. **Permission Denied**

   - Verify credentials are correct
   - Ensure database user has CREATE privileges

4. **Import Failures**
   - Foreign key constraint issues
   - Data type mismatches
   - Use manual import with modifications

### Solutions:

- **Use Manual Migration**: Follow `MANUAL_MIGRATION_GUIDE.md`
- **Fresh Start**: Use `complete-schema.sql` to create tables from scratch
- **Incremental Import**: Import tables one by one

## ✅ Post-Migration Steps

1. **Verify Data**: Compare table counts between local and Azure
2. **Test Backend**: Update environment variables and test API
3. **Deploy to Azure**: Push your code changes to trigger deployment
4. **End-to-End Test**: Test your full application workflow

## 🔐 Security Notes

- Database credentials are only used in Azure environment variables
- Local database remains unchanged
- SSL connections enforced on Azure
- Backup files created locally for rollback if needed

## 📋 Migration Checklist

- [ ] Run `./test-azure-connection.sh` ✓
- [ ] Run `./analyze-local-db.sh` ✓
- [ ] Run `./migrate-to-azure.sh` ✓
- [ ] Verify table counts match
- [ ] Test backend with Azure database
- [ ] Update Azure App Service environment variables
- [ ] Deploy and test full application

## 🆘 Getting Help

If you encounter issues:

1. Check the error messages from the scripts
2. Review `MANUAL_MIGRATION_GUIDE.md` for alternative approaches
3. Use `complete-schema.sql` to create a fresh database
4. Test individual components step by step

Your database migration is now ready to execute! 🎉
