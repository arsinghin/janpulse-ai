'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Layers,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Citizen Signal', icon: MapPin },
    { href: '/dashboard', label: 'Intelligence Dashboard', icon: Layers },
    { href: '/methodology', label: 'Methodology & AI Architecture', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">JanPulse AI</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  Track 1 DPI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Citizen Voice to Government Action
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Demo Trigger & Prototype Mode */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Flash 3.8</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-400">Prototype Mode</span>
            </div>

            <Link
              href="/#report-section"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
