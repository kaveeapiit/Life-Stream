import { useEffect, useState } from 'react';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then(res => res.json())
      .then(setAbout);
  }, []);

  if (!about) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-16">
        <h1 className="text-3xl font-bold mb-2">Welcome to Life Stream</h1>
        <p className="max-w-2xl mx-auto">
          Empowering healthcare through efficient blood management. Connecting donors,
          recipients, and medical facilities to save lives across Sri Lanka.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center py-10 bg-white">
        {about.stats.map((stat, index) => (
          <div key={index} className="py-4">
            <h2 className="text-2xl font-bold text-red-600">{stat.value}</h2>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Vision & Mission */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-4">About Life Stream</h2>
        <p className="text-center text-gray-600 mb-10">
          Based in the heart of {about.location.city}, we are dedicated to revolutionizing blood
          management through technology and compassion.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="border p-6 rounded-lg">
            <h3 className="text-red-600 font-semibold mb-2">{about.vision.title}</h3>
            <p>{about.vision.description}</p>
          </div>
          <div className="border p-6 rounded-lg">
            <h3 className="text-red-600 font-semibold mb-2">{about.mission.title}</h3>
            <p>{about.mission.description}</p>
          </div>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-6 items-center bg-red-50 p-6 rounded-lg">
          <div>
            <h3 className="font-bold text-lg text-red-600 mb-2">📍 Our Location</h3>
            <p className="font-medium mb-1">{about.location.city}</p>
            <p className="text-sm mb-2">{about.location.description}</p>
            <p className="text-sm text-gray-600">{about.location.phone}</p>
            <p className="text-sm text-gray-600">{about.location.email}</p>
          </div>
          <div>
            <img src={about.location.image} alt="Location" className="rounded-lg shadow" />
          </div>
        </div>
      </section>
    </div>
  );
}
