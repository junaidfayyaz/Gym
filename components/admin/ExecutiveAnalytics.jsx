'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserX, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ExecutiveAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const kpis = data?.kpis || {
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    todayFootfall: 0,
    monthlyRevenuePKR: 0,
    totalRevenuePKR: 0,
  };

  const chartData = data?.revenueChart || [
    { month: 'Apr', revenuePKR: 45000 },
    { month: 'May', revenuePKR: 62000 },
    { month: 'Jun', revenuePKR: 85000 },
    { month: 'Jul', revenuePKR: 98000 },
    { month: 'Aug', revenuePKR: 120000 },
    { month: 'Sep', revenuePKR: 145000 },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid in PKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Active Members</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{kpis.activeMembers}</h3>
              <p className="text-xs text-slate-400 mt-1">Total Enrolled: {kpis.totalMembers}</p>
            </div>
            <div className="p-3.5 rounded-xl border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expired Memberships</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{kpis.expiredMembers}</h3>
              <p className="text-xs text-slate-400 mt-1">Requires renewal outreach</p>
            </div>
            <div className="p-3.5 rounded-xl border bg-amber-500/10 text-amber-400 border-amber-500/20">
              <UserX className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">This Month's Revenue</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">Rs. {kpis.monthlyRevenuePKR.toLocaleString()}</h3>
              <p className="text-xs text-slate-400 mt-1">Lifetime Total: Rs. {kpis.totalRevenuePKR.toLocaleString()}</p>
            </div>
            <div className="p-3.5 rounded-xl border bg-rose-500/10 text-rose-500 border-rose-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Footfall</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{kpis.todayFootfall}</h3>
              <p className="text-xs text-slate-400 mt-1">Daily check-ins logged</p>
            </div>
            <div className="p-3.5 rounded-xl border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly PKR Revenue Growth Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <span>Monthly PKR Revenue Performance</span>
            </h3>
            <p className="text-xs text-slate-400">Past 6 months fee collection trends in Pakistani Rupee (PKR / Rs.)</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevPKR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `Rs. ${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                formatter={(val) => [`Rs. ${val.toLocaleString()}`, 'Revenue (PKR)']}
              />
              <Area
                type="monotone"
                dataKey="revenuePKR"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevPKR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
