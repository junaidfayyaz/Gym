'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white uppercase font-mono">
                TITAN<span className="text-rose-500">FIT</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase -mt-1">
                Premier Gym Pakistan
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-sm font-semibold text-slate-300 hover:text-rose-400 transition-colors">
              About Facilities
            </a>
            <a href="#plans" className="text-sm font-semibold text-slate-300 hover:text-rose-400 transition-colors">
              PKR Membership Plans
            </a>
            <a href="#schedule" className="text-sm font-semibold text-slate-300 hover:text-rose-400 transition-colors">
              Schedule
            </a>
            <a href="#bmi" className="text-sm font-semibold text-slate-300 hover:text-rose-400 transition-colors">
              BMI Calculator
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-300 hover:text-rose-400 transition-colors">
              Contact Us
            </a>
          </div>

          {/* Prominent Admin Login CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/admin/login"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-800"
          >
            About Facilities
          </a>
          <a
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-800"
          >
            PKR Membership Plans
          </a>
          <a
            href="#schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-800"
          >
            Schedule
          </a>
          <a
            href="#bmi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-800"
          >
            BMI Calculator
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-800"
          >
            Contact Us
          </a>
          <div className="pt-2">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm block shadow-lg shadow-rose-600/30"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
