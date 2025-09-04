#!/bin/bash

echo "🩸 Life-Stream Blood Interconnectivity Setup"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "Usage: cd backend && ./setup_interconnectivity.sh"
    exit 1
fi

echo ""
echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Running database migrations..."
node scripts/run_interconnectivity_migrations.js

echo ""
echo "3. Testing interconnectivity setup..."
node scripts/test_interconnectivity.js

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Your Life-Stream system now includes:"
echo "✅ Automatic blood stock updates"
echo "✅ Auto-fulfillment of blood requests"
echo "✅ Blood unit reservation system"
echo "✅ Cross-hospital blood sharing"
echo "✅ Complete audit trails"
echo ""
echo "To start the server:"
echo "npm start"
echo ""
echo "API Documentation:"
echo "📖 See BLOOD_INTERCONNECTIVITY_DOCUMENTATION.md for full details"
