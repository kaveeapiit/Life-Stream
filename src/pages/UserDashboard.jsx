import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // adjust path as needed

export default function UserDashboard() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token) {
      alert("Please login first");
      navigate('/login');
    } else {
      fetch(`http://localhost:5000/api/donation/user/${email}`)
        .then(res => res.json())
        .then(data => setDonations(data))
        .catch(err => console.error("Donation fetch error:", err));
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 p-6 bg-white text-black min-h-screen w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome to Life Stream</h1>
        <p className="mb-6">You are now logged in to your user dashboard.</p>

        <h2 className="text-xl font-semibold mb-3">Your Donation Submissions</h2>

        {donations.length === 0 ? (
          <p className="text-black">No donations submitted yet.</p>
        ) : (
          <table className="w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr className="text-black">
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Blood Type</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, idx) => (
                <tr key={idx} className="text-center text-black">
                  <td className="p-2 border">{donation.location || '—'}</td>
                  <td className="p-2 border">{donation.blood_type}</td>
                  <td className="p-2 border">{new Date(donation.created_at).toLocaleString()}</td>
                  <td className={`p-2 border font-semibold`}>
                    <span
                      className={`px-2 py-1 rounded ${
                        donation.status === 'Pending'
                          ? 'bg-yellow-200'
                          : donation.status === 'Approved'
                          ? 'bg-green-200'
                          : 'bg-red-200'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
