'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Clock, Tag } from 'lucide-react';

const InquiriesInbox = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial cached inquiries from localStorage for instant 0ms rendering
  useEffect(() => {
    try {
      const cached = localStorage.getItem('gym_cached_inquiries');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInquiries(parsed);
          setLoading(false);
        }
      }
    } catch (e) {}
  }, []);

  const fetchInquiries = async () => {
    try {
      if (inquiries.length === 0) {
        setLoading(true);
      }
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
        try {
          localStorage.setItem('gym_cached_inquiries', JSON.stringify(data.inquiries));
        } catch (e) {}
      }
    } catch (e) {
      toast.error('Failed to load lead inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Status updated');
        fetchInquiries();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (e) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Public Website Leads & Contact Inbox</h3>
        <p className="text-xs text-slate-400">View and update statuses ('new', 'contacted', 'resolved') for website lead submissions</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading lead inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No public lead inquiries received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      inq.status === 'new'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : inq.status === 'contacted'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    Status: {inq.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{inq.name}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-rose-400" />
                      <span>{inq.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{inq.email}</span>
                    </div>
                  </div>
                </div>

                {inq.selectedPlan && (
                  <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Inquired Tier: {inq.selectedPlan}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  "{inq.message}"
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">Update Lead Status:</span>
                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="new">Mark as New</option>
                  <option value="contacted">Mark as Contacted</option>
                  <option value="resolved">Mark as Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesInbox;
