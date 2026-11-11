import React from 'react';
import { Recycle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-[#1b5e20] text-emerald-100 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                <Recycle className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Drawer<span className="text-emerald-400">Zero</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              An intelligent household e-waste auditing platform built for the BCS508 course project. 
              Classifying end-of-life status, estimating precious metals, and activating neighbourhood community drives.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Complies with CPCB E-Waste Management Rules (2022)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Navigation
            </p>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home &amp; Problem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('add')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Add a Device Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('drawer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Saved Drawer Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('impact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Chart.js Impact Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Academic Project
            </p>
            <ul className="text-xs space-y-1.5 text-emerald-200/90">
              <li>Course: <strong>BCS508</strong></li>
              <li>Theme: <strong>Green &amp; White (:root --green:#2e7d32)</strong></li>
              <li>Storage: <strong>LocalStorage (dz_devices)</strong></li>
              <li>Original Feature: <strong>PIN Community Drives (&ge;5)</strong></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© {new Date().getFullYear()} DrawerZero Project. Built for sustainable electronic lifecycle management.</p>
          <p className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>for zero-landfill electronic futures</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
