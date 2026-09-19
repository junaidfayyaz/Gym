'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, UserCheck, UserX, Activity, CheckCircle2, Clock, Globe, Home, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

const MemberAttendanceModal = ({ member, onClose }) => {
  const [range, setRange] = useState('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);

  const fetchStats = async () => {
    if (!member?._id) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('memberId', member._id);
      params.append('range', range);
      params.append('_t', Date.now().toString());
      if (range === 'custom') {
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }

      const res = await fetch(`/api/attendance/stats?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setStatsData(data);
      } else {
        toast.error(data.message || 'Failed to load member attendance analytics');
      }
    } catch (e) {
      toast.error('Network error loading member stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [member, range, startDate, endDate]);

  if (!member) return null;

  const stats = statsData?.stats || { totalDays: 0, totalPresent: 0, totalAbsent: 0, attendanceRate: 0 };
  const history = statsData?.history || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500/40 shrink-0 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 font-black text-sm shrink-0 uppercase">
                {member.name ? member.name.substring(0, 2) : 'WS'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px] font-extrabold">
                  {member.memberId || 'N/A'}
                </span>
                <h3 className="text-xl font-black text-white">{member.name}</h3>
              </div>
              <p className="text-xs text-slate-400">
                Member Attendance History & Performance Analytics ({member.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchStats}
              title="Refresh Stats"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-bold"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Date Range Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRange('this_month')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  range === 'this_month'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setRange('last_30_days')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  range === 'last_30_days'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setRange('custom')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  range === 'custom'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Range
              </button>
            </div>

            {range === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            )}
          </div>

          {/* Aggregated KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Days Present</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-1">{stats.totalPresent} Days</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Attended gym workouts</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Days Absent</p>
                <h4 className="text-2xl font-black text-rose-400 mt-1">{stats.totalAbsent} Days</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Missed gym sessions</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <UserX className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="w-full">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance Rate</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h4 className="text-2xl font-black text-indigo-400">{stats.attendanceRate}%</h4>
                  <span className="text-[10px] text-slate-400">({stats.totalPresent} / {stats.totalDays} Days)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, stats.attendanceRate))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily History Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Daily Attendance Log History</span>
            </h4>

            {loading ? (
              <div className="text-center py-8 text-slate-400 text-xs">Loading daily history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                No attendance logs recorded in this period.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-900/60 sticky top-0">
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Attendance Mode</th>
                        <th className="py-2.5 px-4 text-right">Check-in Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {history.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-white">{h.displayDate}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                h.isPresent
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {h.isPresent ? 'Verified Present' : 'Absent'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            {h.type === 'On-site / Physical' ? (
                              <span className="flex items-center space-x-1.5 text-rose-400">
                                <Home className="w-3 h-3" />
                                <span>On-site / Physical</span>
                              </span>
                            ) : h.type === 'Remote / Online' ? (
                              <span className="flex items-center space-x-1.5 text-indigo-400">
                                <Globe className="w-3 h-3" />
                                <span>Remote / Online</span>
                              </span>
                            ) : (
                              <span className="text-slate-500">N/A</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-300">
                            {h.checkInTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAttendanceModal;
