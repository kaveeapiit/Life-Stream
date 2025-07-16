import { useEffect, useState } from 'react';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then(res => res.json())
      .then(setAbout);
  }, []);

  if (!about) return <p className="text-center mt-20 text-lg text-gray-600">Loading...</p>;

  return (
    <div className="text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-20 px-4 shadow-md">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Life Stream</h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90 leading-relaxed">
          Empowering healthcare through efficient blood management. Connecting donors,
          recipients, and medical facilities to save lives across Sri Lanka.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center py-12 bg-gray-50">
        {about.stats.map((stat, index) => (
          <div key={index} className="py-6">
            <h2 className="text-3xl font-extrabold text-red-600 mb-2">{stat.value}</h2>
            <p className="text-gray-700 font-medium text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Vision & Mission */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">About Life Stream</h2>
        <p className="text-center text-gray-600 mb-12 text-base leading-relaxed">
          Based in the heart of <span className="font-semibold text-gray-800">{about.location.city}</span>, we are
          dedicated to revolutionizing blood management through technology and compassion.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-red-100 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h3 className="text-xl text-red-600 font-semibold mb-3">{about.vision.title}</h3>
            <p className="text-gray-700 leading-relaxed">{about.vision.description}</p>
          </div>
          <div className="border border-red-100 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h3 className="text-xl text-red-600 font-semibold mb-3">{about.mission.title}</h3>
            <p className="text-gray-700 leading-relaxed">{about.mission.description}</p>
          </div>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-red-50 p-6 rounded-2xl shadow-inner">
          <div>
            <h3 className="font-bold text-2xl text-red-700 mb-4">📍 Our Location</h3>
            <p className="text-lg font-semibold mb-1">{about.location.city}</p>
            <p className="text-base text-gray-700 mb-3">{about.location.description}</p>
            <p className="text-sm text-gray-600 mb-1">📞 {about.location.phone}</p>
            <p className="text-sm text-gray-600">✉️ {about.location.email}</p>
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
