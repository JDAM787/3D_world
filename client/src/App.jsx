import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <main className="flex flex-1 flex-col bg-gray-900">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default App;
