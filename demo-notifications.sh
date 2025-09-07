#!/bin/bash

# Notification System Demo Script
# This script demonstrates the complete notification workflow

echo "🔔 Life Stream Notification System Demo"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database credentials
DB_PASSWORD="010204"
DB_USER="postgres"
DB_HOST="localhost"
DB_NAME="life-stream"

# API base URL
API_BASE="http://localhost:5050"

echo -e "${BLUE}Step 1: Check current notifications for test user${NC}"
curl -s "$API_BASE/api/notifications/user/s@gmail.com" | jq '.'

echo -e "\n${BLUE}Step 2: Create a new pending donation${NC}"
DONATION_ID=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
INSERT INTO donations (name, email, blood_type, location, status) 
VALUES ('Demo User', 's@gmail.com', 'O+', 'Colombo', 'Pending') 
RETURNING id;" | xargs)

echo -e "${GREEN}Created donation with ID: $DONATION_ID${NC}"

echo -e "\n${BLUE}Step 3: Approve the donation (this will create a notification)${NC}"
curl -s -X PUT "$API_BASE/api/donation/update/$DONATION_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}' | jq '.'

echo -e "\n${GREEN}✅ Donation approved! Notification should be created.${NC}"

echo -e "\n${BLUE}Step 4: Check notifications after approval${NC}"
curl -s "$API_BASE/api/notifications/user/s@gmail.com" | jq '.'

echo -e "\n${BLUE}Step 5: Check unread count${NC}"
curl -s "$API_BASE/api/notifications/unread-count/s@gmail.com" | jq '.'

echo -e "\n${YELLOW}Step 6: Create another donation and decline it${NC}"
DONATION_ID_2=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
INSERT INTO donations (name, email, blood_type, location, status) 
VALUES ('Demo User 2', 's@gmail.com', 'A+', 'Kandy', 'Pending') 
RETURNING id;" | xargs)

echo -e "${GREEN}Created second donation with ID: $DONATION_ID_2${NC}"

curl -s -X PUT "$API_BASE/api/donation/update/$DONATION_ID_2" \
  -H "Content-Type: application/json" \
  -d '{"status": "Declined"}' | jq '.'

echo -e "\n${RED}❌ Donation declined! Decline notification should be created.${NC}"

echo -e "\n${BLUE}Step 7: Final notification check${NC}"
curl -s "$API_BASE/api/notifications/user/s@gmail.com" | jq '.'

echo -e "\n${BLUE}Step 8: Check final unread count${NC}"
curl -s "$API_BASE/api/notifications/unread-count/s@gmail.com" | jq '.'

echo -e "\n${GREEN}🎉 Demo completed!${NC}"
echo -e "${YELLOW}You can now:${NC}"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Login with email: s@gmail.com"
echo "3. Navigate to User Dashboard"
echo "4. Click the bell icon to see notifications"
echo "5. Test marking notifications as read/deleting them"

echo -e "\n${BLUE}Notification System Features:${NC}"
echo "✅ Real-time notification creation"
echo "✅ Approval/Decline notifications"
echo "✅ Unread count tracking"
echo "✅ Mark as read functionality"
echo "✅ Auto-refresh every 30 seconds"
echo "✅ Toast notifications for new updates"
echo "✅ Beautiful UI with icons and animations"
