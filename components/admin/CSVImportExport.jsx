'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Download, Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const CSVImportExport = () => {
  const [csvInput, setCsvInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExportMembers = () => {
    window.open('/api/export/members', '_blank');
    toast.success('Downloading Members CSV Export...');
  };

  const handleExportAttendance = () => {
    window.open('/api/export/attendance', '_blank');
    toast.success('Downloading Attendance CSV Export...');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvInput(evt.target.result);
        toast.success(`File "${file.name}" loaded into CSV parser!`);
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvInput) return toast.error('Please select or paste CSV data first.');

    try {
      setIsImporting(true);
      const res = await fetch('/api/members/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvInput }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Bulk CSV import completed successfully!');
        setCsvInput('');
      } else {
        toast.error(data.message || 'Import failed.');
      }
    } catch (e) {
      toast.error('Import processing error.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Export Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-base uppercase">
          <Download className="w-5 h-5 text-rose-500" />
          <span>1-Click Data Export Hub (.CSV)</span>
        </div>
        <p className="text-xs text-slate-400">Download formatted member directories and historical attendance logs</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportMembers}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white group-hover:text-rose-400">Export Member Directory</span>
              <FileSpreadsheet className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-xs text-slate-400">Includes member phone, plan, status, PKR fee paid, and expiry date.</p>
          </button>

          <button
            onClick={handleExportAttendance}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white group-hover:text-rose-400">Export Attendance Logs</span>
              <FileSpreadsheet className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-xs text-slate-400">Includes member check-in dates, timestamps, and contact info.</p>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base uppercase">
          <Upload className="w-5 h-5 text-emerald-400" />
          <span>Bulk Member CSV Import Hub</span>
        </div>
        <p className="text-xs text-slate-400">Upload or paste a CSV file containing columns: `name, phone, email, feePaidPKR, paymentMethod`</p>

        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950 hover:bg-slate-900 hover:border-emerald-500/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-slate-300">Click to upload CSV File</p>
                <p className="text-[10px] text-slate-500">Supports standard .csv format</p>
              </div>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">CSV Raw Content Preview / Editor</label>
            <textarea
              rows="5"
              placeholder="name,phone,email,feePaidPKR,paymentMethod&#10;Muhammad Ali,0300-1234567,ali@example.com,9000,JazzCash"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isImporting}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {isImporting ? 'Processing CSV Import...' : 'Run Bulk Member CSV Import'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CSVImportExport;
