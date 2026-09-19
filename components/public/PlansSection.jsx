'use client';

import React, { useState, useEffect } from 'react';
import { Check, Flame, Sparkles } from 'lucide-react';

const PlansSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        if (data.success && data.plans.length > 0) {
          setPlans(data.plans);
        } else {
          setPlans([
            {
              _id: '1',
              title: 'Monthly Access Pass',
              pricePKR: 3500,
              durationMonths: 1,
              features: ['Full Gym Floor & Cardio Access', 'Standard Locker Access', 'General Trainer Guidance'],
            },
            {
              _id: '2',
              title: 'Executive Quarterly Split',
              pricePKR: 9000,
              durationMonths: 3,
              features: [
                'Unlimited Gym & Cardio Access',
                'Customized Diet & Workout Plan',
                'Group Fitness Masterclasses',
                'Sauna & Steam Bath (1x/week)',
              ],
              isPopular: true,
            },
            {
              _id: '3',
              title: 'VIP Annual Championship',
              pricePKR: 30000,
              durationMonths: 12,
              features: [
                'All Executive Benefits Included',
                '1-on-1 Master Personal Trainer',
                'Free Reserved Locker & Towels',
                'Monthly Guest Pass (2 Guests)',
              ],
            },
          ]);
        }
      } catch (e) {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div id="plans" className="py-20 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>PKR Currency Rates</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Transparent PKR Membership Tiers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Simple, upfront pricing strictly in Pakistani Rupee (PKR / Rs.). Cash, JazzCash, EasyPaisa & Bank Transfer accepted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isPopular = idx === 1 || plan.title.includes('Quarterly') || plan.isPopular;
            return (
              <div
                key={plan._id || idx}
                className={`relative bg-slate-900 border ${
                  isPopular
                    ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-2xl shadow-rose-600/20 scale-105 z-10'
                    : 'border-slate-800'
                } rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-slate-700`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Best Value Package</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        Rs. {plan.pricePKR.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {plan.durationMonths === 1 ? 'Month' : `${plan.durationMonths} Months`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Perks:</p>
                    <ul className="space-y-3">
                      {plan.features?.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-3 text-sm text-slate-300">
                          <div className="p-0.5 rounded-full bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#contact"
                  className={`mt-8 w-full py-4 rounded-2xl font-bold text-sm text-center shadow-lg transition-all ${
                    isPopular
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Join {plan.title}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlansSection;
