# Notification System Documentation

## Overview

The notification system provides real-time notifications to users when their donation requests are approved or declined by hospitals. It includes:

1. **Backend API** - RESTful endpoints for managing notifications
2. **Database Table** - PostgreSQL table to store notifications
3. **Frontend Component** - React component with bell icon and dropdown
4. **Toast Notifications** - Real-time popup notifications
5. **Auto-generated Notifications** - Automatic creation when donations are approved/declined

## Features Implemented

### 🔔 Notification Bell Icon

- Located in the user dashboard header
- Shows unread notification count with a red badge
- Animated pulse effect for new notifications

### 📋 Notification Dropdown

- Click bell icon to open dropdown
- Shows recent notifications with icons
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Real-time timestamps (e.g., "2m ago", "1h ago")

### 🍞 Toast Notifications

- Pop-up notifications for new updates
- Auto-dismiss after 5 seconds
- Different colors for different notification types
- Smooth fade-in/fade-out animations

### 🔄 Auto-Refresh

- Polls for new notifications every 30 seconds
- Updates unread count automatically
- Shows new notifications as toast popups

## Database Schema

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_id INTEGER,
    related_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET `/api/notifications/user/:email`

Get all notifications for a user

- Returns: Array of notification objects

### GET `/api/notifications/unread-count/:email`

Get unread notification count

- Returns: `{ count: number }`

### PUT `/api/notifications/read/:id`

Mark notification as read

- Body: `{ email: string }`

### PUT `/api/notifications/read-all/:email`

Mark all notifications as read for user

### DELETE `/api/notifications/:id`

Delete a notification

- Body: `{ email: string }`

## Notification Types

1. **donation_approved** 🎉

   - Title: "🎉 Donation Approved!"
   - Message: "Great news! Your blood donation request has been approved..."
   - Color: Green

2. **donation_declined** ⚠️
   - Title: "Donation Update"
   - Message: "Your donation request has been reviewed..."
   - Color: Yellow

## Integration Points

### Donation Controller

When a donation status is updated to "Approved" or "Declined", the system automatically creates a notification:

```javascript
// In donationController.js
const notificationData = {
  email: updated.email,
  type: status === "Approved" ? "donation_approved" : "donation_declined",
  title: status === "Approved" ? "🎉 Donation Approved!" : "Donation Update",
  message: "...",
  relatedId: updated.id,
  relatedType: "donation",
};
await NotificationModel.createNotification(notificationData);
```

### User Dashboard

The notification system is integrated into the UserDashboard header:

```jsx
<NotificationSystem userEmail={user?.email} />
```

## Testing the System

### 1. Create Test Notifications

```bash
# Create a pending donation
PGPASSWORD=010204 psql -h localhost -U postgres -d life-stream -c "
INSERT INTO donations (name, email, blood_type, location, status)
VALUES ('Test User', 's@gmail.com', 'O+', 'Colombo', 'Pending')
RETURNING id;"

# Approve the donation (creates notification)
curl -X PUT "http://localhost:5050/api/donation/update/[ID]" \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}'
```

### 2. Check Notifications

```bash
# Get notifications for user
curl "http://localhost:5050/api/notifications/user/s@gmail.com"

# Get unread count
curl "http://localhost:5050/api/notifications/unread-count/s@gmail.com"
```

### 3. Frontend Testing

1. Login as user with email `s@gmail.com`
2. Navigate to User Dashboard
3. Look for bell icon in header with red badge
4. Click bell to see notification dropdown
5. Test marking as read, deleting notifications

## Future Enhancements

1. **Email Notifications** - Send email alerts for important notifications
2. **Push Notifications** - Browser push notifications
3. **Notification Preferences** - User settings for notification types
4. **Sound Alerts** - Audio notifications for new updates
5. **Notification Categories** - Group notifications by type
6. **Bulk Actions** - Select multiple notifications for actions
7. **Rich Notifications** - Include images, buttons, actions

## Security Considerations

- All notification endpoints validate user email
- Users can only access their own notifications
- SQL injection protection through parameterized queries
- XSS protection through React's built-in escaping

## Performance Optimizations

- Database indexes on email, is_read, created_at
- Auto-cleanup of notifications older than 30 days
- Pagination support for large notification lists
- Efficient polling with minimal data transfer
