import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; // ✅ Ensure path is correct

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/blood/pending')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-red-700 text-center mb-8">Pending Blood Requests</h1>

        {requests.length === 0 ? (
          <p className="text-center text-black">No pending requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {requests.map((req, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl shadow-md border-2 text-black ${
                  req.urgency ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
                }`}
              >
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Blood Type:</strong> {req.blood_type}</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p><strong>Urgent:</strong> {req.urgency ? '✅ Yes' : 'No'}</p>
                <p><strong>Date:</strong> {new Date(req.created_at).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  {req.approved === true
                    ? '✅ Approved'
                    : req.approved === false
                    ? '❌ Not Approved'
                    : '⏳ Pending'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
