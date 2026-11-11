import React, { useState } from 'react';
import { 
  Recycle, 
  PlusCircle, 
  FolderArchive, 
  PieChart, 
  Users, 
  MapPin, 
  BookOpen, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceCount: number;
  communityDriveReadyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  deviceCount,
  communityDriveReadyCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Recycle },
    { id: 'add', label: 'Add Device', icon: PlusCircle },
    { 
      id: 'drawer', 
      label: 'My Drawer', 
      icon: FolderArchive,
      badge: deviceCount > 0 ? deviceCount : undefined
    },
    { id: 'impact', label: 'Impact & Charts', icon: PieChart },
    { 
      id: 'community', 
      label: 'Community Drive', 
      icon: Users,
      highlight: communityDriveReadyCount > 0
    },
    { id: 'map', label: 'Collection Points', icon: MapPin },
    { id: 'about', label: 'BCS508 Write-Up', icon: BookOpen },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.location.hash = id;
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2e7d32] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <a 
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white hover:opacity-95 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Recycle className="w-6 h-6 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl leading-none font-extrabold tracking-tight">
                Drawer<span className="text-emerald-300">Zero</span>
              </span>
              <span className="text-[10px] text-emerald-100 font-medium tracking-wide">
                E-Waste Audit &amp; Recovery
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white text-[#1b5e20] shadow-sm font-semibold' 
                      : 'text-emerald-50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2e7d32]' : 'text-emerald-200'}`} />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#2e7d32] text-white' : 'bg-white/20 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && (
                    <span className="flex h-2 w-2 relative ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Quick CTA on Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('add')}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow hover:shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Device</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1b5e20] border-t border-emerald-800 px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? 'bg-white text-[#1b5e20] font-bold' 
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2e7d32]' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="bg-amber-400 text-amber-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                    Drive Ready
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
