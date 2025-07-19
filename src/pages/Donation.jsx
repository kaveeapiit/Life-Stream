import React from 'react';
import DonationForm from '../components/DonationForm';

export default function Donation() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Donate Blood. Save Lives.</h1>
      <p className="text-gray-700 max-w-2xl text-center mb-8">
        Your donation can help save a life. Fill in the form below to make a contribution to our life-saving efforts.
      </p>
      <DonationForm />
    </div>
  );
}
