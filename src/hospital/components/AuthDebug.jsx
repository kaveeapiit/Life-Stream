import { useEffect, useState } from 'react';
import API_BASE_URL from '../../config/api.js';

export default function AuthDebug() {
  const [authStatus, setAuthStatus] = useState('Checking...');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hospital/donors/available?limit=1`, {
          credentials: 'include'
        });
        
        if (res.ok) {
          setAuthStatus('✅ Authenticated');
        } else {
          const error = await res.text();
          setAuthStatus(`❌ Not authenticated: ${error}`);
        }
      } catch (err) {
        setAuthStatus(`❌ Error: ${err.message}`);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded text-white">
      <h3>Hospital Authentication Status:</h3>
      <p>{authStatus}</p>
    </div>
  );
}
