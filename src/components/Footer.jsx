export default function Footer({ footer }) {
  return (
    <footer className="bg-gray-900 text-white px-10 py-12">
      <div className="grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-3">🩸 Life Stream</h4>
          <p className="text-gray-400">Connecting donors with those in need. Every donation saves lives.</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Donate Blood</li>
            <li>Find Blood</li>
            <li>Blood Banks</li>
            <li>Campaigns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Guidelines</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Contact Info</h4>
          <ul className="space-y-2 text-gray-400">
            <li>{footer.phone}</li>
            <li>{footer.email}</li>
            <li>{footer.address}</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-800 pt-6">
        &copy; 2025 Life Stream. All rights reserved.
      </div>
    </footer>
  );
}
