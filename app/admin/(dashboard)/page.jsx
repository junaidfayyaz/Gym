import ExecutiveAnalytics from '@/components/admin/ExecutiveAnalytics';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Executive Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Operations & Analytics Dashboard</h2>
        </div>
      </div>

      <ExecutiveAnalytics />
    </div>
  );
}
