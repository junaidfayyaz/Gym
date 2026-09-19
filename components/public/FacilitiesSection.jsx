'use client';

import React from 'react';
import { Dumbbell, Zap, Award, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

const FacilitiesSection = () => {
  return (
    <section id="about" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>World-Class Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Facilities & Equipment Showcase
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Equipped with imported Hammer Strength plate-loaded machinery, Olympic lifting platforms, and dedicated cardio suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 w-fit border border-rose-500/20">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Heavy Powerlifting Zone</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calibrated bumper plates, competition power racks, and deadlift platforms designed for raw power.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Advanced Cardio Suite</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Commercial stairmasters, curved treadmills, and rowing machines with real-time heart rate monitoring.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Master Personal Coaching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              1-on-1 personalized hypertrophy and weight-loss coaching by certified fitness specialists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
