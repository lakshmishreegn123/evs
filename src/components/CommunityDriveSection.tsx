import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Share2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Download
} from 'lucide-react';
import { Device } from '../types/device';
import { saveDevice } from '../utils/storage';

interface CommunityDriveSectionProps {
  devices: Device[];
  pinClusters: Record<string, Device[]>;
  onNavigate: (tab: string) => void;
  onRefresh: () => void;
}

export const CommunityDriveSection: React.FC<CommunityDriveSectionProps> = ({
  devices,
  pinClusters,
  onNavigate,
  onRefresh,
}) => {
  const [scheduledDriveSuccess, setScheduledDriveSuccess] = useState<string | null>(null);
  const [selectedPinForDrive, setSelectedPinForDrive] = useState<string>('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [meetingHub, setMeetingHub] = useState('');

  // Step 9 logic: Group by PIN code
  // const byPin = {}; list.forEach(d => byPin[d.pin] = (byPin[d.pin] || 0) + 1);
  const clusters = Object.entries(pinClusters).map(([pin, list]) => ({
    pin,
    count: list.length,
    devices: list,
    isReady: list.length >= 5,
    needed: Math.max(0, 5 - list.length),
  }));

  // Qualifying PINs (>= 5 devices)
  const readyClusters = clusters.filter((c) => c.isReady);

  const handleSimulateAddDeviceToPin = (targetPin: string) => {
    saveDevice({
      name: `Neighbour Device (${targetPin})`,
      type: 'smartphone',
      yearBought: 2018,
      condition: 'broken',
      pin: targetPin,
      brand: 'Community Member',
      notes: 'Added via neighbourhood collection drive pledge',
    });
    onRefresh();
  };

  const handleScheduleDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPinForDrive && readyClusters.length > 0) {
      setSelectedPinForDrive(readyClusters[0].pin);
    }
    const pinToUse = selectedPinForDrive || (readyClusters[0] ? readyClusters[0].pin : '560001');

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2e7d32', '#f59e0b', '#3b82f6', '#10b981'],
      });
    } catch {
      // Ignore if confetti unavailable
    }

    setScheduledDriveSuccess(pinToUse);
  };

  return (
    <section id="community" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Step 9: Original Innovation — Community Drive Threshold</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Neighbourhood E-Waste Collection Drives
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Individual courier drop-offs create vehicle emissions and logistics costs. 
            DrawerZero groups audited devices by 6-digit postal PIN code. When <strong>5 or more devices</strong> accumulate 
            in your sector, DrawerZero automatically unlocks an organized bulk community collection drive!
          </p>
        </div>
      </div>

      {/* Step 9 Banner if threshold reached */}
      {readyClusters.length > 0 && (
        <div className="bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-400/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Collection Drive Unlocked!</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Your area has enough devices for a collection drive.
              </h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                PIN Code <strong className="text-amber-300 font-mono text-base">{readyClusters.map(c => c.pin).join(', ')}</strong> has reached the critical mass of 5+ devices! 
                Logistics partners offer zero-cost van pickup and certified destruction manifests when 5 items are grouped together.
              </p>
            </div>

            <a
              href="#schedule-form"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('schedule-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shrink-0 bg-white hover:bg-emerald-50 text-[#1b5e20] text-sm font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Free Pickup</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* PIN Cluster Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Postal Sectors (PIN Codes)</h3>
            <p className="text-xs text-slate-500">Threshold: 5 devices per PIN to activate community van dispatch</p>
          </div>
          <button
            onClick={() => onNavigate('add')}
            className="text-xs font-bold text-[#2e7d32] hover:text-[#1b5e20] flex items-center gap-1 cursor-pointer"
          >
            <span>Log Device in New PIN</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {clusters.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No PIN codes logged yet.</p>
            <p className="text-xs text-slate-500 mt-1">Add devices with their 6-digit PIN to start clustering.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clusters.map((cluster) => {
              const progressPct = Math.min(100, Math.round((cluster.count / 5) * 100));

              return (
                <div
                  key={cluster.pin}
                  className={`bg-white rounded-3xl p-6 border transition-all shadow-sm ${
                    cluster.isReady
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${cluster.isReady ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">PIN Code</span>
                        <span className="text-lg font-mono font-black text-slate-900">{cluster.pin}</span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        cluster.isReady
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cluster.isReady ? 'Drive Ready! (5+)' : `${cluster.count} / 5 Logged`}
                    </span>
                  </div>

                  {/* Progress Bar towards 5 */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Threshold Progress</span>
                      <span className="font-mono text-slate-800">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cluster.isReady ? 'bg-[#2e7d32]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      {cluster.isReady
                        ? 'Eligible for certified bulk aggregator dispatch!'
                        : `${cluster.needed} more device${cluster.needed > 1 ? 's' : ''} needed to unlock drive.`}
                    </p>
                  </div>

                  {/* Device previews in this PIN */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <p className="font-bold text-slate-700 mb-1.5 text-[11px] uppercase tracking-wider">
                      Items in this PIN ({cluster.devices.length}):
                    </p>
                    <div className="space-y-1">
                      {cluster.devices.slice(0, 3).map((d) => (
                        <div key={d.id} className="flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[170px]">{d.name}</span>
                          <span className="text-slate-400 capitalize">{d.type}</span>
                        </div>
                      ))}
                      {cluster.devices.length > 3 && (
                        <p className="text-[10px] text-slate-400 italic">
                          +{cluster.devices.length - 3} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    {cluster.isReady ? (
                      <button
                        onClick={() => {
                          setSelectedPinForDrive(cluster.pin);
                          document.getElementById('schedule-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Organize Drive for {cluster.pin}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSimulateAddDeviceToPin(cluster.pin)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        title="Simulate a neighbour logging an item to reach 5"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Simulate Neighbour Pledge (+1)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Community Drive Scheduling & Registration Form */}
      <div id="schedule-form" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-[#2e7d32]" />
            <h3 className="text-xl font-bold text-slate-900">
              Schedule Authorized Bulk Pickup Drive
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Coordinates with registered recyclers (Saahas Zero Waste / Karo Sambhav / Hulladek) to deploy an e-waste collection van to your community clubhouse or society gate.
          </p>
        </div>

        {scheduledDriveSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-950">
                  Collection Drive Registered for PIN {scheduledDriveSuccess}!
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Confirmation token <strong>DZ-DRIVE-{Date.now().toString().slice(-6)}</strong> dispatched to local authorized recycler. 
                  A community collection bin and pickup manifest have been scheduled.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1 font-mono">
              <p>Sector PIN: <strong>{scheduledDriveSuccess}</strong></p>
              <p>Hub: <strong>{meetingHub || 'Main Society Clubhouse / RWA Desk'}</strong></p>
              <p>Coordinator: <strong>{coordinatorName || 'Community Volunteer'}</strong></p>
              <p>Pickup Window: <strong>{pickupDate || 'Upcoming Saturday, 10:00 AM - 4:00 PM'}</strong></p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setScheduledDriveSuccess(null)}
                className="px-4 py-2 bg-[#2e7d32] text-white text-xs font-bold rounded-xl hover:bg-[#1b5e20] cursor-pointer"
              >
                Schedule Another Drive
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-50 cursor-pointer"
              >
                View Participating Recyclers
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleScheduleDrive} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Sector PIN Code <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPinForDrive}
                  onChange={(e) => setSelectedPinForDrive(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                >
                  {readyClusters.length > 0 ? (
                    readyClusters.map((c) => (
                      <option key={c.pin} value={c.pin}>
                        {c.pin} ({c.count} items - Eligible)
                      </option>
                    ))
                  ) : (
                    <option value="560001">560001 (Simulated Sector)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Proposed Drive Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Meeting Point / Society Hub
                </label>
                <input
                  type="text"
                  value={meetingHub}
                  onChange={(e) => setMeetingHub(e.target.value)}
                  placeholder="e.g. Community Gate 1, RWA Office"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Lead Volunteer / Coordinator Name
                </label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar (Flat 402)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                <span>Confirm &amp; Dispatch Community Pickup</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Write-Up Callout */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Why this makes DrawerZero original (Step 9):</strong>
          <p className="mt-0.5">
            Most e-waste portals place the entire friction of transportation on the individual citizen. 
            By introducing an algorithmic cluster threshold (<code className="font-mono bg-white px-1 py-0.5 rounded text-slate-700">count &gt;= 5 per PIN</code>), 
            DrawerZero transforms fragmented individual drawer waste into an aggregated, economically viable logistics manifest.
          </p>
        </div>
      </div>
    </section>
  );
};
