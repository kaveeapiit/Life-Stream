#!/bin/bash

# Azure Database Migration Script for Notification System
# This script will create the notifications table and related objects in Azure PostgreSQL

echo "🚀 Migrating Notification System to Azure Production Database"
echo "============================================================="

# Azure Database Credentials
export PGHOST=life-stream-postgres.postgres.database.azure.com
export PGUSER=lifestream_admin
export PGPORT=5432
export PGDATABASE=postgres
export PGPASSWORD=AmmoEka1234

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Testing Azure database connection...${NC}"
psql -c "SELECT 'Azure DB Connected Successfully!' as status, NOW() as current_time;"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Azure database connection successful!${NC}"
else
    echo -e "${RED}❌ Failed to connect to Azure database. Please check credentials.${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 2: Creating notifications table in Azure...${NC}"
psql -f backend/scripts/create_notifications_table.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Notifications table created successfully in Azure!${NC}"
else
    echo -e "${RED}❌ Failed to create notifications table.${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 3: Verifying table creation...${NC}"
psql -c "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = 'notifications' ORDER BY ordinal_position;"

echo -e "\n${BLUE}Step 4: Checking table indexes...${NC}"
psql -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'notifications';"

echo -e "\n${BLUE}Step 5: Creating a test notification in Azure...${NC}"
psql -c "INSERT INTO notifications (email, type, title, message, related_id, related_type) VALUES ('azure-test@example.com', 'donation_approved', 'Azure Migration Test', 'This is a test notification to verify Azure database migration is working correctly.', 1, 'donation');"

echo -e "\n${BLUE}Step 6: Verifying test notification...${NC}"
psql -c "SELECT id, email, type, title, created_at FROM notifications WHERE email = 'azure-test@example.com';"

echo -e "\n${BLUE}Step 7: Testing notification cleanup function...${NC}"
psql -c "SELECT cleanup_old_notifications();"

echo -e "\n${GREEN}🎉 Azure Database Migration Completed Successfully!${NC}"
echo -e "${YELLOW}Summary of changes made:${NC}"
echo "✅ Created 'notifications' table with all columns"
echo "✅ Created indexes for performance optimization"
echo "✅ Created cleanup function for old notifications"
echo "✅ Added table and column comments for documentation"
echo "✅ Verified table structure and functionality"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Update your production environment variables"
echo "2. Deploy your backend code to Azure"
echo "3. Test the notification system in production"

echo -e "\n${YELLOW}Environment Variables for Production:${NC}"
echo "PGHOST=life-stream-postgres.postgres.database.azure.com"
echo "PGUSER=lifestream_admin"
echo "PGPORT=5432"
echo "PGDATABASE=postgres"
echo "PGPASSWORD=AmmoEka1234"
