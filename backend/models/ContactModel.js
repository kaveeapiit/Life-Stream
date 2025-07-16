// models/ContactModel.js
export const getContactInfo = () => {
  return {
    address: "Kandy General Hospital\n123 Hospital Road, Kandy, Sri Lanka 20000",
    phone: ["+94 81 222 3333", "+94 77 888 9999"],
    email: ["info@lifestream.lk", "support@lifestream.lk"],
    hours: [
      "Monday - Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 4:00 PM",
      "Sunday: Emergency Only",
    ],
    emergency: {
      note: "For urgent blood requests and emergencies, contact us immediately:",
      phone: ["+94 81 EMERGENCY (24/7)", "+94 77 911 0000"]
    },
    socials: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  };
};
