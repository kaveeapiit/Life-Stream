import { useEffect, useState } from 'react';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle
} from 'react-icons/fa';

export default function Contact() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then(res => res.json())
      .then(setContact)
      .catch(err => console.error("Failed to fetch contact data", err));
  }, []);

  if (!contact) return <p className="text-center mt-16 text-lg font-semibold text-gray-500">Loading contact info...</p>;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-800 animate-fade-in">
      <h1 className="text-4xl font-extrabold flex items-center gap-2 mb-2 text-red-600">
        📞 Contact Us
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Reach out to our team for inquiries or support regarding the Life Stream blood management system.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl border p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h3>
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input placeholder="Last Name" className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input placeholder="Phone Number" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input placeholder="Subject" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
            <textarea placeholder="Message" rows="4" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <FaEnvelope /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Get in Touch</h3>
            <p className="flex gap-2 items-start text-gray-700 mb-2"><FaMapMarkerAlt className="mt-1 text-red-600" /> {contact.address}</p>
            {contact.phone.map((num, i) => (
              <p key={i} className="flex items-center gap-2 text-gray-700"><FaPhoneAlt className="text-red-500" /> {num}</p>
            ))}
            {contact.email.map((email, i) => (
              <p key={i} className="flex items-center gap-2 text-gray-700"><FaEnvelope className="text-red-500" /> {email}</p>
            ))}
            <div className="mt-4 text-sm text-gray-500">
              {contact.hours.map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
            <h4 className="flex items-center gap-2 font-bold text-lg"><FaExclamationTriangle /> Emergency Contact</h4>
            <p className="mt-2">{contact.emergency.note}</p>
            {contact.emergency.phone.map((em, i) => <p key={i}>{em}</p>)}
          </div>

          <div className="flex gap-4 mt-2 text-2xl text-gray-600">
            {contact.socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition-colors"
              >
                {s.platform === "facebook" && <FaFacebook />}
                {s.platform === "twitter" && <FaTwitter />}
                {s.platform === "instagram" && <FaInstagram />}
                {s.platform === "linkedin" && <FaLinkedin />}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
