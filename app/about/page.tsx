import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
const About = () => {
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto space-y-5 mt-12 px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">About WhatsBuy.in</h1>

        <p className="mb-4">
          <strong>WhatsBuy.in</strong> is an emerging platform built to empower creators, small businesses, and hustlers to launch their own online stores effortlessly.
        </p>

        <p className="mb-4">
          Whether you're a college student selling custom merchandise or a local artist monetizing your art, WhatsBuy.in gives you the tools to list, sell, and grow — without the complexity of traditional e-commerce.
        </p>

        <p className="mb-4">
          Our mission is simple: <em>Make online selling accessible, fast, and fun.</em>
        </p>

        <p className="mb-4">
          We believe in decentralizing online retail and giving power to every individual creator. No coding. No upfront cost. Just your idea — turned into reality.
        </p>

        <p className="text-sm text-gray-600 mt-6">
          Got feedback or ideas? Reach out to us at <a href="mailto:whatsbuy.help@gmail.com" className="text-blue-600">whatsbuy.help@gmail.com</a>. Let’s build the future of online commerce together.
        </p>
      </main>
      <Footer/>
    </div>
  );
};

export default About;
