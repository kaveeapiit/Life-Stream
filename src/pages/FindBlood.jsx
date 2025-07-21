import { useEffect, useState } from 'react';

export default function FindBlood() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipient/approved')
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error('Error fetching donations', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">Find Blood Donations</h1>

      {donations.length === 0 ? (
        <p className="text-center text-gray-600">No available donations at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {donations.map((donation, idx) => (
            <div key={idx} className="bg-red-50 rounded-lg shadow p-5 border border-red-200">
              <p><span className="font-semibold">Name:</span> {donation.name}</p>
              <p><span className="font-semibold">Email:</span> {donation.email}</p>
              <p><span className="font-semibold">Blood Type:</span> {donation.blood_type}</p>
              <p><span className="font-semibold">Location:</span> {donation.location || 'N/A'}</p>
              <p><span className="font-semibold">Date:</span> {new Date(donation.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
