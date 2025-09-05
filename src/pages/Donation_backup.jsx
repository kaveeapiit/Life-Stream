import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
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
        setStatus({ type: 'success', message: '🎉 Donation registered!' });
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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-16 -left-16 sm:-top-24 sm:-left-24 animate-pulse" />
        <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl animate-fadeIn my-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
            Donate Blood. <span className="text-red-400">Save Lives.</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            Confirm your details and choose the nearest blood bank.
          </p>
        </header>

        {/* status */}
        {status.message && (
          <div
            className={`mb-4 sm:mb-6 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium ${
              status.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <ChipField label="Full Name" value={form.name} readOnly />
          <ChipField label="Email" value={form.email} readOnly type="email" />
          <ChipField label="Blood Type" value={form.bloodType || 'N/A'} readOnly />

          <FancySelect
            label="Nearest Blood Bank"
            value={form.location}
            onChange={val => setForm({ ...form, location: val })}
            placeholder="Select Location"
            options={[
              { value: 'Colombo National Blood Bank', primary: 'Colombo', secondary: 'National Blood Bank' },
              { value: 'Kandy General Hospital',       primary: 'Kandy',   secondary: 'General Hospital'   },
              { value: 'Galle Teaching Hospital',      primary: 'Galle',   secondary: 'Teaching Hospital'  },
              { value: 'Jaffna Hospital',              primary: 'Jaffna',  secondary: 'Hospital'           },
              { value: 'Kurunegala Hospital',          primary: 'Kurunegala', secondary: 'Hospital'        },
              { value: 'Badulla Hospital',             primary: 'Badulla', secondary: 'Hospital'           },
              { value: 'Anuradhapura Hospital',        primary: 'Anuradhapura', secondary: 'Hospital'      },
            ]}
          />

          <button
            type="submit"
            disabled={loading || !isLoggedIn}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide shadow transition
              ${isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'}
              ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting…' : 'Submit Donation') : 'Please login'}
          </button>

          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mt-2">
              <div className="h-full bg-red-500 animate-loadingBar" />
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

/* ---------- Components ---------- */

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

/* Custom select with two-color options */
function FancySelect({ label, value, onChange, options, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  // close on outside
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

  // keyboard nav
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
