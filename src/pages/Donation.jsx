import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Clock, Phone, Users } from 'lucide-react';
import API_BASE_URL from '../config/api.js';

export default function Donation() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bloodType: '',
    location: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('donate');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const bloodType = localStorage.getItem('bloodType');
    if (token && name && email) {
      setIsLoggedIn(true);
      setForm(prev => ({ ...prev, name, email, bloodType: bloodType || '' }));
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/donation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Donation registered successfully!' });
        setForm(f => ({ ...f, location: '' }));
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const donationCenters = [
    {
      name: 'Colombo National Blood Bank',
      location: 'Colombo',
      address: 'Lady Ridgeway Hospital, Colombo 08',
      phone: '+94 11 269 1111',
      hours: '24/7 Emergency Services',
      capacity: 'High',
      coordinates: { x: 45, y: 65 },
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      name: 'Kandy General Hospital',
      location: 'Kandy',
      address: 'Kandy Road, Peradeniya, Kandy',
      phone: '+94 81 223 3337',
      hours: '8:00 AM - 6:00 PM',
      capacity: 'Medium',
      coordinates: { x: 52, y: 45 },
      bloodTypes: ['A+', 'B+', 'O+', 'AB+']
    },
    {
      name: 'Galle Teaching Hospital',
      location: 'Galle',
      address: 'Karapitiya, Galle',
      phone: '+94 91 223 2261',
      hours: '8:00 AM - 5:00 PM',
      capacity: 'Medium',
      coordinates: { x: 38, y: 85 },
      bloodTypes: ['A+', 'B+', 'O+', 'O-']
    },
    {
      name: 'Jaffna Hospital',
      location: 'Jaffna',
      address: 'Hospital Road, Jaffna',
      phone: '+94 21 222 2261',
      hours: '9:00 AM - 4:00 PM',
      capacity: 'Low',
      coordinates: { x: 48, y: 15 },
      bloodTypes: ['A+', 'O+', 'B+']
    },
    {
      name: 'Badulla Hospital',
      location: 'Badulla',
      address: 'Lower King Street, Badulla',
      phone: '+94 55 222 2271',
      hours: '8:00 AM - 4:00 PM',
      capacity: 'Low',
      coordinates: { x: 65, y: 55 },
      bloodTypes: ['A+', 'O+', 'B+']
    },
    {
      name: 'Anuradhapura Hospital',
      location: 'Anuradhapura',
      address: 'Hospital Junction, Anuradhapura',
      phone: '+94 25 222 2271',
      hours: '8:00 AM - 5:00 PM',
      capacity: 'Medium',
      coordinates: { x: 42, y: 25 },
      bloodTypes: ['A+', 'B+', 'O+', 'AB+']
    }
  ];

  const [selectedCenter, setSelectedCenter] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-96 h-96 bg-red-600/20 blur-3xl rounded-full absolute -top-20 -left-20 animate-pulse" />
          <div className="w-80 h-80 bg-red-500/15 blur-3xl rounded-full absolute top-20 right-0" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              Donate Blood. <span className="text-red-400">Save Lives.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your donation can save up to three lives. Join our community of heroes and make a difference today.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
              <TabButton 
                active={activeTab === 'donate'} 
                onClick={() => setActiveTab('donate')}
                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                label="Donate Now"
              />
              <TabButton 
                active={activeTab === 'centers'} 
                onClick={() => setActiveTab('centers')}
                icon={<MapPin className="w-5 h-5" />}
                label="Find Centers"
              />
              <TabButton 
                active={activeTab === 'map'} 
                onClick={() => setActiveTab('map')}
                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47z"/></svg>}
                label="Interactive Map"
              />
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="animate-fadeIn">
            {activeTab === 'donate' && <DonationForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} status={status} isLoggedIn={isLoggedIn} donationCenters={donationCenters} />}
            {activeTab === 'centers' && <DonationCenters centers={donationCenters} />}
            {activeTab === 'map' && <InteractiveMap centers={donationCenters} selectedCenter={selectedCenter} setSelectedCenter={setSelectedCenter} />}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .5s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
        active
          ? 'bg-red-600 text-white shadow-lg'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Donation Form Component
