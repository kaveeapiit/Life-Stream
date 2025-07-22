// FindBlood.jsx  (includes BOTH selects: DarkSelect + FancyDropdown)
// Pick ONE and comment the other where indicated.

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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
      const res = await fetch('http://localhost:5000/api/blood/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: '✅ Request submitted!' });
        setForm(f => ({ ...f, blood_type: '', location: '', urgency: false }));
        navigate('/pending-requests');
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

  const bloodOptions = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl animate-fadeIn">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Request <span className="text-red-400">Blood</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">Fill the form below to notify nearby hospitals.</p>
        </header>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              msg.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <UnderInput label="Full Name" name="name" value={form.name} readOnly />
          <UnderInput label="Email Address" name="email" type="email" value={form.email} readOnly />

          {/* ---- CHOOSE ONE OF THESE TWO ---- */}

          {/* 1) Dark native-like select */}
          <DarkSelect
            label="Blood Type"
            name="blood_type"
            value={form.blood_type}
            onChange={handleChange}
            placeholder="Select Blood Type"
            options={bloodOptions}
            disabled={!isLoggedIn}
            required
          />

          {/* 2) Custom dropdown (comment out DarkSelect above if you use this) */}
          {/* <FancyDropdown
            label="Blood Type"
            value={form.blood_type}
            onChange={val => setForm({ ...form, blood_type: val })}
            placeholder="Select Blood Type"
            disabled={!isLoggedIn}
            options={bloodOptions.map(bt => ({ value: bt, label: bt }))}
          /> */}

          <UnderInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />

          {/* Urgency toggle */}
          <label className="flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="urgency"
              checked={form.urgency}
              onChange={handleChange}
              disabled={!isLoggedIn}
              className="sr-only"
            />
            <span
              className={`inline-block w-12 h-6 rounded-full transition-all relative
                ${form.urgency ? 'bg-red-600' : 'bg-gray-600'}
                ${!isLoggedIn && 'opacity-50 cursor-not-allowed'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                ${form.urgency ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </span>
            <span className="font-semibold text-sm text-red-300">Mark as Urgent</span>
          </label>

          <button
            type="submit"
            disabled={!isLoggedIn || loading}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide shadow transition
              ${isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'}
              ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting…' : 'Submit Request') : 'Login to Submit'}
          </button>

          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mt-2">
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

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

/* ---------- Underline inputs ---------- */
const baseInput =
  "w-full bg-transparent text-white/90 text-base font-medium py-3 focus:outline-none";
const underline =
  "border-b border-white/20 focus:border-red-500 transition-colors duration-200";
const labelCls =
  "block text-sm font-semibold text-white/70 mb-1";

function UnderInput({ label, name, value, onChange, type="text", readOnly=false, disabled=false, required }) {
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
        className={`${baseInput} ${underline} ${disabled||readOnly ? "opacity-60 cursor-not-allowed":""}`}
      />
    </div>
  );
}

/* ---------- Dark native-like select ---------- */
function DarkSelect({ label, name, value, onChange, options, placeholder, disabled=false, required=false }) {
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

      {/* caret */}
      <svg
        className="pointer-events-none absolute right-0 top-[38px] w-4 h-4 text-white/60"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {/* darken option list */}
      <style>{`
        select option { background-color:#111827; color:#ffffff; }
        select::-ms-expand { display:none; }
        select { -webkit-appearance:none; -moz-appearance:none; appearance:none; background-image:none!important; }
      `}</style>
    </div>
  );
}

/* ---------- Fancy custom dropdown ---------- */
function FancyDropdown({ label, value, onChange, options, placeholder = 'Select…', disabled=false }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find(o => o.value === value);

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
    if (disabled) return;
    if (!open) {
      if (['ArrowDown','Enter',' '].includes(e.key)) {
        e.preventDefault(); setOpen(true); setActiveIdx(0);
      }
      return;
    }
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i + 1) % options.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => (i - 1 + options.length) % options.length); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) { onChange(options[activeIdx].value); setOpen(false); }
    }
  };

  return (
    <div className="relative">
      <label className={labelCls}>{label}</label>

      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={onKeyDown}
        className={`w-full bg-transparent text-white/90 text-base font-medium py-3 pl-0 pr-9
                    ${underline} outline-none flex items-center justify-between
                    ${disabled && 'opacity-60 cursor-not-allowed'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'text-white/40'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-gray-800/95 backdrop-blur
                     border border-gray-700 shadow-xl focus:outline-none animate-dropdown"
        >
          {options.map((o, idx) => {
            const isActive = idx === activeIdx;
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                className={`px-4 py-2 text-sm cursor-pointer
                  ${isSelected ? 'bg-red-600/30 text-red-200' : isActive ? 'bg-white/10 text-white' : 'text-white/90'}
                  hover:bg-white/10`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        @keyframes ddin {from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        .animate-dropdown{animation:ddin .15s ease-out forwards}
      `}</style>
    </div>
  );
}
