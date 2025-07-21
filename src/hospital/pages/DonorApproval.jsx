import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';

export default function DonorApproval() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/donation/pending')
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error('Failed to fetch pending donations', err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setDonations(prev => prev.filter(d => d.id !== updated.id));
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <HospitalSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Donor Approvals</h2>

        {donations.length === 0 ? (
          <p className="text-gray-300">No pending donations.</p>
        ) : (
          <table className="w-full border border-gray-700 rounded-md">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="p-2 border border-gray-700">Name</th>
                <th className="p-2 border border-gray-700">Email</th>
                <th className="p-2 border border-gray-700">Blood Type</th>
                <th className="p-2 border border-gray-700">Location</th>
                <th className="p-2 border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} className="text-center">
                  <td className="p-2 border border-gray-700">{d.name}</td>
                  <td className="p-2 border border-gray-700">{d.email}</td>
                  <td className="p-2 border border-gray-700">{d.blood_type}</td>
                  <td className="p-2 border border-gray-700">{d.location}</td>
                  <td className="p-2 border border-gray-700 space-x-2">
                    <button
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => updateStatus(d.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => updateStatus(d.id, 'Declined')}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
