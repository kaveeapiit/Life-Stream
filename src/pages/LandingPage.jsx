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
              icon="heart"
              title="Emergency Saves"
              description="Sarah received 4 units during emergency surgery. Today she's a nurse helping others."
              gradient="from-red-500 to-pink-500"
            />
            <ImpactCard 
              icon="baby"
              title="New Life Support"
              description="Premature baby Alex needed blood transfusions. He's now a healthy 5-year-old."
              gradient="from-blue-500 to-cyan-500"
            />
            <ImpactCard 
              icon="shield"
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
              icon="globe"
              title="Global Reach"
              description="Connect with donors and hospitals across continents"
            />
            <FeatureCard 
              icon="lightning"
              title="Real-time Matching"
              description="AI-powered system matches donors with urgent needs instantly"
            />
            <FeatureCard 
              icon="shield"
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
  const gradients = [
    'from-red-500 to-rose-500',
    'from-red-600 to-pink-600', 
    'from-red-700 to-rose-700'
  ];

  const getIcon = (index) => {
    switch(index) {
      case 0:
        return (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      case 1:
        return (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
      case 2:
        return (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      default:
        return null;
    }
  };

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
        <div className={`relative w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
          {getIcon(index)}
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
  const getIcon = (iconType) => {
    switch(iconType) {
      case "heart":
        return (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case "baby":
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case "shield":
        return (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,17 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,17 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.5V11.5H13.5V10.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
        {getIcon(icon)}
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
  const getIcon = (iconType) => {
    switch(iconType) {
      case "globe":
        return (
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case "lightning":
        return (
          <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
        );
      case "shield":
        return (
          <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="mb-4">{getIcon(icon)}</div>
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
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
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
                {i % 2 === 0 ? (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H18C19.1 4 20 4.9 20 6V8H4V6C4 4.9 4.9 4 6 4H7ZM18 10V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V10H18ZM8 12V20H16V12H8Z"/>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
