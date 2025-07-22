import { useNavigate } from 'react-router-dom';

export default function HospitalSidebar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-red-700 to-red-900 text-white p-6 shadow-lg flex flex-col justify-between z-50">
      <div>
        <h2 className="text-3xl font-extrabold mb-8 tracking-wide">Hospital Panel</h2>
        <ul className="space-y-4 text-lg font-medium">
          <li
            className="cursor-pointer hover:bg-red-800 px-3 py-2 rounded transition"
            onClick={() => navigate('/hospital/dashboard')}
          >
            🏥 Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-red-800 px-3 py-2 rounded transition"
            onClick={() => navigate('/hospital/donor-approval')}
          >
            💉 Donor Approval
          </li>
          <li
            className="cursor-pointer hover:bg-red-800 px-3 py-2 rounded transition"
            onClick={() => navigate('/hospital/recipient-approval')}
          >
            🧪 Recipient Approval
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/hospital/login');
        }}
        className="bg-white text-red-800 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition"
      >
        🔒 Logout
      </button>
    </div>
  );
}
