# Hospital-to-Hospital Blood Request System

## Overview

The Hospital-to-Hospital Blood Request System enables hospitals to collaborate and support each other during emergency situations when they need blood units for their patients. This system implements the user story: **"As a hospital, I want to respond to blood requests from hospitals to support the patients when needed."**

## Features

### 🏥 Cross-Hospital Collaboration

- **Emergency Blood Requests**: Hospitals can create urgent blood requests for their patients
- **Response System**: Other hospitals can view and respond to blood requests with offers
- **Real-time Communication**: Hospitals can exchange notes and coordinate blood transfers
- **Urgency Management**: Requests are prioritized by urgency level (low, normal, high, critical)

### ⏰ Time-Sensitive Processing

- **Automatic Expiry**: Requests automatically expire based on urgency level
  - Critical: 4 hours
  - High: 8 hours
  - Normal/Low: 24 hours
- **Priority Ordering**: Requests sorted by urgency and creation time
- **Active Filtering**: Only shows non-expired, pending requests

### 🩸 Blood Type Management

- **Compatibility Aware**: Supports all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Unit Tracking**: Specify exact number of blood units needed
- **Partial Fulfillment**: Support for partial responses when full units not available

### 📊 Request Lifecycle

- **Status Tracking**: pending → partially_fulfilled → fulfilled/cancelled/expired
- **Response Management**: offered → confirmed → delivered
- **Audit Trail**: Complete history of requests and responses

## Database Schema

### Hospital Blood Requests Table

```sql
CREATE TABLE hospital_blood_requests (
    id SERIAL PRIMARY KEY,
    requesting_hospital VARCHAR(100) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_id VARCHAR(50),
    blood_type VARCHAR(5) NOT NULL,
    units_needed INTEGER NOT NULL DEFAULT 1,
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'normal',
    medical_condition TEXT,
    contact_details TEXT,
    location VARCHAR(255),
    preferred_hospitals TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    -- Response tracking
    responding_hospital VARCHAR(100),
    response_status VARCHAR(20),
    units_offered INTEGER DEFAULT 0,
    response_notes TEXT,
    estimated_delivery_time TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

### Key Constraints

- **Blood Types**: A+, A-, B+, B-, AB+, AB-, O+, O-
- **Urgency Levels**: low, normal, high, critical
- **Request Status**: pending, partially_fulfilled, fulfilled, cancelled, expired
- **Response Status**: offered, confirmed, delivered, declined

## API Endpoints

### Hospital Blood Request Routes (`/api/hospital/`)

#### Create Blood Request

```
POST /requests
```

**Body:**

```json
{
  "patient_name": "John Doe",
  "patient_id": "P12345",
  "blood_type": "O+",
  "units_needed": 2,
  "urgency_level": "critical",
  "medical_condition": "Emergency surgery required",
  "contact_details": "Dr. Smith - 555-0123",
  "location": "Emergency Department"
}
```

#### Get Available Requests

```
GET /requests/available?blood_type=O+&urgency_level=critical&page=1&limit=10
```

Returns blood requests from other hospitals that can be responded to.

#### Get My Hospital's Requests

```
GET /requests/mine?status=pending&page=1&limit=10
```

Returns requests created by the current hospital.

#### Respond to Request

```
POST /requests/:id/respond
```

**Body:**

```json
{
  "response_status": "offered",
  "units_offered": 2,
  "response_notes": "Available immediately",
  "estimated_delivery_time": "2025-08-19T15:30:00"
}
```

#### Get Request Details

```
GET /requests/:id
```

Returns detailed information about a specific request.

#### Update Request Status

```
PUT /requests/:id/status
```

**Body:**

```json
{
  "status": "fulfilled",
  "notes": "Blood units received successfully"
}
```

#### Get Hospital Statistics

```
GET /requests/stats
```

Returns statistics about hospital's request activity.

#### Get Urgent Requests

```
GET /requests/urgent
```

Returns high priority requests needing immediate attention.

## Frontend Components

### HospitalToHospitalRequests.jsx

**Location:** `/src/hospital/pages/HospitalToHospitalRequests.jsx`

**Features:**

- **Three-Tab Interface**: Available Requests, My Requests, Create Request
- **Real-time Filtering**: Blood type, urgency level, status filters
- **Response System**: Modal for responding to requests with offer details
- **Request Details**: Comprehensive view of all request information
- **Pagination**: Efficient browsing through large numbers of requests

**Navigation:** Added to Hospital Sidebar as "Hospital Support"

## User Interface

### Available Requests Tab

- **Priority Display**: Requests sorted by urgency (critical → high → normal → low)
- **Hospital Information**: Shows requesting hospital name and details
- **Expiry Tracking**: Clear indication of when requests expire
- **Quick Actions**: View details and respond buttons
- **Filtering**: Blood type and urgency level filters

### My Requests Tab

- **Status Tracking**: Visual indicators for request status
- **Response Information**: Shows which hospital responded and their notes
- **Timeline**: Creation date and response tracking
- **Request Management**: View details and track progress

### Create Request Tab

- **Patient Information**: Name, ID, blood type, units needed
- **Urgency Settings**: Critical, high, normal, low priority levels
- **Medical Context**: Condition description and contact details
- **Location Details**: Hospital ward or department information

### Response Modal

- **Offer Details**: Units available, delivery time estimation
- **Response Type**: Offer blood units or decline request
- **Communication**: Notes and coordination details
- **Confirmation**: Clear submission and confirmation process

## Workflow

### Standard Emergency Request

1. **Request Creation**: Hospital creates urgent blood request for patient
2. **System Distribution**: Request appears in other hospitals' available requests
3. **Response Evaluation**: Other hospitals review and decide to respond
4. **Offer Submission**: Responding hospital offers available blood units
5. **Coordination**: Hospitals coordinate pickup/delivery details
6. **Fulfillment**: Request marked as fulfilled when blood received

### Request Lifecycle

```
Patient Emergency → Create Request → System Distribution → Hospital Response → Coordination → Blood Transfer → Request Fulfilled
```

### Priority Handling

- **Critical Requests**: 4-hour expiry, top priority display
- **High Priority**: 8-hour expiry, immediate attention required
- **Normal Requests**: 24-hour expiry, standard processing
- **Automatic Expiry**: System automatically expires old requests

## Security & Authentication

### Hospital Authentication Required

All endpoints require valid hospital authentication:

- Session-based authentication via `hospitalAuth` middleware
- Hospital-specific data access (hospitals can't respond to their own requests)
- Secure request and response tracking

### Data Protection

- Patient information protected and hospital-specific
- Request ownership validation
- Response authorization checks
- Audit trail through timestamps

## Usage Examples

### Create Emergency Blood Request

```javascript
const requestData = {
  patient_name: "Emergency Patient",
  blood_type: "O-",
  units_needed: 3,
  urgency_level: "critical",
  medical_condition: "Multi-trauma patient requiring immediate surgery",
  contact_details: "Dr. Emergency - ext. 911",
};

