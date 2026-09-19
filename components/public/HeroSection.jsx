'use client';

import React from 'react';
import { ArrowRight, Flame, ShieldCheck, Trophy, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-slate-950 pt-12 pb-24 border-b border-slate-900">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Pakistan's Ultimate Physical Training Hub</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              FORGE YOUR UNSTOPPABLE <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                ATHLETIC PHYSICIAN
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              State-of-the-art hypertrophy machinery, certified strength coaches, and affordable membership packages in Pakistani Rupees (PKR).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#plans"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-base shadow-xl shadow-rose-600/35 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1"
              >
                <span>Explore Membership Plans</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-base flex items-center justify-center space-x-2 transition-all"
              >
                <span>Contact Us</span>
              </a>
            </div>

            {/* Quick Stats in PKR Context */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-900 max-w-lg mx-auto lg:mx-0">
              <div>
                <h4 className="text-2xl font-black text-white">Rs. 3,500</h4>
                <p className="text-xs text-slate-400 font-medium">Starting Monthly Fee</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">1,200+</h4>
                <p className="text-xs text-slate-400 font-medium">Active Members</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">100%</h4>
                <p className="text-xs text-slate-400 font-medium">Certified Master Coaches</p>
              </div>
            </div>
          </div>

          {/* Right Image Feature Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
                alt="Gym Equipment"
                className="w-full h-[460px] object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">JazzCash & EasyPaisa Accepted</h5>
                    <p className="text-xs text-slate-400">Convenient fee payment options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
