'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Search, UserPlus, Download, Upload, Edit2, Trash2, Printer, ShieldAlert, FileSpreadsheet, BarChart2 } from 'lucide-react';
import MemberAttendanceModal from '@/components/admin/MemberAttendanceModal';

// Auto-compress large images (e.g. 24MB down to ~20KB) using client-side HTML5 Canvas
const compressImage = (file, maxWidth = 250, maxHeight = 250, quality = 0.75) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve('');
    };
    reader.onerror = () => resolve('');
  });
};

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  // Modals
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [selectedMemberForStats, setSelectedMemberForStats] = useState(null);

  // Form State
  const [form, setForm] = useState({
    avatar: '',
    name: '',
    phone: '',
    email: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    feePaidPKR: 3500,
    paymentMethod: 'JazzCash',
  });

  // CSV Import State
  const [csvContent, setCsvContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Load initial cached data from localStorage for instant 0ms rendering
  useEffect(() => {
    try {
      const cached = localStorage.getItem('gym_cached_members');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
          setLoading(false);
        }
      }
    } catch (e) {}
  }, []);

  const fetchMembers = async () => {
    try {
      // Only set loading spinner if no members exist in state yet
      if (members.length === 0) {
        setLoading(true);
      }
      let url = '/api/members';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (planFilter) params.append('planId', planFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
        try {
          localStorage.setItem('gym_cached_members', JSON.stringify(data.members));
        } catch (e) {}
      }
    } catch (e) {
      toast.error('Failed to load member directory');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans);
        if (data.plans.length > 0) {
          setForm((f) => ({ ...f, planId: data.plans[0]._id, feePaidPKR: data.plans[0].pricePKR }));
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, planFilter]);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingMember ? 'PUT' : 'POST';
      const url = editingMember ? `/api/members/${editingMember._id}` : '/api/members';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Member saved successfully!');
        setIsEnrollOpen(false);
        setEditingMember(null);
        fetchMembers();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (e) {
      toast.error('Failed to save member.');
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    try {
      const res = await fetch(`/api/members/${deletingMember._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Member archived/deleted successfully.');
        setDeletingMember(null);
        fetchMembers();
      } else {
        toast.error(data.message || 'Delete failed.');
      }
    } catch (e) {
      toast.error('Delete operation failed.');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/export/members', '_blank');
    toast.success('Downloading Members CSV Export...');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvContent(evt.target.result);
        toast.success(`File "${file.name}" loaded for import!`);
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvContent) return toast.error('Please select or paste CSV data first.');

    try {
      setIsImporting(true);
      const res = await fetch('/api/members/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Bulk CSV import completed!');
        setCsvContent('');
        setIsImportOpen(false);
        fetchMembers();
      } else {
        toast.error(data.message || 'Import failed');
      }
    } catch (e) {
      toast.error('Import processing error');
    } finally {
      setIsImporting(false);
    }
  };

  const openEdit = (m) => {
    setEditingMember(m);
    setForm({
      avatar: m.avatar || '',
      name: m.name,
      phone: m.phone,
      email: m.email || '',
      planId: m.planId?._id || m.planId || '',
      startDate: new Date(m.startDate).toISOString().split('T')[0],
      endDate: m.endDate ? new Date(m.endDate).toISOString().split('T')[0] : '',
      status: m.status || 'active',
      feePaidPKR: m.feePaidPKR,
      paymentMethod: m.paymentMethod || 'JazzCash',
    });
    setIsEnrollOpen(true);
  };

  const printReceipt = (m) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TitanFit Receipt - ${m.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 600px; margin: auto; border: 2px solid #f43f5e; border-radius: 16px; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #f43f5e; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total { font-size: 18px; font-weight: bold; color: #f43f5e; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">TITANFIT GYM PAKISTAN</h1>
            <p class="subtitle">Official Membership Payment Receipt</p>
          </div>
          <div style="margin: 20px 0;">
            <div class="row"><span>Receipt Date:</span> <strong>${new Date().toLocaleDateString()}</strong></div>
            <div class="row"><span>Member Name:</span> <strong>${m.name}</strong></div>
            <div class="row"><span>Phone Number:</span> <strong>${m.phone}</strong></div>
            <div class="row"><span>Selected Plan:</span> <strong>${m.planId?.title || 'Membership'}</strong></div>
            <div class="row"><span>Payment Mode:</span> <strong>${m.paymentMethod}</strong></div>
            <div class="row"><span>Validity:</span> <strong>${new Date(m.startDate).toLocaleDateString()} to ${new Date(m.endDate).toLocaleDateString()}</strong></div>
          </div>
          <div class="total">Fee Paid: Rs. ${m.feePaidPKR.toLocaleString()} PKR</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-white">Member Directory</h3>
          <p className="text-xs text-slate-400">Manage enrollments, log PKR payments, export/import CSV records</p>
        </div>

        {/* Top Header Buttons: Import CSV, Export CSV, Enrollment */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsImportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingMember(null);
              setForm({
                avatar: '',
                name: '',
                phone: '',
                email: '',
                planId: plans[0]?._id || '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                feePaidPKR: plans[0]?.pricePKR || 3500,
                paymentMethod: 'JazzCash',
              });
              setIsEnrollOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manual Member Enrollment</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Member ID (e.g. MEM-0001), name, Pakistani phone (03XX), or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Members</option>
          <option value="expired">Expired Members</option>
          <option value="suspended">Suspended Accounts</option>
        </select>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
        >
          <option value="">All Plan Types</option>
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title} (Rs. {p.pricePKR.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading member records...</div>
      ) : members.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No members found matching specified filters.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3.5 px-4">Member Info</th>
                  <th className="py-3.5 px-4">Plan & Expiry</th>
                  <th className="py-3.5 px-4">Fee Paid (PKR)</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {members.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs shrink-0 uppercase">
                            {m.name ? m.name.substring(0, 2) : 'WS'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2 mb-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px] font-extrabold">
                              {m.memberId || 'N/A'}
                            </span>
                            <p className="font-bold text-white text-sm">{m.name}</p>
                          </div>
                          <p className="text-rose-400 font-mono text-[11px]">{m.phone}</p>
                          {m.email && <p className="text-[10px] text-slate-400">{m.email}</p>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white">{m.planId?.title || 'Membership'}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          Exp: {new Date(m.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      Rs. {m.feePaidPKR?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] uppercase border border-slate-700">
                        {m.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          m.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : m.status === 'suspended'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedMemberForStats(m)}
                          title="Attendance Stats & History"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => printReceipt(m)}
                          title="Print Receipt"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Printer className="w-4 h-4 text-rose-400" />
                        </button>
                        <button
                          onClick={() => openEdit(m)}
                          title="Edit Member"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4 text-indigo-400" />
                        </button>
                        <button
                          onClick={() => setDeletingMember(m)}
                          title="Delete Member"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Modal: Enroll / Edit Member */}
      {isEnrollOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h4 className="text-lg font-bold text-white">
              {editingMember ? 'Edit Member Details' : 'Manual Member Enrollment'}
            </h4>
            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="Avatar Preview"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                      Photo
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          toast.info('Compressing photo for fast loading...');
                          const compressed = await compressImage(file, 250, 250, 0.75);
                          setForm((f) => ({ ...f, avatar: compressed }));
                          toast.success('Photo compressed successfully (~20KB)!');
                        }
                      }}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                    />
                    {form.avatar && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, avatar: '' })}
                        className="text-[10px] text-rose-400 underline mt-1 block font-bold"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Pakistani Phone (03XX)</label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Membership Plan</label>
                  <select
                    value={form.planId}
                    onChange={(e) => {
                      const selected = plans.find((p) => p._id === e.target.value);
                      const start = form.startDate ? new Date(form.startDate) : new Date();
                      const end = new Date(start);
                      end.setMonth(start.getMonth() + (selected?.durationMonths || 1));
                      const endDateStr = end.toISOString().split('T')[0];
                      const now = new Date();
                      const status = form.status === 'suspended' ? 'suspended' : (end < now ? 'expired' : 'active');
                      setForm({
                        ...form,
                        planId: e.target.value,
                        feePaidPKR: selected ? selected.pricePKR : form.feePaidPKR,
                        endDate: endDateStr,
                        status,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {plans.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} — Rs. {p.pricePKR.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Fee Amount (PKR / Rs.)</label>
                  <input
                    type="number"
                    required
                    value={form.feePaidPKR}
                    onChange={(e) => setForm({ ...form, feePaidPKR: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">End Date / Expiry Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      const now = new Date();
                      let newStatus = form.status;
                      if (newEndDate && form.status !== 'suspended') {
                        newStatus = new Date(newEndDate) < now ? 'expired' : 'active';
                      }
                      setForm({ ...form, endDate: newEndDate, status: newStatus });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Account Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold uppercase shadow-lg shadow-rose-600/30"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CSV Bulk Import */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h4 className="text-lg font-bold text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>Bulk CSV Member Import</span>
            </h4>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950 hover:bg-slate-900 hover:border-emerald-500/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                    <p className="font-bold text-slate-300">Click to upload CSV File</p>
                  </div>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">CSV Text Content / Preview</label>
                <textarea
                  rows="4"
                  placeholder="name,phone,email,feePaidPKR,paymentMethod&#10;Muhammad Ali,0300-1234567,ali@example.com,9000,JazzCash"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold uppercase shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isImporting ? 'Importing...' : 'Run CSV Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-base font-bold text-white">Archive / Delete Member?</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <span className="font-bold text-white">{deletingMember.name}</span>?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setDeletingMember(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;
