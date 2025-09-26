# Blood Stock Management System Documentation

## Overview
The Blood Stock Management System allows hospitals to maintain and edit stock counts for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-). This is separate from the blood inventory system, which tracks individual blood units from donations.

## Features

### ✅ Implemented Features
- **Stock Overview**: Display current stock levels for all 8 blood types
- **Manual Stock Editing**: Hospital staff can manually edit stock counts
- **Real-time Updates**: Stock levels are updated immediately in the database
- **Stock Level Indicators**: Visual indicators for stock levels (Out of Stock, Low Stock, Medium Stock, Good Stock)
- **Quick Adjust**: +/- buttons for quick stock adjustments
- **Stock Alerts**: Low stock warnings displayed prominently
- **Summary Dashboard**: Total units, stock status counts
- **Audit Trail**: Track who updated stock and when
- **Responsive Design**: Works on all device sizes

### 🎯 Key Components

#### Database
- **Table**: `blood_stock`
- **Columns**: 
  - `hospital_id` - Hospital identifier
  - `blood_type` - Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - `stock_count` - Current stock count (0-9999)
  - `last_updated` - Timestamp of last update
  - `updated_by` - Username who made the update

#### Backend API
- **Base URL**: `/api/hospital/blood-stock`
- **Authentication**: Hospital session required
- **Endpoints**:
  - `GET /blood-stock` - Get all stock for hospital
  - `GET /blood-stock/summary` - Get stock summary
  - `GET /blood-stock/alerts` - Get low stock alerts
  - `GET /blood-stock/:bloodType` - Get stock for specific blood type
  - `PUT /blood-stock/:bloodType` - Update stock for specific blood type
  - `PUT /blood-stock` - Update multiple blood types

#### Frontend
- **Component**: `BloodStock.jsx`
- **Route**: `/hospital/blood-stock`
- **Navigation**: Added to Hospital Sidebar as "Blood Inventory"

## Usage Instructions

### For Hospital Staff

1. **Access**: Navigate to Hospital Dashboard → Blood Inventory (in sidebar)
2. **View Stock**: See current stock levels for all blood types with color-coded indicators
3. **Edit Stock**: 
   - Click "Edit Stock" button on any blood type card
   - Enter new stock count (0-9999)
   - Click "Save" to update
4. **Quick Adjust**: Use +/- buttons for small adjustments
5. **Monitor Alerts**: Check the alerts section for low stock warnings

### Stock Level Indicators
- 🔴 **Red (Out of Stock)**: 0 units
- 🟠 **Orange (Low Stock)**: 1-9 units
- 🟡 **Yellow (Medium Stock)**: 10-29 units
- 🟢 **Green (Good Stock)**: 30+ units

## Setup Instructions

### Database Setup
```bash
# Run the blood stock table creation script
PGPASSWORD=010204 psql -U postgres -d life-stream -f backend/scripts/create_blood_stock_table.sql
```

### Backend Setup
1. Blood stock routes are automatically registered in `backend/index.js`
2. Models, controllers, and routes are in place
3. Authentication middleware is configured

### Frontend Setup
1. Component is created in `src/hospital/pages/BloodStock.jsx`
2. Route is added to `src/App.jsx`
3. Navigation is added to `HospitalSidebar.jsx`

## Sample Data
Initial sample data is created for hospital_id 1 with realistic stock counts:
- A+: 45 units
- A-: 23 units  
- B+: 67 units
- B-: 12 units
- AB+: 8 units
- AB-: 4 units
- O+: 89 units
- O-: 34 units

## Database Schema
```sql
CREATE TABLE blood_stock (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    UNIQUE(hospital_id, blood_type)
);
```

## Testing
1. Start the application: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Log in as a hospital user
4. Go to Hospital Dashboard → Blood Inventory
5. Test editing stock levels

## Security
- All endpoints require hospital authentication
- Input validation for blood types and stock counts
- SQL injection protection through parameterized queries
- Session-based authentication

## Future Enhancements
- 📊 **Analytics**: Stock usage trends and reporting
- 📱 **Mobile App**: Dedicated mobile interface
- 🔔 **Notifications**: Auto-alerts for low/out of stock
- 🔄 **Auto-sync**: Integration with blood inventory system
- 📈 **Forecasting**: Predictive stock level recommendations
- 🏥 **Multi-hospital**: Cross-hospital stock sharing
- 📋 **Batch Updates**: Bulk stock updates via CSV import
- ⏰ **Scheduled Reports**: Automated stock reports

## Files Created/Modified

### Backend
- `backend/models/BloodStockModel.js` - Database operations
- `backend/controllers/bloodStockController.js` - Business logic
- `backend/routes/bloodStockRoutes.js` - API routes
- `backend/scripts/create_blood_stock_table.sql` - Database schema
- `backend/index.js` - Route registration

### Frontend
- `src/hospital/pages/BloodStock.jsx` - Main blood stock management
- `src/hospital/components/HospitalSidebar.jsx` - Updated navigation
- `src/hospital/pages/HospitalDashboard.jsx` - Added quick action
- `src/App.jsx` - Route registration

### Testing
- `test-blood-stock-api.sh` - API endpoint testing script

## Support
For issues or questions about the Blood Stock Management System:
1. Check the console logs for error details
2. Verify database connectivity and table structure
3. Ensure hospital authentication is working
4. Test API endpoints using the provided test script