function DonationForm({ form, setForm, onSubmit, loading, status, isLoggedIn, donationCenters }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        {/* Status Message */}
        {status.message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            status.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChipField label="Full Name" value={form.name} readOnly />
            <ChipField label="Email" value={form.email} readOnly type="email" />
          </div>
          
          <ChipField label="Blood Type" value={form.bloodType || 'N/A'} readOnly />

          <FancySelect
            label="Select Donation Center"
            value={form.location}
            onChange={val => setForm({ ...form, location: val })}
            placeholder="Choose your preferred location"
            options={donationCenters.map(center => ({
              value: center.name,
              primary: center.location,
              secondary: center.name.replace(center.location, '').trim()
            }))}
          />

          <button
            type="submit"
            disabled={loading || !isLoggedIn}
            className={`w-full py-4 rounded-lg font-semibold tracking-wide shadow-lg transition-all duration-200 ${
              isLoggedIn 
                ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-600/50' 
                : 'bg-gray-500 cursor-not-allowed'
            } ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting...' : 'Register Donation') : 'Please Login First'}
          </button>

          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-red-500 animate-loadingBar" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Donation Centers Grid Component
function DonationCenters({ centers }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Donation Centers</h2>
        <p className="text-gray-300 text-lg">Find the nearest blood donation center and save lives in your community</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center, index) => (
          <CenterCard key={index} center={center} />
        ))}
      </div>
    </div>
  );
}

// Center Card Component
function CenterCard({ center }) {
  const getCapacityColor = (capacity) => {
    switch(capacity) {
      case 'High': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{center.location}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCapacityColor(center.capacity)}`}>
          {center.capacity} Capacity
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm">{center.name}</p>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{center.address}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{center.phone}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{center.hours}</span>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-white">Accepted Blood Types:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {center.bloodTypes.map(type => (
            <span key={type} className="px-2 py-1 bg-red-600/30 text-red-200 rounded text-xs font-medium">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Interactive Map Component
function InteractiveMap({ centers, selectedCenter, setSelectedCenter }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Interactive Donation Map</h2>
        <p className="text-gray-300">Click on any location to view center details</p>
      </div>
      
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 min-h-[500px]">
          {/* Sri Lanka Map Outline */}
          <div className="absolute inset-4 opacity-20">
            <svg viewBox="0 0 100 120" className="w-full h-full">
              <path 
                d="M45 10 Q50 5 55 10 L65 15 Q75 20 80 30 L85 40 Q90 50 85 60 L80 70 Q75 80 70 85 L60 90 Q50 95 40 90 L30 85 Q20 80 15 70 L10 60 Q5 50 10 40 L15 30 Q25 20 35 15 Z" 
                fill="rgba(239, 68, 68, 0.1)" 
                stroke="rgba(239, 68, 68, 0.3)" 
                strokeWidth="1"
              />
            </svg>
          </div>
          
          {/* Center Markers */}
          {centers.map((center, index) => (
            <button
              key={index}
              onClick={() => setSelectedCenter(selectedCenter === center ? null : center)}
              className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-150 ${
                selectedCenter === center 
                  ? 'bg-red-500 border-red-300 animate-pulse' 
                  : 'bg-red-600 border-red-400 hover:bg-red-500'
              }`}
              style={{
                left: `${center.coordinates.x}%`,
                top: `${center.coordinates.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="sr-only">{center.location}</span>
            </button>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-white">Donation Centers</span>
            </div>
          </div>
        </div>
        
        {/* Selected Center Info */}
        {selectedCenter && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold text-red-400 mb-2">{selectedCenter.location}</h3>
            <p className="text-gray-300 mb-4">{selectedCenter.name}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>{selectedCenter.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-400" />
                  <span>{selectedCenter.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span>{selectedCenter.hours}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Accepted Blood Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.bloodTypes.map(type => (
                    <span key={type} className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Chip Field Component
function ChipField({ label, value, type = 'text', readOnly = false }) {
  return (
    <div className="relative">
      <span className="absolute -top-2 left-4 px-2 py-0.5 bg-gray-900 text-xs text-red-400 rounded">
        {label}
      </span>
      {readOnly ? (
        <div className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-gray-200">
          {value}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        />
      )}
    </div>
  );
}

// Fancy Select Component
function FancySelect({ label, value, onChange, options, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (!open) return;
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const onKeyDown = e => {
    if (!open) {
      if (['ArrowDown','Enter',' '].includes(e.key)) {
        e.preventDefault(); setOpen(true); setActiveIdx(0);
      }
      return;
    }
    if (e.key === 'Escape') { setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i + 1) % options.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => (i - 1 + options.length) % options.length); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) {
        onChange(options[activeIdx].value);
        setOpen(false);
      }
    }
  };

  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <span className="absolute -top-2 left-4 px-2 py-0.5 bg-gray-900 text-xs text-red-400 rounded">{label}</span>

      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white
                   flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`${selected ? '' : 'text-gray-400'}`}>
          {selected ? (
            <>
              <span className="text-red-300 font-semibold">{selected.primary}</span>{' '}
              <span className="text-gray-200">{selected.secondary}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-gray-900 border border-gray-700 shadow-xl focus:outline-none"
        >
          {options.map((o, idx) => {
            const isActive = idx === activeIdx;
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                className={`px-4 py-2 text-sm cursor-pointer flex gap-1
                  ${isActive ? 'bg-white/10' : ''}
                  ${isSelected ? 'bg-white/5' : ''}
                  hover:bg-white/10`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                <span className="text-red-300 font-semibold">{o.primary}</span>
                <span className="text-gray-200">{o.secondary}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
