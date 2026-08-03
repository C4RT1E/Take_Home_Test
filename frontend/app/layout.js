import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata = {
  title: 'Todo Tracker — Modern Task Manager',
  description: 'Full-stack todo tracking web application built with Next.js App Router, Express, Sequelize, and SQLite.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
