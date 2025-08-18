# Blood Inventory Management System

## Overview

The Blood Inventory Management System enables hospitals to effectively manage their blood supply by tracking blood units from donation collection to usage or expiry. This system implements the user story: **"As a hospital, I want to manage blood donations to ensure effective supply."**

## Features Implemented

### 1. **Blood Inventory Tracking**

- Track individual blood units with detailed metadata
- Monitor blood type, donor information, and expiry dates
- Real-time inventory status (Available, Used, Expired)

### 2. **Donation to Inventory Conversion**

- Convert approved donations into inventory units
- Set appropriate expiry dates (typically 35-42 days)
- Maintain traceability from donation to inventory

### 3. **Inventory Dashboard**

- Overview of available units by blood type
- Summary statistics and trends
- Quick access to critical information

### 4. **Stock Management**

- Real-time stock levels monitoring
- Low stock alerts for each blood type
- Expiring units notifications

### 5. **Inventory Operations**

- Mark units as used when dispensed
- Handle expired units appropriately
- Bulk operations for efficiency

## Database Schema

### Blood Inventory Table

```sql
CREATE TABLE blood_inventory (
  id SERIAL PRIMARY KEY,
  donation_id INTEGER REFERENCES donations(id),
  blood_type TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  hospital_id INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'Available',
  used_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Hospital Blood Inventory Routes

- `GET /api/hospital/inventory` - Get hospital inventory with filters
- `GET /api/hospital/inventory/summary` - Get inventory summary for dashboard
- `GET /api/hospital/inventory/alerts` - Get low stock and expiring alerts
- `POST /api/hospital/inventory/convert/:donationId` - Convert donation to inventory
- `PUT /api/hospital/inventory/unit/:id` - Update blood unit status
- `POST /api/hospital/inventory/mark-expired` - Mark expired units

## User Interface Components

### 1. **Blood Inventory Page** (`/hospital/blood-inventory`)

- **Location**: `src/hospital/pages/BloodInventory.jsx`
- **Features**:
  - Real-time inventory display with filtering
  - Blood type summary cards
  - Search and filter capabilities
  - Alerts for low stock and expiring units
  - Unit status management (Available/Used/Expired)

### 2. **Collect Donation Page** (`/hospital/collect-donation`)

- **Location**: `src/hospital/pages/CollectDonation.jsx`
- **Features**:
  - List approved donations ready for collection
  - Convert donations to inventory units
  - Set expiry dates during collection
  - Validation and error handling

### 3. **Updated Hospital Dashboard**

- **Location**: `src/hospital/pages/HospitalDashboard.jsx`
- **Features**:
  - Inventory summary statistics
  - Quick access to inventory management
  - Integration with existing hospital workflow

## Workflow

### Standard Workflow

1. **Donation Submission**: User submits blood donation request
2. **Hospital Approval**: Hospital staff reviews and approves donation
3. **Blood Collection**: Hospital collects blood and converts to inventory unit
4. **Inventory Management**: Unit is tracked in inventory system
5. **Usage/Expiry**: Unit is either used for patients or marked as expired

### Key Operations

- **Approve Donation**: `DonorApproval.jsx` → Status: "Approved"
- **Collect Blood**: `CollectDonation.jsx` → Creates inventory unit
- **Manage Inventory**: `BloodInventory.jsx` → Track and update units
- **Monitor Alerts**: Automatic alerts for low stock and expiring units

## Benefits

### For Hospitals

- **Efficient Supply Management**: Real-time visibility into blood inventory
- **Waste Reduction**: Proactive expiry date management
- **Planning Support**: Historical data and trends for better planning
- **Compliance**: Proper tracking and documentation

### For Blood Safety

- **Traceability**: Complete chain from donor to patient
- **Quality Control**: Systematic monitoring of blood units
- **Expiry Management**: Prevents usage of expired blood
- **Stock Optimization**: Maintains adequate supply levels

## Security Features

- **Session-based Authentication**: Hospital login required
- **Hospital Isolation**: Each hospital sees only their inventory
- **Input Validation**: Comprehensive validation for all operations
- **Audit Trail**: Timestamps and status tracking

## Configuration

### Environment Variables

- Standard database configuration in `backend/.env`
- No additional configuration required

### Database Setup

Run the SQL script to create the inventory table:

```bash
cd backend
PGPASSWORD=your_password psql -U postgres -d life-stream -f scripts/create_blood_inventory_table.sql
```

## Testing

The system can be tested using:

1. **Frontend Testing**: Navigate to hospital pages after login
2. **API Testing**: Use the test script `backend/scripts/test_blood_inventory.js`
3. **Database Testing**: Direct SQL queries on the `blood_inventory` table

## Implementation Status

✅ **Completed Features**:

- Database schema and models
- Backend API endpoints
- Frontend components
- Navigation integration
- Basic testing setup

🔄 **Future Enhancements**:

- Advanced reporting and analytics
- Integration with hospital management systems
- Mobile app support
- Automated reorder suggestions
- Blood type compatibility checking

## Files Created/Modified

### Backend

- `models/BloodInventoryModel.js` - Database operations
- `controllers/bloodInventoryController.js` - Business logic
- `routes/bloodInventoryRoutes.js` - API routes
- `scripts/create_blood_inventory_table.sql` - Database schema

### Frontend

- `hospital/pages/BloodInventory.jsx` - Main inventory management
- `hospital/pages/CollectDonation.jsx` - Donation collection
- `hospital/components/HospitalSidebar.jsx` - Updated navigation
- `hospital/pages/HospitalDashboard.jsx` - Updated dashboard

### Configuration

- `backend/index.js` - Route registration
- `src/App.jsx` - Frontend routing

This implementation provides a comprehensive blood inventory management system that enables hospitals to effectively manage their blood supply, ensuring patient safety and operational efficiency.
