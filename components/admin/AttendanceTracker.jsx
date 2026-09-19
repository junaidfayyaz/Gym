'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QrCode, Search, Calendar, UserCheck, CheckCircle2, Globe, Home, UserX, BarChart2, Info } from 'lucide-react';
import MemberAttendanceModal from '@/components/admin/MemberAttendanceModal';

const getLocalDateString = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const AttendanceTracker = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberQuery, setMemberQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isToday, setIsToday] = useState(true);
  const [selectedMemberForStats, setSelectedMemberForStats] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const todayStr = getLocalDateString(new Date());
      const targetDate = selectedDate && selectedDate.trim() ? selectedDate.trim() : todayStr;
      const isSelectedToday = targetDate === todayStr;
      setIsToday(isSelectedToday);

      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const url = params.toString() ? `/api/attendance?${params.toString()}` : '/api/attendance';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        if (typeof data.isToday === 'boolean') {
          setIsToday(data.isToday);
        }
      }
    } catch (e) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, searchQuery, statusFilter]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!isToday) return toast.error('Check-ins can only be logged for today!');
    if (!memberQuery) return toast.error('Enter Member ID or Pakistani Phone Number');

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberQuery }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Attendance marked present!');
        setMemberQuery('');
        fetchLogs();
      } else {
        toast.error(data.message || 'Check-in failed');
      }
    } catch (e) {
      toast.error('Failed to record attendance');
    }
  };

  const handleUpdateType = async (logId, newType) => {
    if (!isToday) return toast.error('Historical attendance records are read-only');

    let newStatus = 'Verified Present';
    if (newType === 'Excused / Absent') {
      newStatus = 'Excused / Absent';
    }

    // Instant UI feedback
    setLogs((prev) =>
      prev.map((log) => (log._id === logId ? { ...log, type: newType, status: newStatus } : log))
    );

    try {
      const res = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: logId, type: newType, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Verification Type set to "${newType}"`);
      } else {
        toast.error(data.message || 'Failed to update attendance type');
        fetchLogs();
      }
    } catch (e) {
      toast.error('Network error updating attendance type');
      fetchLogs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Attendance Entry Bar (Only Active for Today) */}
      {isToday ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm uppercase">
            <QrCode className="w-5 h-5 text-rose-500" />
            <span>Quick Front-Desk Attendance Entry (Today's Active Sheet)</span>
          </div>

          <form onSubmit={handleMarkAttendance} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Member ID (e.g. WS-7001) or Pakistani Phone (e.g. 0300-1234567)..."
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
              className="flex-grow px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all shrink-0"
            >
              Mark Present
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-center space-x-3 text-amber-400 font-bold text-xs shadow-xl">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            Viewing Read-Only Historical Attendance Records for <strong className="font-mono text-white px-1.5 py-0.5 bg-slate-950 rounded-md border border-slate-800">{selectedDate || 'Past Date'}</strong>. Manual check-ins can only be logged for today's active date.
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Member ID (WS-7001), Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          {/* Verification Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="">All Verification Statuses</option>
            <option value="Verified Present">Verified Present</option>
            <option value="Not Checked In">Not Checked In (Unmarked)</option>
            <option value="Excused / Absent">Excused / Absent</option>
          </select>

          {/* Date Picker Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading attendance logs...</div>
      ) : logs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No check-in entries logged matching criteria.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3.5 px-4">Member Info</th>
                  <th className="py-3.5 px-4">Pakistani Phone</th>
                  <th className="py-3.5 px-4">Check-in Date & Time</th>
                  <th className="py-3.5 px-4">Verification Status</th>
                  <th className="py-3.5 px-4 text-center">Attendance Analytics</th>
                  <th className="py-3.5 px-4 text-right">Verification Attendance Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => {
                  const m = log.memberId;
                  const currentType = log.type || 'On-site / Physical';
                  const currentStatus = log.status || 'Verified Present';
                  const isCheckedIn = log.isLogged !== false && currentStatus !== 'Not Checked In';

                  return (
                    <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {m?.avatar ? (
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs shrink-0 uppercase">
                              {m?.name ? m.name.substring(0, 2) : 'WS'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2 mb-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px] font-extrabold">
                                {m?.memberId || 'N/A'}
                              </span>
                              <span className="font-bold text-white text-sm">{m?.name || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-rose-400 font-mono">{m?.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="text-slate-300 font-mono block">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                          <span className="font-mono font-bold text-white text-[11px]">{log.checkInTime}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            currentStatus === 'Verified Present'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : currentStatus === 'Not Checked In'
                              ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {/* Member Stats & Daily History Button */}
                        {m && (
                          <button
                            type="button"
                            onClick={() => setSelectedMemberForStats(m)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 font-bold text-[11px] inline-flex items-center space-x-1.5 transition-all"
                          >
                            <BarChart2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Stats & History</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isCheckedIn ? (
                          /* Dynamic Action Select/Toggle Button for checked-in member */
                          <div className="inline-flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
                            <button
                              type="button"
                              disabled={!isToday}
                              onClick={() => isToday && handleUpdateType(log._id, 'On-site / Physical')}
                              title="Mark On-site / Physical"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
                                currentType === 'On-site / Physical'
                                  ? 'bg-rose-600 text-white shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              } ${!isToday ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <Home className="w-3 h-3" />
                              <span>On-site</span>
                            </button>
                            <button
                              type="button"
                              disabled={!isToday}
                              onClick={() => isToday && handleUpdateType(log._id, 'Remote / Online')}
                              title="Mark Remote / Online"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
                                currentType === 'Remote / Online'
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              } ${!isToday ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <Globe className="w-3 h-3" />
                              <span>Remote</span>
                            </button>
                            <button
                              type="button"
                              disabled={!isToday}
                              onClick={() => isToday && handleUpdateType(log._id, 'Excused / Absent')}
                              title="Mark Excused / Absent"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
                                currentType === 'Excused / Absent'
                                  ? 'bg-amber-600 text-white shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              } ${!isToday ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <UserX className="w-3 h-3" />
                              <span>Excused</span>
                            </button>
                          </div>
                        ) : isToday ? (
                          /* Manual Check In Button for Unmarked Member (Today Only) */
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/attendance', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ memberQuery: m?.memberId || m?._id }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  toast.success(`Check-in recorded for ${m?.name}!`);
                                  fetchLogs();
                                } else {
                                  toast.error(data.message || 'Check-in failed');
                                }
                              } catch (e) {
                                toast.error('Network error during check-in');
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Check In</span>
                          </button>
                        ) : (
                          /* Historical Unmarked Badge for Past Dates */
                          <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-500 border border-slate-800 font-mono text-[10px] font-bold">
                            Historical Record
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Attendance Stats & History Modal */}
      {selectedMemberForStats && (
        <MemberAttendanceModal
          member={selectedMemberForStats}
          onClose={() => setSelectedMemberForStats(null)}
        />
      )}
    </div>
  );
};

export default AttendanceTracker;
