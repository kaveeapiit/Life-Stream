export const getAboutInfo = () => ({
  stats: [
    { label: "Active Donors", value: "2,500+" },
    { label: "Partner Hospitals", value: "45+" },
    { label: "Units Collected", value: "15,000+" },
    { label: "Lives Saved", value: "8,500+" },
  ],
  vision: {
    title: "Our Vision",
    description: "To create a world where no life is lost due to blood shortage. We envision a seamlessly connected healthcare ecosystem where blood donation and distribution is efficient, transparent, and accessible to all communities across Sri Lanka.",
  },
  mission: {
    title: "Our Mission",
    description: "To bridge the gap between blood donors and recipients through innovative technology. We are committed to maintaining the highest standards of safety, efficiency, and reliability in blood management while fostering a culture of voluntary donation.",
  },
  location: {
    city: "Kandy, Sri Lanka",
    description: "Strategically located in the cultural capital of Sri Lanka, our headquarters in Kandy serves as the central hub for coordinating blood management activities across the Central Province and beyond.",
    phone: "+94 81 XXX XXX",
    email: "info@lifestream.lk",
    image: "/images/kandy.jpg",
  }
});
