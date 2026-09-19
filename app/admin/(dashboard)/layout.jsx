import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAdminFromCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminDashboardLayout({ children }) {
  const admin = getAdminFromCookie();

  // If unauthenticated, redirect to /admin/login
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
