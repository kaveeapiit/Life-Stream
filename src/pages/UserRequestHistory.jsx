import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function UserRequestHistory() {
  const [requests, setRequests] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) return;

    fetch(`http://localhost:5000/api/blood/user?email=${email}`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Fetch error:', err));
  }, [email]);

  const pending = requests.filter(r => r.approved === null);
  const approved = requests.filter(r => r.approved === true);
  const rejected = requests.filter(r => r.approved === false);

  const renderCard = (req, i, type) => (
    <div
      key={i}
      className={`p-5 rounded-xl shadow-lg border-l-[6px] transition ${
        req.urgency ? 'bg-red-50 border-red-500' : 'bg-white border-gray-300'
      }`}
    >
      <h3 className="font-bold text-lg text-red-700">{req.name}</h3>
      <p className="text-sm text-gray-700"><strong>Email:</strong> {req.email}</p>
      <p className="text-sm text-gray-700"><strong>Blood Type:</strong> {req.blood_type}</p>
      <p className="text-sm text-gray-700"><strong>Location:</strong> {req.location}</p>
      <p className="text-sm text-gray-700">
        <strong>Date:</strong> {new Date(req.created_at).toLocaleString()}
      </p>
      <p className="text-sm mt-1 font-semibold">
        <strong>Status:</strong>{' '}
        {type === 'approved'
          ? '✅ Approved'
          : type === 'rejected'
          ? '❌ Not Approved'
          : '⏳ Pending'}
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-red-700 text-center mb-10">🩸 My Blood Requests</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">⏳ Pending</h2>
          {pending.length === 0 ? <p>No pending requests.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{pending.map((r, i) => renderCard(r, i, 'pending'))}</div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Approved</h2>
          {approved.length === 0 ? <p>No approved requests.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{approved.map((r, i) => renderCard(r, i, 'approved'))}</div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Not Approved</h2>
          {rejected.length === 0 ? <p>No rejected requests.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{rejected.map((r, i) => renderCard(r, i, 'rejected'))}</div>
          )}
        </section>
      </div>
    </div>
  );
}
