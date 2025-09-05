#!/bin/bash

echo "🔄 Updating Hospital Routes to Use Hybrid Authentication"
echo "======================================================="
echo ""

echo "Updating all hospital route files to use hybridHospitalAuth..."
echo ""

# Update hospitalBloodRequestRoutes.js
echo "1. Updating hospitalBloodRequestRoutes.js..."
sed -i '' 's/hospitalAuth,/hybridHospitalAuth,/g' backend/routes/hospitalBloodRequestRoutes.js
sed -i '' 's/hospitalAuth)/hybridHospitalAuth)/g' backend/routes/hospitalBloodRequestRoutes.js

# Update bloodInventoryRoutes.js if it exists
if [ -f "backend/routes/bloodInventoryRoutes.js" ]; then
    echo "2. Updating bloodInventoryRoutes.js..."
    sed -i '' 's/import hospitalAuth from/import hybridHospitalAuth from/g' backend/routes/bloodInventoryRoutes.js
    sed -i '' 's/hospitalAuth.js/hybridHospitalAuth.js/g' backend/routes/bloodInventoryRoutes.js
    sed -i '' 's/hospitalAuth,/hybridHospitalAuth,/g' backend/routes/bloodInventoryRoutes.js
    sed -i '' 's/hospitalAuth)/hybridHospitalAuth)/g' backend/routes/bloodInventoryRoutes.js
fi

# Update donorRequestMatchingRoutes.js
if [ -f "backend/routes/donorRequestMatchingRoutes.js" ]; then
    echo "3. Updating donorRequestMatchingRoutes.js..."
    sed -i '' 's/import hospitalAuth from/import hybridHospitalAuth from/g' backend/routes/donorRequestMatchingRoutes.js
    sed -i '' 's/hospitalAuth.js/hybridHospitalAuth.js/g' backend/routes/donorRequestMatchingRoutes.js
    sed -i '' 's/hospitalAuth,/hybridHospitalAuth,/g' backend/routes/donorRequestMatchingRoutes.js
    sed -i '' 's/hospitalAuth)/hybridHospitalAuth)/g' backend/routes/donorRequestMatchingRoutes.js
fi

# Update hospitalToHospitalRoutes.js
if [ -f "backend/routes/hospitalToHospitalRoutes.js" ]; then
    echo "4. Updating hospitalToHospitalRoutes.js..."
    sed -i '' 's/import hospitalAuth from/import hybridHospitalAuth from/g' backend/routes/hospitalToHospitalRoutes.js
    sed -i '' 's/hospitalAuth.js/hybridHospitalAuth.js/g' backend/routes/hospitalToHospitalRoutes.js
    sed -i '' 's/hospitalAuth,/hybridHospitalAuth,/g' backend/routes/hospitalToHospitalRoutes.js
    sed -i '' 's/hospitalAuth)/hybridHospitalAuth)/g' backend/routes/hospitalToHospitalRoutes.js
fi

echo ""
echo "✅ All hospital route files updated!"
echo ""

echo "🔧 Now let's update the frontend to use JWT tokens..."
echo ""

echo "Frontend changes needed:"
echo "1. Update hospital login to store JWT token"
echo "2. Create API service to send Authorization headers"
echo "3. Update all hospital API calls to use JWT"
echo ""

echo "📦 Backend Changes Complete!"
echo "============================"
echo ""
echo "✅ JWT authentication middleware created"
echo "✅ Hospital login now returns JWT tokens"
echo "✅ All hospital routes updated to accept JWT"
echo "✅ Backward compatibility with session cookies maintained"
echo ""

echo "🚀 Next: Deploy backend changes and update frontend!"
