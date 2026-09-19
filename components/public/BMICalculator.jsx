'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

const BMICalculator = () => {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(175);
  const [weightLbs, setWeightLbs] = useState(158);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);

  const calculateBMI = () => {
    let val = 0;
    if (unit === 'metric') {
      const hMeters = height / 100;
      if (hMeters > 0) val = weight / (hMeters * hMeters);
    } else {
      const totalInches = heightFeet * 12 + parseFloat(heightInches || 0);
      if (totalInches > 0) val = (weightLbs / (totalInches * totalInches)) * 703;
    }
    return parseFloat(val.toFixed(1));
  };

  const bmi = calculateBMI();

  const getRegimen = (val) => {
    if (val < 18.5) {
      return {
        category: 'Underweight',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        plan: 'Monthly / Executive Split',
        regimen: 'Focus on caloric surplus nutrition and compound strength loading.',
      };
    } else if (val >= 18.5 && val <= 24.9) {
      return {
        category: 'Normal Weight (Optimal)',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        plan: 'Executive Quarterly Split',
        regimen: 'Maintain athletic physique with balanced strength & hypertrophy split.',
      };
    } else if (val >= 25.0 && val <= 29.9) {
      return {
        category: 'Overweight',
        color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
        plan: 'Executive Quarterly Split (HIIT Focus)',
        regimen: 'Pair caloric deficit diet with high-intensity metabolic conditioning.',
      };
    } else {
      return {
        category: 'Obese Range',
        color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        plan: 'VIP Annual Championship',
        regimen: '1-on-1 Master Personal Trainer supervision and cardio mobility coaching.',
      };
    }
  };

  const info = getRegimen(bmi);

  return (
    <div id="bmi" className="py-20 bg-slate-900/50 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Health & Physique Metric</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate Your Body Mass Index (BMI)
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Instantly determine your physical baseline and receive automated gym regimen suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setUnit('metric')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  unit === 'metric' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  unit === 'imperial' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Imperial (lbs / feet)
              </button>
            </div>

            {unit === 'metric' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-300">Weight (kg)</span>
                    <span className="text-rose-400 font-mono">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-300">Height (cm)</span>
                    <span className="text-rose-400 font-mono">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Height (Feet)</label>
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Inches</label>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Summary</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-6xl font-black text-white font-mono">{bmi}</span>
                <span className="text-sm text-slate-400 font-semibold">BMI Index</span>
              </div>

              <div className={`inline-block px-4 py-2 rounded-xl text-xs font-extrabold uppercase border ${info.color}`}>
                Category: {info.category}
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 text-sm font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Suggested Tier: {info.plan}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  {info.regimen}
                </p>
              </div>
            </div>

            <a
              href="#plans"
              className="mt-6 w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm text-center shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Select Recommended Plan</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
