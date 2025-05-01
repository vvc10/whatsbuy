import React from 'react';
import Header from '@/components/header';

const CookiePolicy = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

        <p className="mb-4">
          WhatsBuy.in uses cookies to enhance your browsing experience. Cookies help us:
        </p>

        <ul className="list-disc pl-5 space-y-3 mb-4">
          <li>Remember your preferences</li>
          <li>Analyze site traffic and usage</li>
          <li>Offer a smoother and more personalized experience</li>
        </ul>

        <p className="text-sm">
          You can manage or disable cookies via your browser settings.
        </p>
      </main>
    </div>
  );
};

export default CookiePolicy;