const response = await fetch("/api/hospital/requests", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(requestData),
});
```

### Respond to Blood Request

```javascript
const responseData = {
  response_status: "offered",
  units_offered: 2,
  response_notes: "Available immediately, can deliver within 30 minutes",
  estimated_delivery_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
};

const response = await fetch(`/api/hospital/requests/${requestId}/respond`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(responseData),
});
```

## Integration Points

### With Blood Inventory System

- Check blood availability before responding to requests
- Update inventory when blood units are transferred
- Track blood unit allocation and usage

### With Hospital Dashboard

- Real-time statistics on request activity
- Quick access to urgent requests
- Performance metrics and collaboration tracking

### With Emergency Systems

- Critical request alerts and notifications
- Integration with hospital emergency protocols
- Coordination with emergency response teams

## Benefits

### For Hospitals

- **Emergency Support**: Access to blood units during critical shortages
- **Collaborative Network**: Build relationships with other healthcare facilities
- **Resource Optimization**: Share resources efficiently across hospital network
- **Patient Care**: Improved patient outcomes through faster blood access

### For Patients

- **Faster Treatment**: Reduced wait times for blood transfusions
- **Improved Outcomes**: Access to blood when local supplies are insufficient
- **Network Coverage**: Benefit from broader hospital network resources
- **Emergency Care**: Enhanced emergency medical response capabilities

### For Healthcare System

- **Resource Efficiency**: Optimal use of blood inventory across facilities
- **Emergency Preparedness**: Better response to mass casualty events
- **Collaboration**: Strengthened inter-hospital relationships
- **Quality Care**: Improved overall healthcare delivery

## Monitoring & Analytics

### Key Performance Indicators

- **Response Time**: Time from request creation to first response
- **Fulfillment Rate**: Percentage of requests successfully fulfilled
- **Collaboration Score**: Hospital participation in network support
- **Emergency Effectiveness**: Critical request response metrics

### Reporting Capabilities

- **Daily Activity**: Request creation and response summaries
- **Hospital Performance**: Individual hospital collaboration metrics
- **Network Analysis**: System-wide blood sharing patterns
- **Emergency Response**: Critical situation handling effectiveness

## Future Enhancements

### Planned Features

- **Real-time Notifications**: Instant alerts for critical requests
- **Mobile App**: On-the-go request management for hospital staff
- **Geographic Mapping**: Distance-based request prioritization
- **Blood Type Compatibility**: Automatic compatible blood type suggestions
- **Delivery Tracking**: Real-time blood unit transfer monitoring
- **Integration APIs**: Connect with existing hospital management systems

### Scalability Considerations

- **Database Optimization**: Indexing and query optimization for large volumes
- **Caching Strategy**: Redis caching for frequently accessed data
- **Load Balancing**: Distribute traffic across multiple server instances
- **Real-time Updates**: WebSocket connections for live request updates

## Troubleshooting

### Common Issues

1. **Requests not appearing**: Check hospital authentication and expiry times
2. **Cannot respond to request**: Verify request ownership and status
3. **Response submission failing**: Check required fields and permissions
4. **Statistics not updating**: Verify database connections and query execution

### Debug Tools

- **Browser Console**: Monitor API calls and responses
- **Network Inspector**: Check request/response payloads
- **Database Logs**: Monitor query execution and performance
- **Authentication Debug**: Verify hospital session validity

## Support & Maintenance

### Regular Tasks

- **Database Cleanup**: Remove expired requests and old data
- **Performance Monitoring**: Track response times and system load
- **Security Updates**: Regular authentication and authorization reviews
- **Feature Updates**: Continuous improvement based on user feedback

### Emergency Support

- **24/7 System Monitoring**: Continuous availability checking
- **Critical Request Alerts**: Immediate notification for system issues
- **Backup Systems**: Redundancy for emergency request processing
- **Escalation Procedures**: Clear protocols for system failures

## Contact Information

- **Technical Support**: Backend and frontend system issues
- **Emergency Issues**: Critical system failures affecting patient care
- **Feature Requests**: New functionality and improvement suggestions
- **Training Support**: Hospital staff training and onboarding assistance
