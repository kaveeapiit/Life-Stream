import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Clock, Phone, Users, Search, AlertTriangle, Heart } from 'lucide-react';
import API_BASE_URL from '../config/api.js';

export default function FindBlood() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    blood_type: '',
    location: '',
    urgency: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('request');

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) {
      setIsLoggedIn(true);
      setForm(p => ({ ...p, name: name || '', email: email || '' }));
    }
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) return navigate('/login');

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blood/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: '✅ Blood request submitted successfully!' });
        setForm(f => ({ ...f, blood_type: '', location: '', urgency: false }));
        setTimeout(() => navigate('/pending-requests'), 2000);
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to submit request.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const bloodBanks = [
    {
      name: 'Colombo National Blood Bank',
      location: 'Colombo',
      address: 'Lady Ridgeway Hospital, Colombo 08',
      phone: '+94 11 269 1111',
      hours: '24/7 Emergency Services',
      availability: 'High',
      coordinates: { x: 45, y: 65 },
      bloodStock: {
        'A+': 95, 'A-': 45, 'B+': 78, 'B-': 32,
        'AB+': 23, 'AB-': 15, 'O+': 156, 'O-': 67
      }
    },
    {
      name: 'Kandy General Hospital',
      location: 'Kandy',
      address: 'Kandy Road, Peradeniya, Kandy',
      phone: '+94 81 223 3337',
      hours: '8:00 AM - 6:00 PM',
      availability: 'Medium',
      coordinates: { x: 52, y: 45 },
      bloodStock: {
        'A+': 34, 'A-': 12, 'B+': 45, 'B-': 8,
        'AB+': 15, 'AB-': 5, 'O+': 67, 'O-': 23
      }
    },
    {
      name: 'Galle Teaching Hospital',
      location: 'Galle',
      address: 'Karapitiya, Galle',
      phone: '+94 91 223 2261',
      hours: '8:00 AM - 5:00 PM',
      availability: 'Medium',
      coordinates: { x: 38, y: 85 },
      bloodStock: {
        'A+': 28, 'A-': 8, 'B+': 31, 'B-': 6,
        'AB+': 12, 'AB-': 3, 'O+': 45, 'O-': 18
      }
    },
    {
      name: 'Jaffna Hospital',
      location: 'Jaffna',
      address: 'Hospital Road, Jaffna',
      phone: '+94 21 222 2261',
      hours: '9:00 AM - 4:00 PM',
      availability: 'Low',
      coordinates: { x: 48, y: 15 },
      bloodStock: {
        'A+': 15, 'A-': 4, 'B+': 18, 'B-': 2,
        'AB+': 7, 'AB-': 1, 'O+': 25, 'O-': 8
      }
    },
    {
      name: 'Badulla Hospital',
      location: 'Badulla',
      address: 'Lower King Street, Badulla',
      phone: '+94 55 222 2271',
      hours: '8:00 AM - 4:00 PM',
      availability: 'Low',
      coordinates: { x: 65, y: 55 },
      bloodStock: {
        'A+': 12, 'A-': 3, 'B+': 16, 'B-': 1,
        'AB+': 5, 'AB-': 0, 'O+': 22, 'O-': 6
      }
    },
    {
      name: 'Anuradhapura Hospital',
      location: 'Anuradhapura',
      address: 'Hospital Junction, Anuradhapura',
      phone: '+94 25 222 2271',
      hours: '8:00 AM - 5:00 PM',
      availability: 'Medium',
      coordinates: { x: 42, y: 25 },
      bloodStock: {
        'A+': 24, 'A-': 7, 'B+': 29, 'B-': 4,
        'AB+': 9, 'AB-': 2, 'O+': 38, 'O-': 14
      }
    }
  ];

  const bloodOptions = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  const locationOptions = bloodBanks.map(bank => bank.name);

  const [selectedBank, setSelectedBank] = useState(null);
  const [searchBloodType, setSearchBloodType] = useState('');

  const getStockLevel = (count) => {
    if (count >= 50) return { level: 'High', color: 'text-green-400 bg-green-400/20' };
    if (count >= 20) return { level: 'Medium', color: 'text-yellow-400 bg-yellow-400/20' };
    if (count > 0) return { level: 'Low', color: 'text-orange-400 bg-orange-400/20' };
    return { level: 'Out', color: 'text-red-400 bg-red-400/20' };
  };

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
              Find Blood. <span className="text-red-400">Save Lives.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with blood banks across Sri Lanka. Request blood when you need it most.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
              <TabButton 
                active={activeTab === 'request'} 
                onClick={() => setActiveTab('request')}
                icon={<Heart className="w-5 h-5" />}
                label="Request Blood"
              />
              <TabButton 
                active={activeTab === 'availability'} 
                onClick={() => setActiveTab('availability')}
                icon={<Search className="w-5 h-5" />}
                label="Check Availability"
              />
              <TabButton 
                active={activeTab === 'map'} 
                onClick={() => setActiveTab('map')}
                icon={<MapPin className="w-5 h-5" />}
                label="Blood Bank Map"
              />
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="animate-fadeIn">
            {activeTab === 'request' && <BloodRequestForm form={form} handleChange={handleChange} onSubmit={handleSubmit} loading={loading} msg={msg} isLoggedIn={isLoggedIn} bloodOptions={bloodOptions} locationOptions={locationOptions} />}
            {activeTab === 'availability' && <BloodAvailability bloodBanks={bloodBanks} searchBloodType={searchBloodType} setSearchBloodType={setSearchBloodType} getStockLevel={getStockLevel} />}
            {activeTab === 'map' && <BloodBankMap bloodBanks={bloodBanks} selectedBank={selectedBank} setSelectedBank={setSelectedBank} getStockLevel={getStockLevel} />}
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

