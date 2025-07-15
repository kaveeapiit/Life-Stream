export const getLandingData = (req, res) => {
  res.json({
    hero: {
      badge: "Save Lives Today",
      title: "Every Drop Counts",
      subtitle:
        "Join our blood donation campaign and help save lives in your community. Your single donation can save up to three lives.",
      cta1: "Donate Now",
      cta2: "Learn More",
    },
    stats: [
      { label: "Registered Donors", value: "15,000+" },
      { label: "Units Collected", value: "8,500+" },
      { label: "Partner Hospitals", value: "120+" },
      { label: "Lives Saved", value: "25,000+" },
    ],
    steps: [
      {
        title: "Register",
        description: "Sign up as a donor and complete your health screening.",
      },
      {
        title: "Schedule",
        description: "Book an appointment at your nearest donation center.",
      },
      {
        title: "Donate",
        description: "Make your donation and help save up to 3 lives.",
      },
    ],
    footer: {
      address: "Kandy, Sri Lanka",
      phone: "081 XXX XXX",
      email: "info@lifestream.com",
    },
  });
};

//hello world
