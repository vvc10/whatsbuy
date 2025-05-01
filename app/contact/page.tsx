import React from 'react';
import Header from '@/components/header';

const Contact = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <p className="mb-4">
          We’d love to hear from you! Whether it's feedback, issues, or partnership inquiries, reach out to us:
        </p>

        <p className="mb-2">
          📧 <a href="mailto:whatsbuy.help@gmail.com" className="text-blue-600">whatsbuy.help@gmail.com</a>
        </p>

        <p className="text-sm">
          We respond as quickly as possible — usually within 1-2 business days.
        </p>
      </main>
    </div>
  );
};

export default Contact;
