import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  HelpCircle,
  Smartphone,
  Laptop,
  Zap,
  Headphones,
  Tv,
  Tablet,
  BatteryCharging,
  Layers,
  Wrench,
  Trash2,
  Check
} from 'lucide-react';
import { Device, DeviceCondition, DeviceType } from '../types/device';
import { LIFESPAN_MATRIX, getDeviceLifecycleStats, getLabel } from '../utils/eWasteLogic';
import { saveDevice } from '../utils/storage';

interface AddDeviceSectionProps {
  onDeviceSaved: (newDevice: Device) => void;
  onNavigate: (tab: string) => void;
}

export const AddDeviceSection: React.FC<AddDeviceSectionProps> = ({
  onDeviceSaved,
  onNavigate,
}) => {
  const currentYear = new Date().getFullYear();

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('smartphone');
  const [yearBought, setYearBought] = useState<string>('2021');
  const [condition, setCondition] = useState<DeviceCondition>('broken');
  const [pin, setPin] = useState('560001');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

  // Errors & success state
  const [errors, setErrors] = useState<{
    name?: string;
    yearBought?: string;
    pin?: string;
  }>({});
  const [recentlySaved, setRecentlySaved] = useState<Device | null>(null);

  // Live EOL computation
  const liveStats = useMemo(() => {
    const yr = parseInt(yearBought, 10);
    const validYr = !isNaN(yr) && yr > 1990 && yr <= currentYear ? yr : currentYear;
    const computedLabel = getLabel({
      type,
      yearBought: validYr,
      condition,
    });
    const stats = getDeviceLifecycleStats({
      type,
      yearBought: validYr,
    });
    return {
      ...stats,
      label: computedLabel,
    };
  }, [type, yearBought, condition, currentYear]);

  // Validate form strictly matching Step 7 & 12
  const validateForm = () => {
    const newErrors: { name?: string; yearBought?: string; pin?: string } = {};

    // 1. Required device name
    if (!name.trim()) {
      newErrors.name = 'Device name or model is required (e.g. iPhone 11, Mi Fast Charger).';
    }

    // 2. Year validation (not in future, valid range)
    const yrNum = parseInt(yearBought, 10);
    if (!yearBought.trim() || isNaN(yrNum)) {
      newErrors.yearBought = 'Please enter a valid purchase year.';
    } else if (yrNum > currentYear) {
      newErrors.yearBought = `Year bought cannot be in the future (max: ${currentYear}).`;
    } else if (yrNum < 1980) {
      newErrors.yearBought = 'Year must be 1980 or later.';
    }

    // 3. PIN code validation (/^\d{6}$/)
    const pinPattern = /^\d{6}$/;
    if (!pin.trim()) {
      newErrors.pin = 'Postal PIN code is required for community drive clustering.';
    } else if (!pinPattern.test(pin.trim())) {
      newErrors.pin = 'PIN code must be exactly 6 digits (e.g., 560001, 110001).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const yrNum = parseInt(yearBought, 10);
    const newDev = saveDevice({
      name,
      type,
      yearBought: yrNum,
      condition,
      pin,
      brand,
      notes,
    });

    // Fire celebratory confetti for sustainable action
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2e7d32', '#4caf50', '#81c784', '#ffd54f'],
      });
    } catch {
      // Ignore if confetti unavailable
    }

    setRecentlySaved(newDev);
    onDeviceSaved(newDev);

    // Reset some fields for quick next entry
    setName('');
    setNotes('');
  };

  // Device type icons
  const deviceTypeIcons: Record<DeviceType, React.ReactNode> = {
    smartphone: <Smartphone className="w-5 h-5" />,
    laptop: <Laptop className="w-5 h-5" />,
    charger: <Zap className="w-5 h-5" />,
    earphones: <Headphones className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
    tablet: <Tablet className="w-5 h-5" />,
    battery: <BatteryCharging className="w-5 h-5" />,
    accessories: <Layers className="w-5 h-5" />,
  };

  return (
    <section id="add" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-bold mb-3">
            <PlusCircle className="w-4 h-4" />
            <span>Step 6 &amp; 7: Device Intake &amp; Classification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Log an Idle Electronics Item
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter the device details below. DrawerZero will run the milk-packet lifecycle algorithm, 
            determine its End-of-Life score, and assign the appropriate verdict.
          </p>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Decision Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          
          {recentlySaved && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Device Successfully Logged!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Saved as <strong className="font-mono">{recentlySaved.id}</strong> with verdict{' '}
                    <span className="font-bold underline">{recentlySaved.label}</span>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('drawer')}
                className="shrink-0 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Drawer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* 1. Device Name */}
            <div>
              <label htmlFor="dev-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Device Name or Model <span className="text-red-500">*</span>
              </label>
              <input
                id="dev-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. OnePlus 7 Pro, ThinkPad X1, Apple 20W USB-C Brick"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20' 
                    : 'border-slate-300 focus:border-[#2e7d32] focus:ring-emerald-100'
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* 2. Device Type (Select & Quick Pills) */}
            <div>
              <label htmlFor="dev-type" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Device Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {(Object.keys(LIFESPAN_MATRIX) as DeviceType[]).map((t) => {
                  const isSelected = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={isSelected ? 'text-white' : 'text-slate-500'}>
                        {deviceTypeIcons[t]}
                      </span>
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                Lifespan benchmark for {type}: <strong className="text-slate-800">{LIFESPAN_MATRIX[type]} years</strong>
              </p>
            </div>

            {/* 3. Year Bought & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dev-year" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Year Bought <span className="text-red-500">*</span>
                </label>
                <input
                  id="dev-year"
                  type="number"
                  min="1980"
                  max={currentYear}
                  value={yearBought}
                  onChange={(e) => {
                    setYearBought(e.target.value);
                    if (errors.yearBought) setErrors({ ...errors, yearBought: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 font-mono transition-all ${
                    errors.yearBought 
                      ? 'border-red-400 focus:ring-red-200 bg-red-50/20' 
                      : 'border-slate-300 focus:border-[#2e7d32] focus:ring-emerald-100'
                  }`}
                />
                {errors.yearBought ? (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.yearBought}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Device age: <strong className="text-slate-800 font-mono">{liveStats.age} years</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Condition <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'working', label: 'Working', icon: CheckCircle2, color: 'hover:border-emerald-500' },
                    { id: 'repairable', label: 'Repairable', icon: Wrench, color: 'hover:border-amber-500' },
                    { id: 'broken', label: 'Broken', icon: Trash2, color: 'hover:border-red-500' },
                  ].map((item) => {
                    const isSelected = condition === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCondition(item.id as DeviceCondition)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${item.color} ${
                          isSelected
                            ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mb-1" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. PIN Code (with validation strictly matching Step 7 & Step 12) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="dev-pin" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Postal PIN Code (6-Digits) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Used for Community Drive grouping</span>
              </div>
              <input
                id="dev-pin"
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errors.pin) setErrors({ ...errors, pin: undefined });
                }}
                placeholder="e.g. 560001, 560034, 110001"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 font-mono tracking-widest placeholder:tracking-normal focus:outline-none focus:ring-2 transition-all ${
                  errors.pin 
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20' 
                    : 'border-slate-300 focus:border-[#2e7d32] focus:ring-emerald-100'
                }`}
              />
              {errors.pin && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.pin}</span>
                </p>
              )}
            </div>

            {/* 5. Brand & Notes (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dev-brand" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Brand / Manufacturer <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="dev-brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Samsung, Lenovo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="dev-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Drawer Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="dev-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cracked camera, stuck in drawer since 2021"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-emerald-200" />
                <span>Save Device to Drawer</span>
              </button>
            </div>

          </form>
        </div>

        {/* Live Algorithm Decision Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-b from-[#e8f5e9] to-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-200/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2e7d32]" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Live Decision Preview
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Step 6 Algorithm
              </span>
            </div>

            {/* The Milk Packet Analogy Card */}
            <div className="mt-5 p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Milk Packet "Use By" Benchmark</span>
                <span className="font-bold text-slate-800">{type}</span>
              </div>

              {/* Progress bar of Lifespan */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600 font-semibold">{liveStats.age} yrs old</span>
                  <span className="text-slate-500 font-medium">{liveStats.expectedLifespan} yrs expected</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      liveStats.eolScore < 1 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, liveStats.percentUsed)}%` }}
                  />
                </div>
              </div>

              {/* Formula Step-by-Step Display */}
              <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span className="font-bold">{liveStats.currentYear} - {yearBought || '0'} = {liveStats.age} yrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Lifespan:</span>
                  <span className="font-bold">{liveStats.expectedLifespan} yrs</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-[#2e7d32]">
                  <span>EOL Score:</span>
                  <span className="font-bold">{liveStats.eolScore} ({liveStats.eolScore < 1 ? '< 1.0 Active' : '>= 1.0 Expired'})</span>
                </div>
              </div>
            </div>

            {/* Result Verdict Badge */}
            <div className="mt-5 text-center p-5 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Calculated Environmental Verdict
              </span>
              <div className="inline-block">
                <span
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-lg font-black shadow-sm ${
                    liveStats.label === 'Keep / Reuse'
                      ? 'bg-emerald-600 text-white'
                      : liveStats.label === 'Repair'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {liveStats.label === 'Keep / Reuse' && <CheckCircle2 className="w-5 h-5" />}
                  {liveStats.label === 'Repair' && <Wrench className="w-5 h-5" />}
                  {liveStats.label === 'Recycle' && <Trash2 className="w-5 h-5" />}
                  <span>{liveStats.label}</span>
                </span>
              </div>
              
              <p className="text-xs text-slate-600 max-w-xs mx-auto pt-1">
                {liveStats.label === 'Keep / Reuse' && (
                  <>Working device within healthy lifespan ({liveStats.eolScore} &lt; 1). Continue using or pass it to a student or family member.</>
                )}
                {liveStats.label === 'Repair' && (
                  <>Marked as repairable. Fix the component to extend functional life and prevent unnecessary electronic waste generation.</>
                )}
                {liveStats.label === 'Recycle' && (
                  <>Exceeded expected lifespan ({liveStats.eolScore} &ge; 1) or broken beyond economical repair. Safe e-waste recycling recovers minerals.</>
                )}
              </p>
            </div>

          </div>

          {/* Quick FAQ Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Validation Criteria (Step 7 &amp; 12)</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li><strong>Required Fields:</strong> Device Name, Category, Year Bought, and PIN code.</li>
              <li><strong>Future Year Check:</strong> Rejects years greater than {currentYear}.</li>
              <li><strong>PIN Code Regex:</strong> Validated strictly via <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/^\d&#123;6&#125;$/</code>.</li>
              <li><strong>Persistent Storage:</strong> Automatically committed to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">localStorage.getItem('dz_devices')</code>.</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
