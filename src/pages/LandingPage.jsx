import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/landing")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-center py-20 text-red-600 font-bold text-lg">Loading...</div>;

  return (
    <div className="font-sans bg-white text-gray-800">

      {/* ✅ HERO SECTION */}
      <section className="bg-gradient-to-br from-red-100 via-red-50 to-white px-10 py-20 md:flex items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-red-200 text-red-800 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide mb-4">
            {data.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            {data.hero.title} <span className="text-red-600">Counts</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">{data.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow-md">
              {data.hero.cta1}
            </button>
            <button className="border-2 border-red-600 text-red-600 hover:bg-red-100 transition px-6 py-3 rounded-lg font-semibold">
              {data.hero.cta2}
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src="/blood-donation.jpg"
              alt="Blood Donation"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute bottom-[-25px] left-6 bg-white border border-gray-200 shadow-lg px-6 py-4 rounded-full flex items-center gap-3 text-sm">
              <span className="text-green-600 text-lg font-bold">✔</span>
              <div>
                <span className="font-medium text-gray-800">2,547 Lives Saved</span><br />
                <span className="text-gray-500 text-xs">This month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ STATISTICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 py-12 px-10 bg-white">
        {data.stats.map((item, i) => (
          <div key={i}>
            <h2 className="text-4xl font-bold text-red-600">{item.value}</h2>
            <p className="text-sm text-gray-600 mt-2">{item.label}</p>
          </div>
        ))}
      </section>

      {/* ✅ HOW IT WORKS */}
      <section className="bg-red-50 py-16 px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How Life Stream Works</h2>
        <p className="text-gray-600 mb-12 text-sm md:text-base">Just a few simple steps to become a hero</p>
        <div className="grid gap-8 md:grid-cols-3">
          {data.steps.map((step, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                {i === 0 ? '🧾' : i === 1 ? '📅' : '💖'}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ OPTIONAL FOOTER COMPONENT */}
      {/* <Footer footer={data.footer} /> */}
    </div>
  );
}
