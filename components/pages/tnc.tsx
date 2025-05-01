import React from 'react';
import Header from '../header';

const TermsAndConditions = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="mb-4">
          Welcome to <strong>WhatsBuy.in</strong>! By using our platform, you agree to comply with and be bound by the following terms. Please read them carefully.
        </p>

        <ul className="list-disc pl-5 space-y-3 mb-4">
          <li>You must be at least 18 years old to use this platform.</li>
          <li>You agree to use our services only for lawful purposes.</li>
          <li>WhatsBuy.in is not responsible for third-party content or services linked on our platform.</li>
          <li>We reserve the right to modify, suspend, or discontinue services at any time without notice.</li>
          <li>All sales, promotions, and transactions are subject to our discretion and may be withdrawn or modified without notice.</li>
        </ul>

        <p className="text-sm text-gray-600">
          For any disputes, Indian laws will apply, and the jurisdiction will be Delhi, India.
        </p>
      </main>
    </div>
  );
};

export default TermsAndConditions;
