import { useEffect, useState } from 'react';


// import Footer from '../components/Footer';

export default function LandingPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/landing")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="font-sans bg-white text-gray-800">
      {/* ✅ NAVBAR COMPONENT */}
      

      {/* Hero */}
      <section className="bg-red-50 px-10 py-16 md:flex justify-between items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-4 py-1 rounded-full mb-4">
            {data.hero.badge}
          </span>
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            {data.hero.title} <span className="text-red-600">Counts</span>
          </h1>
          <p className="text-gray-700 mb-8">{data.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700">
              {data.hero.cta1}
            </button>
            <button className="border border-red-600 text-red-600 px-6 py-3 rounded-md font-semibold hover:bg-red-100">
              {data.hero.cta2}
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src="/blood-donation.jpg"
              alt="Blood Donation"
              className="rounded-xl shadow-lg"
            />
            <div className="absolute bottom-[-20px] left-6 bg-white shadow-md px-6 py-3 rounded-full flex items-center space-x-2 text-sm">
              <span className="text-green-600 text-lg">✔</span>
              <span>2,547 Lives Saved<br /><span className="text-gray-500 text-xs">This month</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 py-10 bg-white px-10">
        {data.stats.map((item, i) => (
          <div key={i}>
            <h2 className="text-3xl font-extrabold text-gray-900">{item.value}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 text-center px-10">
        <h2 className="text-3xl font-bold mb-3">How Life Stream Works</h2>
        <p className="text-gray-600 mb-12">Simple steps to save lives</p>
        <div className="grid gap-6 md:grid-cols-3">
          {data.steps.map((step, i) => (
            <div key={i} className="bg-white border rounded-xl p-8 shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto text-2xl text-red-600 mb-4">
                {i === 0 ? '🧾' : i === 1 ? '📅' : '💖'}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FOOTER COMPONENT */}
      {/* <Footer footer={data.footer} /> */}
    </div>
  );
}
