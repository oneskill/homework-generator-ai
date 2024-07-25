'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
          <img src="logo/logo.png" alt="Logo" style={{width: '350px'}} />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="hover:text-purple-200 transition">Dashboard</Link>
            <Link href="/setup" className="hover:text-purple-200 transition">Setup Assessment</Link>
          </nav>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <Link href="/dashboard" className="block py-2 hover:text-purple-200 transition">Dashboard</Link>
            <Link href="/setup" className="block py-2 hover:text-purple-200 transition">Setup Assessment</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;