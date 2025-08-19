# Hospital Blood Request Management System

## Overview

The Blood Request Management System enables hospitals to efficiently manage and track blood requests from patients, ensuring proper care and timely response to blood needs.

## Features

### 🩺 Request Management

- **Comprehensive Request Tracking**: View all blood requests with detailed information
- **Status Management**: Track requests through their lifecycle (pending → approved → fulfilled)
- **Urgency Handling**: Special handling for urgent/critical blood requests
- **Hospital Assignment**: Assign requests to specific hospitals for handling

### 🔍 Filtering & Search

- **Status Filtering**: Filter by pending, approved, fulfilled, or declined requests
- **Blood Type Filtering**: Filter requests by specific blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Urgency Filtering**: View urgent vs normal priority requests
- **Pagination**: Efficient browsing through large numbers of requests

### 📊 Dashboard Integration

- **Request Statistics**: Real-time statistics on request counts and status distribution
- **Urgent Request Alerts**: Immediate visibility of urgent/critical requests
- **Quick Action Buttons**: Fast access to blood request management

### ⚡ Quick Actions

- **Approve Requests**: One-click approval for valid blood requests
- **Decline Requests**: Decline requests with notes when necessary
- **Mark as Fulfilled**: Update requests when blood has been provided
- **Add Notes**: Hospital staff can add notes for better tracking

## API Endpoints

### Hospital Blood Request Routes (`/api/hospital/`)

#### Get Blood Requests

```
GET /blood-requests
```

**Parameters:**

- `status` (optional): Filter by status (pending, approved, fulfilled, declined)
- `bloodType` (optional): Filter by blood type
- `urgency` (optional): Filter by urgency (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of requests per page

**Response:**

```json
{
  "requests": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

#### Get Request Statistics

```
GET /blood-requests/stats
```

**Response:**

```json
{
  "pending_requests": 15,
  "approved_requests": 8,
  "fulfilled_requests": 25,
  "declined_requests": 2,
  "urgent_pending": 3,
  "today_requests": 5
}
```

#### Get Urgent Requests

```
GET /blood-requests/urgent
```

Returns all pending urgent blood requests.

#### Get Request Details

```
GET /blood-requests/:id
```

Returns detailed information about a specific blood request.

#### Update Request Status

```
PUT /blood-requests/:id/status
```

**Body:**

```json
{
  "status": "approved",
  "notes": "Optional notes from hospital staff"
}
```

#### Assign Request to Hospital

```
PUT /blood-requests/:id/assign
```

**Body:**

```json
{
  "notes": "Assigned to emergency department"
}
```

## Database Schema

### Enhanced blood_requests Table

```sql
- id (PRIMARY KEY)
- name (Patient name)
- email (Contact email)
- blood_type (Required blood type)
- location (Hospital location/ward)
- urgency (Boolean: urgent vs normal)
- status (pending, approved, declined, fulfilled, cancelled)
- assigned_hospital (Hospital handling the request)
- hospital_notes (Notes from hospital staff)
- priority_level (low, normal, high, critical)
- created_at (Request creation timestamp)
- updated_at (Last update timestamp)
```

### Indexes for Performance

- `idx_blood_requests_status` - For status filtering
- `idx_blood_requests_blood_type` - For blood type filtering
- `idx_blood_requests_urgency` - For urgency filtering
- `idx_blood_requests_assigned_hospital` - For hospital assignment queries
- `idx_blood_requests_created_at` - For date-based queries

## Frontend Components

### BloodRequests.jsx

**Location:** `/src/hospital/pages/BloodRequests.jsx`

**Features:**

- Responsive table view for desktop
- Card view for mobile devices
- Real-time filtering and pagination
- Request details modal
- Quick action buttons for status updates
- Color-coded status and urgency indicators

**Props:** None (uses hospital authentication context)

## User Interface

### Main Blood Requests Page

- **Header**: Shows total request count and page title
- **Filters**: Dropdown filters for status, blood type, and urgency
- **Request Table**: Sortable table with patient info, blood type, status, urgency, and actions
- **Pagination**: Navigation through multiple pages of requests

### Request Details Modal

- **Patient Information**: Name, email, contact details
- **Request Details**: Blood type, location, urgency level, creation date
- **Hospital Actions**: Approve, decline, mark as fulfilled
- **Notes Section**: View and add hospital notes
- **Status Tracking**: Current status and assigned hospital

### Dashboard Integration

- **Statistics Cards**: Show request counts by status
- **Urgent Request Alerts**: Highlight critical requests needing attention
- **Quick Access**: Direct links to request management

## Security & Authentication

### Hospital Authentication Required

All blood request management endpoints require valid hospital authentication:

- Session-based authentication
- Hospital-specific data access
- Role-based permissions

### Data Protection

- Patient information protected
- Hospital assignment tracking
- Audit trail through updated_at timestamps

## Usage Examples

### View Pending Urgent Requests

1. Navigate to Blood Requests page
2. Set Status filter to "Pending"
3. Set Urgency filter to "Urgent"
4. Review critical requests requiring immediate attention

### Approve a Blood Request

1. Click the "View Details" icon for a request
2. Review patient information and requirements
3. Click "Approve Request" button
4. Add optional notes for the approval
5. Request status updates to "Approved"

### Track Request Progress

1. Use status filters to view requests at different stages
2. Monitor fulfilled requests for completion tracking
3. Review declined requests with reasoning notes

## Integration Points

### With Blood Inventory System

- Check blood availability before approving requests
- Reserve blood units for approved requests
- Update inventory when requests are fulfilled

### With Hospital Dashboard

- Real-time statistics display
- Quick access to urgent requests
- Status overview integration

### With User System

- Patient notification system (future enhancement)
- Request history tracking
- User communication portal

## Monitoring & Analytics

### Key Metrics

- Request response time (creation to approval)
- Fulfillment rate (approved to fulfilled)
- Urgent request handling time
- Hospital workload distribution

### Reporting Capabilities

- Daily/weekly request summaries
- Blood type demand analysis
- Urgency pattern tracking
- Hospital performance metrics

## Future Enhancements

### Planned Features

- **Email Notifications**: Automatic patient updates
- **SMS Alerts**: Critical request notifications
- **Advanced Analytics**: Predictive demand analysis
- **Mobile App**: On-the-go request management
- **Integration**: Hospital management systems
- **Scheduling**: Appointment booking for blood collection

### Scalability Considerations

- Database partitioning for large request volumes
- Caching for frequently accessed data
- Load balancing for high-traffic periods
- Real-time updates via WebSocket connections

## Troubleshooting

### Common Issues

1. **Requests not loading**: Check hospital authentication status
2. **Filter not working**: Verify API endpoint responses
3. **Status update failing**: Confirm request ID and status values
4. **Statistics not updating**: Check dashboard API calls

### Debug Tools

- Browser console for API call monitoring
- Network tab for request/response inspection
- Hospital authentication debug component
- Backend logging for server-side issues

## Support & Maintenance

### Regular Tasks

- Database cleanup of old fulfilled requests
- Performance monitoring and optimization
- Security updates and patches
- User feedback collection and implementation

### Contact Information

- Technical Support: [Technical team contact]
- Feature Requests: [Product team contact]
- Emergency Issues: [On-call support contact]
