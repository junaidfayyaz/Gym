'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  QrCode,
  FileSpreadsheet,
  Mail,
  DollarSign,
  LogOut,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { href: '/admin', label: 'Executive Analytics', icon: BarChart3 },
  { href: '/admin/members', label: 'Member Directory', icon: Users },
  { href: '/admin/attendance', label: 'Attendance Tracker', icon: QrCode },
  { href: '/admin/inquiries', label: 'Leads Inbox', icon: Mail },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Admin logged out.');
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-screen p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center space-x-3 px-2">
          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-md">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white font-mono uppercase">
              TITAN<span className="text-rose-500">FIT</span>
            </span>
            <span className="block text-[10px] text-rose-400 font-bold uppercase tracking-widest -mt-1">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
