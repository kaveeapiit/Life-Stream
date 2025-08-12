import { useEffect, useState } from 'react';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch('http://life-stream-production-2f47.up.railway.app/api/about')
      .then(res => res.json())
      .then(setAbout)
      .catch(() => setAbout(false));
  }, []);

  if (about === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-center space-y-3">
          <div className="w-56 h-6 bg-gray-700 rounded mx-auto" />
          <div className="w-80 h-4 bg-gray-700 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (about === false) {
    return (
      <p className="text-center mt-20 text-lg text-red-400">
        Failed to load About data.
      </p>
    );
  }

  return (
    <div className="text-white font-sans bg-gray-900 min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden text-center py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/40 via-red-900/30 to-black" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-400/20 blur-3xl rounded-full" />

        <div className="relative max-w-3xl mx-auto animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Welcome to <span className="text-red-400">Life Stream</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            Empowering healthcare through efficient blood management. Connecting donors,
            recipients, and medical facilities to save lives across Sri Lanka.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {about.stats.map((stat, i) => (
            <div
              key={i}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl py-8 text-center shadow-lg animate-fadeInUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-red-400 mb-2">
                {stat.value}
              </h2>
              <p className="text-sm md:text-base text-gray-200 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT, VISION, MISSION */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 animate-fadeIn">
          About Life Stream
        </h2>
        <p className="text-center text-gray-300 mb-14 text-base md:text-lg leading-relaxed animate-fadeIn">
          Based in the heart of <span className="font-semibold text-white">{about.location.city}</span>, we are
          dedicated to revolutionizing blood management through technology and compassion.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <Card
            delay={0}
            title={about.vision.title}
            text={about.vision.description}
            accent="from-red-500/20 to-red-800/20"
          />
          <Card
            delay={120}
            title={about.mission.title}
            text={about.mission.description}
            accent="from-red-500/20 to-red-800/20"
          />
        </div>

        {/* LOCATION */}
        <div className="grid md:grid-cols-2 gap-10 items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fadeInUp">
          <div className="space-y-2">
            <h3 className="font-bold text-2xl mb-4">📍 Our Location</h3>
            <p className="text-lg font-semibold mb-1">{about.location.city}</p>
            <p className="text-base text-gray-200 mb-4 leading-relaxed">
              {about.location.description}
            </p>
            <p className="text-sm text-gray-300 mb-1">📞 {about.location.phone}</p>
            <p className="text-sm text-gray-300">✉️ {about.location.email}</p>
          </div>
          <img
            src={about.location.image}
            alt="Location"
            className="rounded-xl shadow-lg w-full object-cover h-64 md:h-80"
          />
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp .5s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---------- Small Card component ---------- */
function Card({ title, text, accent = 'from-gray-700/30 to-gray-800/30', delay = 0 }) {
  return (
    <div
      className={`rounded-xl p-8 border border-white/10 bg-gradient-to-br ${accent}
                  hover:border-red-500/40 hover:shadow-red-700/20 hover:shadow-xl transition-all animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-200 leading-relaxed text-sm md:text-base">{text}</p>
    </div>
  );
}
