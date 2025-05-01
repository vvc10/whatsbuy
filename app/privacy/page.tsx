import React from 'react';
import Header from '@/components/header';

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>WhatsBuy.in</strong>, we take your privacy seriously. Here's how we handle your information:
        </p>

        <ul className="list-disc pl-5 space-y-3 mb-4">
          <li>We collect personal data like name, phone, and email only to provide our services.</li>
          <li>We never sell or share your information with third parties for marketing.</li>
          <li>Your data is stored securely and used only for communication and support.</li>
          <li>You can request deletion or correction of your data by contacting us at <a href="mailto:whatsbuy.help@gmail.com" className="text-blue-600">whatsbuy.help@gmail.com</a>.</li>
        </ul>

        <p className="text-sm text-gray-600">
          By using WhatsBuy.in, you consent to our privacy practices.
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