// Blood Request Form Component
function BloodRequestForm({ form, handleChange, onSubmit, loading, msg, isLoggedIn, bloodOptions, locationOptions }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            msg.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UnderInput label="Full Name" name="name" value={form.name} readOnly />
            <UnderInput label="Email Address" name="email" type="email" value={form.email} readOnly />
          </div>

          <DarkSelect
            label="Required Blood Type"
            name="blood_type"
            value={form.blood_type}
            onChange={handleChange}
            placeholder="Select Blood Type"
            options={bloodOptions}
            disabled={!isLoggedIn}
            required
          />

          <DarkSelect
            label="Nearest Blood Bank"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Select Location"
            options={locationOptions}
            disabled={!isLoggedIn}
            required
          />

          {/* Urgency Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <span className="font-semibold text-white">Mark as Urgent</span>
                <p className="text-sm text-gray-400">Priority processing for emergency cases</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="urgency"
                checked={form.urgency}
                onChange={handleChange}
                disabled={!isLoggedIn}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!isLoggedIn || loading}
            className={`w-full py-4 rounded-lg font-semibold tracking-wide shadow-lg transition-all duration-200 ${
              isLoggedIn 
                ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-600/50' 
                : 'bg-gray-500 cursor-not-allowed'
            } ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting Request...' : 'Submit Blood Request') : 'Login to Submit Request'}
          </button>

          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-red-500 animate-loadingBar" />
            </div>
          )}
        </form>

        {!isLoggedIn && (
          <p className="mt-6 text-center text-red-400 text-sm">
            Please log in to submit a blood request.
          </p>
        )}
      </div>
    </div>
  );
}

// Blood Availability Component
function BloodAvailability({ bloodBanks, searchBloodType, setSearchBloodType, getStockLevel }) {
  const bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  
  const filteredBanks = searchBloodType 
    ? bloodBanks.filter(bank => bank.bloodStock[searchBloodType] > 0)
    : bloodBanks;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Blood Availability Checker</h2>
        <p className="text-gray-300">Check real-time blood availability across all blood banks</p>
      </div>

      {/* Blood Type Filter */}
      <div className="mb-8 flex justify-center">
        <div className="flex flex-wrap gap-2 bg-white/5 p-4 rounded-2xl">
          <button
            onClick={() => setSearchBloodType('')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              !searchBloodType ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Types
          </button>
          {bloodTypes.map(type => (
            <button
              key={type}
              onClick={() => setSearchBloodType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                searchBloodType === type ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanks.map((bank, index) => (
          <BloodBankCard key={index} bank={bank} getStockLevel={getStockLevel} searchBloodType={searchBloodType} />
        ))}
      </div>

      {searchBloodType && filteredBanks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🩸</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No {searchBloodType} Blood Available</h3>
          <p className="text-gray-500">Try checking other blood banks or contact them directly</p>
        </div>
      )}
    </div>
  );
}

// Blood Bank Card Component
function BloodBankCard({ bank, getStockLevel, searchBloodType }) {
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'High': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{bank.location}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(bank.availability)}`}>
          {bank.availability} Stock
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm">{bank.name}</p>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{bank.address}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{bank.hours}</span>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-semibold text-white mb-3">Blood Stock:</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(bank.bloodStock).map(([type, count]) => {
            const stock = getStockLevel(count);
            const isHighlighted = searchBloodType === type;
            return (
              <div key={type} className={`flex justify-between items-center p-2 rounded ${
                isHighlighted ? 'bg-red-600/30 border border-red-400/50' : 'bg-gray-800/50'
              }`}>
                <span className="text-sm font-medium">{type}</span>
                <span className={`text-xs px-2 py-1 rounded ${stock.color}`}>
                  {count} units
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Blood Bank Map Component
function BloodBankMap({ bloodBanks, selectedBank, setSelectedBank, getStockLevel }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Blood Bank Locations</h2>
        <p className="text-gray-300">Click on any location to view detailed blood stock information</p>
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
          
          {/* Bank Markers */}
          {bloodBanks.map((bank, index) => (
            <button
              key={index}
              onClick={() => setSelectedBank(selectedBank === bank ? null : bank)}
              className={`absolute w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-125 ${
                selectedBank === bank 
                  ? 'bg-red-500 border-red-300 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-red-600 border-red-400 hover:bg-red-500'
              }`}
              style={{
                left: `${bank.coordinates.x}%`,
                top: `${bank.coordinates.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="sr-only">{bank.location}</span>
            </button>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-white">Blood Banks</span>
              </div>
              <div className="text-xs text-gray-400">Click to view stock details</div>
            </div>
          </div>
        </div>
        
        {/* Selected Bank Info */}
        {selectedBank && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold text-red-400 mb-2">{selectedBank.location}</h3>
            <p className="text-gray-300 mb-4">{selectedBank.name}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>{selectedBank.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-400" />
                  <span>{selectedBank.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span>{selectedBank.hours}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-400" />
                  Current Blood Stock:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedBank.bloodStock).map(([type, count]) => {
                    const stock = getStockLevel(count);
                    return (
                      <div key={type} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <span className="font-medium">{type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${stock.color}`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Input Components
const baseInput = "w-full bg-transparent text-white/90 text-base font-medium py-3 focus:outline-none";
const underline = "border-b border-white/20 focus:border-red-500 transition-colors duration-200";
const labelCls = "block text-sm font-semibold text-white/70 mb-1";

function UnderInput({ label, name, value, onChange, type = "text", readOnly = false, disabled = false, required }) {
  return (
    <div className="relative">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        placeholder={label}
        className={`${baseInput} ${underline} ${disabled || readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function DarkSelect({ label, name, value, onChange, options, placeholder, disabled = false, required = false }) {
  return (
    <div className="relative">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full bg-transparent text-white/90 text-base font-medium py-3 pl-0 pr-8
                    ${underline} outline-none appearance-none rounded-none
                    ${disabled && 'opacity-60 cursor-not-allowed'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-0 top-[38px] w-4 h-4 text-white/60"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      <style>{`
        select option { background-color:#111827; color:#ffffff; }
        select::-ms-expand { display:none; }
        select { -webkit-appearance:none; -moz-appearance:none; appearance:none; background-image:none!important; }
      `}</style>
    </div>
  );
}
