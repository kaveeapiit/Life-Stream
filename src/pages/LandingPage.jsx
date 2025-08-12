import { useEffect, useState, useRef } from 'react';
import favicon from '../assets/favicon.png'; // adjust path relative to this file

export default function LandingPage() {
  const [data, setData] = useState(null);
  const statsRef = useRef([]);
  const [statValues, setStatValues] = useState([]);

  useEffect(() => {
    fetch('https://life-stream-production-2f47.up.railway.app/api/landing')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setStatValues(d.stats.map(() => 0));
      })
      .catch(() => setData(false));
  }, []);

  // simple count-up animation
  useEffect(() => {
    if (!data) return;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const prog = Math.min((now - start) / duration, 1);
      setStatValues(data.stats.map(s => Math.floor(prog * Number(String(s.value).replace(/\D/g,''))) + (typeof s.value === 'string' && /\D$/.test(s.value) ? s.value.replace(/\d+/g,'') : '')));
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [data]);

  if (data === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-48 h-6 bg-gray-700 rounded mx-auto" />
          <div className="w-72 h-4 bg-gray-700 rounded mx-auto" />
        </div>
      </div>
    );
  }
  if (data === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 font-semibold">
        Failed to load landing data.
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-100 bg-gray-900 overflow-hidden relative">
      {/* ===== HERO ===== */}
      <section className="relative px-6 md:px-10 pt-28 pb-32 md:py-40 flex flex-col md:flex-row items-center gap-14 md:gap-20">
        {/* Parallax blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <ParallaxBlob className="w-[30rem] h-[30rem] bg-red-600/25 blur-3xl" x="5%" y="8%" />
          <ParallaxBlob className="w-[24rem] h-[24rem] bg-red-500/20 blur-3xl" x="85%" y="78%" reverse />
        </div>

        <div className="md:w-1/2 text-center md:text-left animate-fadeIn">
          <span className="inline-block bg-red-500/20 text-red-300 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-6 border border-red-400/30 backdrop-blur-sm">
            {data.hero.badge}
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-red-300 to-red-500 bg-clip-text text-transparent animate-textShimmer">
            {data.hero.title} <span className="text-white">Counts</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-xl md:mx-0 mx-auto">
            {data.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-red-600 hover:bg-red-500 transition text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-red-700/20 hover:shadow-red-600/40">
              {data.hero.cta1}
            </button>
            <button className="border-2 border-red-500 text-red-300 hover:bg-red-500/10 transition px-7 py-3.5 rounded-xl font-semibold">
              {data.hero.cta2}
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 animate-fadeInUp" style={{ animationDelay: '120ms' }}>
          <div className="relative w-full max-w-md mx-auto group">
            <img
              src={favicon} alt="Blood Donation"
              className="rounded-2xl shadow-2xl shadow-black/50 border border-white/10 transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute -bottom-6 left-6 bg-white/95 text-gray-800 border border-gray-200 shadow-lg px-6 py-4 rounded-full flex items-center gap-3 text-sm">
              <span className="text-green-600 text-lg font-bold">✔</span>
              <div>
                <span className="font-semibold">2,547 Lives Saved</span><br />
                <span className="text-gray-500 text-xs">This month</span>
              </div>
            </div>
          </div>
        </div>

        {/* marquee ticker */}
        <Marquee text="Donate • Save Lives • Be a Hero • Life Stream" />
      </section>

      {/* Wave divider */}
      <SVGWave className="text-gray-900 fill-current -mt-1 rotate-180" />

      {/* ===== STATS ===== */}
      <section className="bg-gray-100 text-gray-800 py-16 px-6 md:px-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {data.stats.map((item, i) => (
            <div
              key={i}
              ref={el => statsRef.current[i] = el}
              className="animate-fadeInUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 drop-shadow-sm">
                {statValues[i] || item.value}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-red-50 py-24 px-6 md:px-10 text-gray-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Life Stream Works</h2>
          <p className="text-gray-600 mb-16 text-sm md:text-base">
            Just a few simple steps to become a hero
          </p>

          <div className="relative grid gap-12 md:grid-cols-3">
            {/* connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 w-1/3 h-[2px] bg-red-200 -z-10" />

            {data.steps.map((step, i) => (
              <TiltCard key={i} delay={i * 90}>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-6">
                  {i === 0 ? '🧾' : i === 1 ? '📅' : '💖'}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{step.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer placeholder */}
      {/* <Footer footer={data.footer} /> */}

      {/* Animations & extras */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp .55s ease forwards; }
        .animate-textShimmer {
          background-size: 200% auto;
          animation: textShimmer 3s linear infinite;
        }
        .tilt:hover { transform: perspective(800px) rotateX(4deg) rotateY(-6deg) scale(1.02); }
        .tilt { transition: transform .35s ease; }
        /* Marquee */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Components ---------- */
function ParallaxBlob({ className, x, y, reverse = false }) {
  return (
    <div
      className={`${className} rounded-full absolute`}
      style={{ left: x, top: y, animation: `float ${reverse ? '6s' : '8s'} ease-in-out infinite alternate` }}
    />
  );
}

function Marquee({ text }) {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden h-8 md:h-10 text-red-200/40 text-xs md:text-sm uppercase pointer-events-none">
      <div className="whitespace-nowrap flex animate-[marquee_18s_linear_infinite]">
        <span className="mx-10">{text}</span>
        <span className="mx-10">{text}</span>
        <span className="mx-10">{text}</span>
        <span className="mx-10">{text}</span>
      </div>
    </div>
  );
}

function TiltCard({ children, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl border border-red-100 tilt animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SVGWave({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path d="M0,64L48,69.3C96,75,192,85,288,96C384,107,480,117,576,101.3C672,85,768,43,864,26.7C960,11,1056,21,1152,26.7C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
    </svg>
  );
}
