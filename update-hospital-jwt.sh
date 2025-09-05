#!/bin/bash

# Script to update all hospital pages to use JWT API

echo "Updating hospital pages to use JWT API..."

# List of files to update
files=(
  "src/hospital/pages/AvailableDonors.jsx"
  "src/hospital/pages/DonorApproval.jsx"
  "src/hospital/pages/CollectDonation.jsx"
  "src/hospital/pages/HospitalToHospitalRequests.jsx"
  "src/hospital/pages/DonorRequestMatching.jsx"
  "src/hospital/pages/BloodInventory.jsx"
  "src/hospital/pages/BloodRequests.jsx"
  "src/hospital/components/HospitalSidebar.jsx"
)

for file in "${files[@]}"; do
  if [ -f "/Users/kaveeshasenarathne/Downloads/Life-Stream/$file" ]; then
    echo "Updating $file..."
    
    # Replace import statement
    sed -i '' 's/import API_BASE_URL from .*api\.js.*;/import hospitalAPI from "..\/..\/config\/hospitalAPI.js";/' "/Users/kaveeshasenarathne/Downloads/Life-Stream/$file"
    
    # Replace API_BASE_URL usage in API calls
    # This is a basic replacement - more complex cases may need manual review
    sed -i '' 's/API_BASE_URL/hospitalAPI.API_BASE_URL/g' "/Users/kaveeshasenarathne/Downloads/Life-Stream/$file"
    
    echo "✅ Updated $file"
  else
    echo "❌ File not found: $file"
  fi
done

echo "Hospital JWT API update complete!"
