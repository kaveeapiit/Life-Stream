import { FaTint } from 'react-icons/fa';

export default function Footer({ footer }) {

  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-sm">
        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="font-bold mb-3 text-base">
            <FaTint className="inline mr-2 text-red-500" /> Life Stream
          </h4>
          <p className="text-gray-400 leading-relaxed">
            Connecting donors with those in need. Every donation saves lives.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-red-400 cursor-pointer transition-colors">Donate Blood</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Find Blood</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Blood Banks</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Campaigns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-red-400 cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Contact Us</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">FAQ</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Guidelines</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Contact Info</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="break-all sm:break-normal">{footer.phone || 'Phone not available'}</li>
            <li className="break-all sm:break-normal">{footer.email || 'Email not available'}</li>
            <li className="break-words">{footer.address || 'Address not available'}</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs sm:text-sm text-gray-500 mt-8 sm:mt-10 border-t border-gray-800 pt-4 sm:pt-6">
        &copy; 2025 Life Stream. All rights reserved.
      </div>
    </footer>
  );
}