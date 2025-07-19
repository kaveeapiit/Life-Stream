import { useEffect, useState } from 'react';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then(res => res.json())
      .then(setAbout);
  }, []);

  if (!about) return <p className="text-center mt-20 text-lg text-white">Loading...</p>;

  return (
    <div className="text-white font-sans bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-center py-20 px-4 shadow-md">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Life Stream</h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90 leading-relaxed">
          Empowering healthcare through efficient blood management. Connecting donors,
          recipients, and medical facilities to save lives across Sri Lanka.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center py-12 bg-gray-800 border-t border-gray-700">
        {about.stats.map((stat, index) => (
          <div key={index} className="py-6">
            <h2 className="text-3xl font-extrabold text-white mb-2">{stat.value}</h2>
            <p className="text-white font-medium text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Vision & Mission */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-6">About Life Stream</h2>
        <p className="text-center text-white mb-12 text-base leading-relaxed">
          Based in the heart of <span className="font-semibold">{about.location.city}</span>, we are
          dedicated to revolutionizing blood management through technology and compassion.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-gray-500 p-6 rounded-xl bg-gray-800 hover:border-red-600 hover:shadow-md transition">
            <h3 className="text-xl text-white font-semibold mb-3">{about.vision.title}</h3>
            <p className="text-white leading-relaxed">{about.vision.description}</p>
          </div>
          <div className="border border-gray-500 p-6 rounded-xl bg-gray-800 hover:border-red-600 hover:shadow-md transition">
            <h3 className="text-xl text-white font-semibold mb-3">{about.mission.title}</h3>
            <p className="text-white leading-relaxed">{about.mission.description}</p>
          </div>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-700">
          <div>
            <h3 className="font-bold text-2xl text-white mb-4">📍 Our Location</h3>
            <p className="text-lg font-semibold mb-1">{about.location.city}</p>
            <p className="text-base text-white mb-3">{about.location.description}</p>
            <p className="text-sm text-white mb-1">📞 {about.location.phone}</p>
            <p className="text-sm text-white">✉️ {about.location.email}</p>
          </div>
          <div>
            <img
              src={about.location.image}
              alt="Location"
              className="rounded-xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
