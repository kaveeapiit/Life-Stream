import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';

export default function RecipientApproval() {
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipient/pending')
      .then(res => res.json())
      .then(data => setRecipients(data));
  }, []);

  const handleApproval = async (id, approve) => {
    const res = await fetch(`http://localhost:5000/api/recipient/approve/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: approve }),
    });

    const updated = await res.json();
    setRecipients(prev =>
      prev.map(r => (r.id === updated.id ? updated : r))
    );
  };

  return (
    <div className="flex font-sans text-black">
      <HospitalSidebar />

      <div className="flex-1 px-8 py-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-red-700 mb-10 text-left">Recipient Approval</h1>

        {recipients.length === 0 ? (
          <p className="text-left text-gray-500 text-lg">No pending requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recipients.map(rec => (
              <div
                key={rec.id}
                className="bg-red-50 border border-red-300 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="mb-1"><span className="font-bold">Name:</span> {rec.name}</p>
                <p className="mb-1"><span className="font-bold">Email:</span> {rec.email}</p>
                <p className="mb-1"><span className="font-bold">Blood Type:</span> {rec.blood_type}</p>
                <p className="mb-1"><span className="font-bold">Location:</span> {rec.location}</p>
                <p className="mb-1 flex items-center gap-1">
                  <span className="font-bold">Urgent:</span>
                  {rec.urgency ? (
                    <span className="text-green-600 font-semibold">✅ Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </p>
                <p className="mb-1"><span className="font-bold">Date:</span> {rec.date || new Date().toLocaleDateString()}</p>
                <p className="mb-3 flex items-center gap-1">
                  <span className="font-bold">Status:</span>
                  <span className="text-red-600 font-semibold">❌ Not Approved</span>
                </p>

                <div className="flex gap-3 mt-4 justify-center">
                  <button
                    onClick={() => handleApproval(rec.id, true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(rec.id, false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
