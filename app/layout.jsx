import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'TITANFIT | Gym & Fitness Management Pakistan',
  description: 'Premier Gym & Fitness Center in Pakistan. Features state-of-the-art machinery, certified master coaches, and transparent PKR membership tiers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white">
        <Toaster position="top-right" richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
