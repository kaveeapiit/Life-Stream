import HospitalSidebar from '../components/HospitalSidebar';

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Component */}
      <HospitalSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Welcome to the Hospital Dashboard 🏥
        </h1>
        <p className="text-gray-700">
          Use the sidebar to manage donor and recipient approvals.
        </p>
      </main>
    </div>
  );
}
