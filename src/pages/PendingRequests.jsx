import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function PendingRequests() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/blood/pending').then(r => r.json()),
      fetch('http://localhost:5000/api/blood/history').then(r => r.json())
    ])
      .then(([p, h]) => {
        setPending(p);
        setHistory(h);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  const renderCard = (req, i, section) => (
    <div
      key={i}
      className={`p-5 rounded-xl shadow-md border-2 text-black transition hover:scale-[1.01] ${
        req.urgency ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
      }`}
    >
      <p><strong>Name:</strong> {req.name}</p>
      <p><strong>Email:</strong> {req.email}</p>
      <p><strong>Blood Type:</strong> {req.blood_type}</p>
      <p><strong>Location:</strong> {req.location}</p>
      <p><strong>Urgent:</strong> {req.urgency ? '✅ Yes' : 'No'}</p>
      <p><strong>Date:</strong> {new Date(req.created_at).toLocaleString()}</p>
      <p>
        <strong>Status:</strong>{' '}
        {section === 'pending'
          ? '⏳ Pending'
          : req.status === 'approved'
          ? '✅ Approved'
          : '❌ Declined'}
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-red-700 text-center mb-10">Pending Blood Requests</h1>

        {/* Pending */}
        {pending.length === 0 ? (
          <p className="text-center text-gray-500 mb-12">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {pending.map((r, i) => renderCard(r, i, 'pending'))}
          </div>
        )}

        {/* History */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">📜 History (Approved / Declined)</h2>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">No history yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {history.map((r, i) => renderCard(r, i, 'history'))}
          </div>
        )}
      </div>
    </div>
  );
}
