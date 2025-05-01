import React from 'react';
import Header from '@/components/header';

const HelpCenter = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 ">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>

        <p className="mb-4">
          Need help with your store or order? We’re here for you.
        </p>

        <p className="mb-2">
          📧 Email us at <a href="mailto:whatsbuy.help@gmail.com" className="text-blue-600">whatsbuy.help@gmail.com</a>
        </p>

        <p className="text-sm">
          Our support team typically responds within 24–48 hours.
        </p>
      </main>
    </div>
  );
};

export default HelpCenter;
