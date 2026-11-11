import React from 'react';
import { 
  PlusCircle, 
  Layers, 
  Weight, 
  Sparkles, 
  CheckCircle2, 
  Wrench, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Device, MetalImpact } from '../types/device';

interface HomeSectionProps {
  devices: Device[];
  impact: MetalImpact;
  pinClusters: Record<string, Device[]>;
  onNavigate: (tab: string) => void;
  onResetSample: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  devices,
  impact,
  pinClusters,
  onNavigate,
  onResetSample,
}) => {
  // Check if any PIN has 5 or more devices (Step 9 Community Drive Trigger)
  const qualifyingPins = Object.entries(pinClusters).filter(
    ([, items]) => items.length >= 5
  );

  // Group label counts
  const counts = {
    reuse: devices.filter((d) => d.label === 'Keep / Reuse').length,
    repair: devices.filter((d) => d.label === 'Repair').length,
    recycle: devices.filter((d) => d.label === 'Recycle').length,
  };

  return (
    <section id="home" className="space-y-8 animate-fadeIn">
      {/* Step 9 Community Drive Notification Banner (if any PIN has >= 5 devices) */}
      {qualifyingPins.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-5 shadow-lg border-2 border-emerald-400/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-400 text-amber-950 rounded-xl font-bold flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-amber-950 text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                    Threshold Reached
                  </span>
                  <span className="text-xs text-emerald-200 font-medium">Original Community Feature</span>
                </div>
                <h3 className="text-lg font-bold mt-1 text-white">
                  Your area has enough devices for a collection drive!
                </h3>
                <p className="text-emerald-100 text-sm mt-0.5 max-w-2xl">
                  PIN Code{' '}
                  <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
                    {qualifyingPins.map(([pin]) => pin).join(', ')}
                  </span>{' '}
                  has reached {qualifyingPins.reduce((sum, [, items]) => sum + items.length, 0)} devices. 
                  An authorized e-waste aggregator can be dispatched for free bulk pickup.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('community')}
              className="w-full sm:w-auto shrink-0 bg-white hover:bg-emerald-50 text-[#1b5e20] font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Organize Drive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero: The Problem in 2-3 lines + Big "Add a Device" button */}
      <div className="bg-gradient-to-br from-white to-[#e8f5e9] border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-[#1b5e20] text-xs font-semibold mb-4 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
            <span>BCS508 Sustainable Computing &amp; E-Waste Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Empty your drawers. <br className="hidden sm:inline" />
            <span className="text-[#2e7d32]">Revive rare minerals.</span>
          </h1>

          {/* The Problem statement in 2-3 lines (Step 3 specification) */}
          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Millions of unused electronics gather dust in our drawers, leaking toxins or locking away precious minerals. 
            DrawerZero checks each device’s lifecycle score against its expected lifespan to tell you whether to 
            <strong> Keep</strong>, <strong>Repair</strong>, or <strong>Recycle</strong> it safely.
          </p>

          {/* Big "Add a Device" Button */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('add')}
              className="inline-flex items-center justify-center gap-3 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-base sm:text-lg font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-6 h-6 text-emerald-200" />
              <span>Add a Device</span>
              <ArrowRight className="w-5 h-5 ml-1 opacity-80" />
            </button>

            <button
              onClick={() => onNavigate('drawer')}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <span>View Saved Drawer ({devices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 4: 3 Stat Cards styled with CSS Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
            Live Drawer Audit &amp; Impact
          </h2>
          <span className="text-xs text-slate-400">Updates instantly on save</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Devices Listed */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Devices Listed
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">
                    {devices.length}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    items logged
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {counts.reuse} Reuse
              </span>
              <span className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                {counts.repair} Repair
              </span>
              <span className="flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5 text-blue-600" />
                {counts.recycle} Recycle
              </span>
            </div>
          </div>

          {/* Card 2: Estimated kg */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estimated E-Waste Mass
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#2e7d32] font-mono">
                    {impact.totalWeightKg}
                  </span>
                  <span className="text-sm font-bold text-slate-600">kg</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white transition-colors">
                <Weight className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="text-slate-500">CO2 Emissions Averted</span>
              <span className="font-bold text-emerald-800 font-mono">
                ~{impact.co2SavedKg} kg CO₂e
              </span>
            </div>
          </div>

          {/* Card 3: Metals Recovered */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Metals Recoverable
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-amber-600 font-mono">
                    {impact.copperG}
                  </span>
                  <span className="text-sm font-bold text-slate-600">g Copper</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>Au: {impact.goldMg} mg</span>
              <span>Ag: {impact.silverMg} mg</span>
              <span>Al: {impact.aluminiumG} g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 6 Feature highlight: The "Milk Packet" Lifespan Model */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-100 text-[#1b5e20] px-2.5 py-0.5 rounded-full">
                Step 6: Core Logic Analogy
              </span>
              <span className="text-xs text-slate-500">End-of-Life (EOL) Scoring</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              The Milk Packet "Use By" Date for Electronics
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Just like a milk carton has a stamped expiration date, electronics have typical functional lifespans 
              (smartphones ~4 yrs, laptops ~6 yrs, chargers ~3 yrs, earphones ~2 yrs, TVs ~10 yrs). 
              Our algorithm computes <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">Score = Age ÷ Lifespan</code> to prescribe the optimal environmental action.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('about')}
              className="px-4 py-2 text-xs font-bold text-[#1b5e20] bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Read BCS508 Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetSample}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset dataset with realistic sample devices"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>

        {/* Lifespan benchmarks grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Smartphone</span>
            <span className="text-base font-bold text-slate-800 font-mono">4 Years</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">High mineral value</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Laptop</span>
            <span className="text-base font-bold text-slate-800 font-mono">6 Years</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">High repair potential</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Wall Charger</span>
            <span className="text-base font-bold text-slate-800 font-mono">3 Years</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Copper heavy</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Earphones</span>
            <span className="text-base font-bold text-slate-800 font-mono">2 Years</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cable wear point</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Television</span>
            <span className="text-base font-bold text-slate-800 font-mono">10 Years</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Large mass impact</span>
          </div>
        </div>
      </div>

      {/* Quick Recent Devices Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Current Drawer Inventory</h3>
            <p className="text-xs text-slate-500">Preview of your recently classified items</p>
          </div>
          <button
            onClick={() => onNavigate('drawer')}
            className="text-xs font-bold text-[#2e7d32] hover:text-[#1b5e20] flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Drawer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-8 bg-[#e8f5e9]/40 rounded-2xl border border-dashed border-emerald-200">
            <p className="text-sm font-semibold text-slate-700">Your drawer is currently empty!</p>
            <p className="text-xs text-slate-500 mt-1">Add your old phones, chargers, or laptops to see their lifecycle verdict.</p>
            <button
              onClick={() => onNavigate('add')}
              className="mt-4 px-4 py-2 bg-[#2e7d32] text-white text-xs font-bold rounded-xl hover:bg-[#1b5e20] transition-colors cursor-pointer"
            >
              Add Your First Device
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {devices.slice(0, 3).map((device) => {
              const labelColors = {
                'Keep / Reuse': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                Repair: 'bg-amber-50 text-amber-800 border-amber-200',
                Recycle: 'bg-blue-50 text-blue-800 border-blue-200',
              }[device.label];

              return (
                <div
                  key={device.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{device.id}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${labelColors}`}>
                        {device.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mt-1.5">{device.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">
                      {device.type} • Bought {device.yearBought} • PIN {device.pin}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="capitalize font-medium">Condition: {device.condition}</span>
                    <button
                      onClick={() => onNavigate('drawer')}
                      className="text-[#2e7d32] hover:underline font-semibold cursor-pointer"
                    >
                      Audit &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
