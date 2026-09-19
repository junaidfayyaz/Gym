'use client';

import React from 'react';
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-wider text-white uppercase font-mono">
                TITAN<span className="text-rose-500">FIT</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pakistan's premier strength & conditioning facility equipped with Hammer Strength plate-loaded machinery and master personal trainers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-rose-400 transition-colors">Gym Facilities</a></li>
              <li><a href="#plans" className="hover:text-rose-400 transition-colors">PKR Membership Tiers</a></li>
              <li><a href="#schedule" className="hover:text-rose-400 transition-colors">Timetable Schedule</a></li>
              <li><a href="#bmi" className="hover:text-rose-400 transition-colors">BMI Tool</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Working Hours</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between"><span>Mon - Sat:</span> <span className="text-white font-semibold">06:00 AM - 11:30 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span className="text-white font-semibold">04:00 PM - 10:00 PM</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Details</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Block H-3, Johar Town, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+92 300-1234567 / (042) 3555-TITAN</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TitanFit Gym Pakistan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
