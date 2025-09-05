import { useEffect, useState, useRef } from 'react';
import favicon from '../assets/favicon.png';
import API_BASE_URL from '../config/api.js';


export default function LandingPage() {
  const [data, setData] = useState(null);
  const statsRef = useRef([]);
  const [statValues, setStatValues] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/landing`)
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
      <section className="relative py-32 px-6 md:px-10 text-white overflow-hidden">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-red-300/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-red-500/20 px-6 py-2 rounded-full border border-red-400/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-red-300 font-medium text-sm uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Your Journey to
              <span className="block text-red-300">Saving Lives</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Three simple steps to become someone's guardian angel and make a lasting impact in your community
            </p>
          </div>

          {/* Modern Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-red-500/50 via-red-400/50 to-red-500/50 -z-10" />
            
            {data.steps.map((step, i) => (
              <ModernStepCard key={i} step={step} index={i} delay={i * 150} />
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-20">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button className="group relative bg-white text-red-800 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-white/50">
                Watch Our Story
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT STORIES ===== */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Real Impact, Real Stories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every donation creates a ripple effect of hope and healing across our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ImpactCard 
              icon="❤️"
              title="Emergency Saves"
              description="Sarah received 4 units during emergency surgery. Today she's a nurse helping others."
              gradient="from-red-500 to-pink-500"
            />
            <ImpactCard 
              icon="👶"
              title="New Life Support"
              description="Premature baby Alex needed blood transfusions. He's now a healthy 5-year-old."
              gradient="from-blue-500 to-cyan-500"
            />
            <ImpactCard 
              icon="🏥"
              title="Cancer Fighter"
              description="Mark fought leukemia with support from 12 donors. He's been in remission for 2 years."
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY NETWORK ===== */}
      <section className="bg-gray-900 py-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join Our Global Network
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Connect with thousands of donors and medical professionals making a difference worldwide
          </p>

          {/* Network visualization */}
          <div className="relative h-64 mb-12">
            <NetworkVisualization />
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FeatureCard 
              icon="🌍"
              title="Global Reach"
              description="Connect with donors and hospitals across continents"
            />
            <FeatureCard 
              icon="⚡"
              title="Real-time Matching"
              description="AI-powered system matches donors with urgent needs instantly"
            />
            <FeatureCard 
              icon="🔒"
              title="Secure & Private"
              description="Your health data is protected with military-grade encryption"
            />
          </div>
        </div>
      </section>

      {/* Animations & extras */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp .55s ease forwards; }
        .animate-textShimmer {
          background-size: 200% auto;
          animation: textShimmer 3s linear infinite;
        }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .tilt:hover { transform: perspective(800px) rotateX(4deg) rotateY(-6deg) scale(1.02); }
        .tilt { transition: transform .35s ease; }
        
        /* Modern gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Glassmorphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
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

/* ---------- NEW Modern Components ---------- */

function ModernStepCard({ step, index, delay = 0 }) {
  const icons = ['🚀', '⚡', '💫'];
  const gradients = [
    'from-red-500 to-rose-500',
    'from-red-600 to-pink-600', 
    'from-red-700 to-rose-700'
  ];

  return (
    <div
      className="relative group animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Floating number */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-white to-red-50 border-2 border-red-200 rounded-full flex items-center justify-center font-bold text-red-600 shadow-lg z-10">
        {index + 1}
      </div>

      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 h-full group-hover:bg-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className={`relative w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
          {icons[index]}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors">
            {step.title}
          </h3>
          <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
            {step.description}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-red-500/10 rounded-full blur-lg" />
      </div>
    </div>
  );
}

function ImpactCard({ icon, title, description, gradient }) {
  return (
    <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function NetworkVisualization() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central hub */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          <span className="text-2xl">🏥</span>
        </div>
        
        {/* Connecting nodes */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div key={i}>
              {/* Connection line */}
              <div 
                className="absolute w-px bg-gradient-to-r from-red-500/50 to-transparent h-24 origin-bottom"
                style={{
                  transform: `translate(${x/2}px, ${y/2}px) rotate(${i * 45}deg)`,
                  left: '50%',
                  top: '50%'
                }}
              />
              
              {/* Node */}
              <div 
                className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <span className="text-sm">{i % 2 === 0 ? '👤' : '🩸'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
