import { useEffect, useState } from 'react';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle,
  FaPhone
} from 'react-icons/fa';
import API_BASE_URL from '../config/api.js';

export default function Contact() {
  const [contact, setContact] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    first: '', last: '', email: '', phone: '', subject: '', message: ''
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact`)
      .then(res => res.json())
      .then(setContact)
      .catch(() => setContact(false));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setSending(true);
    // TODO: POST to your backend
    setTimeout(() => {
      alert('Message sent!');
      setSending(false);
      setForm({ first: '', last: '', email: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  if (contact === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 w-56 bg-gray-700 rounded mx-auto" />
          <div className="h-4 w-80 bg-gray-700 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (contact === false) {
    return (
      <p className="text-center mt-24 text-red-400 text-lg">
        Failed to load contact info.
      </p>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-x-hidden">
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-red-600/30 blur-3xl rounded-full absolute -top-16 -left-16 sm:-top-28 sm:-left-28 animate-pulse" />
        <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 animate-fadeIn">
        <header className="mb-8 sm:mb-12 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3 justify-center md:justify-start">
            <FaPhone className="text-red-500" /> Contact Us
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base">
            Reach out to our team for inquiries or support regarding the Life Stream blood management system.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* FORM */}
          <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fadeInUp">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4 sm:space-y-6" onSubmit={submit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatInput label="First Name" name="first" value={form.first} onChange={onChange} />
                <FloatInput label="Last Name" name="last" value={form.last} onChange={onChange} />
              </div>
              <FloatInput type="email" label="Email Address" name="email" value={form.email} onChange={onChange} />
              <FloatInput label="Phone Number" name="phone" value={form.phone} onChange={onChange} />
              <FloatInput label="Subject" name="subject" value={form.subject} onChange={onChange} />
              <FloatTextarea label="Message" name="message" value={form.message} onChange={onChange} />

              <button
                disabled={sending}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 sm:py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow text-sm sm:text-base touch-manipulation"
              >
                <FaEnvelope /> {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </section>

          {/* INFO COLUMN */}
          <section className="flex flex-col gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '120ms' }}>
            {/* Contact Info Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="flex gap-2 items-start mb-3 text-gray-200">
                <FaMapMarkerAlt className="mt-1 text-red-500" /> {contact.address}
              </p>

              {contact.phone.map((num, i) => (
                <p key={i} className="flex items-center gap-2 text-gray-200">
                  <FaPhoneAlt className="text-red-500" /> {num}
                </p>
              ))}

              {contact.email.map((em, i) => (
                <p key={i} className="flex items-center gap-2 text-gray-200">
                  <FaEnvelope className="text-red-500" /> {em}
                </p>
              ))}

              <div className="mt-4 text-sm text-gray-400 space-y-1">
                {contact.hours.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
              <h4 className="flex items-center gap-2 font-bold text-lg">
                <FaExclamationTriangle /> Emergency Contact
              </h4>
              <p className="mt-2 text-sm">{contact.emergency.note}</p>
              <div className="mt-2 space-y-1 text-base">
                {contact.emergency.phone.map((em, i) => <p key={i}>{em}</p>)}
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-4 text-2xl mt-2">
              {contact.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  {s.platform === 'facebook' && <FaFacebook />}
                  {s.platform === 'twitter' && <FaTwitter />}
                  {s.platform === 'instagram' && <FaInstagram />}
                  {s.platform === 'linkedin' && <FaLinkedin />}
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* MAP (optional) */}
        {contact.mapEmbed && (
          <div className="mt-16 rounded-2xl overflow-hidden border border-white/10 shadow-xl animate-fadeInUp" style={{ animationDelay: '240ms' }}>
            <iframe
              title="map"
              src={contact.mapEmbed}
              className="w-full h-80 md:h-96"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform:translateY(6px);} to {opacity:1; transform:translateY(0);} }
        @keyframes fadeInUp { from {opacity:0; transform:translateY(14px);} to {opacity:1; transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp .5s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---------- Floating label inputs ---------- */
function FloatInput({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        required
      />
      <label
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all
        ${value ? 'top-1 text-xs text-red-400' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}

function FloatTextarea({ label, name, value, onChange }) {
  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        rows="4"
        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        required
      />
      <label
        className={`absolute left-4 top-4 text-gray-400 text-sm pointer-events-none transition-all
        ${value ? 'top-1 text-xs text-red-400' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}
