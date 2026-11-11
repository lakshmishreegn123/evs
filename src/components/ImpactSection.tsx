import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  PieChart, 
  BarChart3, 
  Weight, 
  Sparkles, 
  Trees, 
  BatteryCharging, 
  ShieldCheck, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Device, MetalImpact } from '../types/device';
import { LIFESPAN_MATRIX } from '../utils/eWasteLogic';

interface ImpactSectionProps {
  devices: Device[];
  impact: MetalImpact;
  onNavigate: (tab: string) => void;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  devices,
  impact,
  onNavigate,
}) => {
  const doughnutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const doughnutChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  // Redraw charts whenever `devices` changes (Step 10 specification)
  useEffect(() => {
    // 1. Doughnut Chart: Reuse vs Repair vs Recycle
    if (doughnutCanvasRef.current) {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }

      const reuseCount = devices.filter((d) => d.label === 'Keep / Reuse').length;
      const repairCount = devices.filter((d) => d.label === 'Repair').length;
      const recycleCount = devices.filter((d) => d.label === 'Recycle').length;

      const hasData = devices.length > 0;
      const dataValues = hasData ? [reuseCount, repairCount, recycleCount] : [1, 1, 1];
      const backgroundColors = hasData
        ? ['#2e7d32', '#f59e0b', '#2563eb']
        : ['#cbd5e1', '#e2e8f0', '#f1f5f9'];

      doughnutChartInstance.current = new Chart(doughnutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Keep / Reuse', 'Repair', 'Recycle'],
          datasets: [
            {
              data: dataValues,
              backgroundColor: backgroundColors,
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                font: {
                  family: 'system-ui',
                  size: 12,
                  weight: 'bold',
                },
                padding: 16,
              },
            },
            tooltip: {
              enabled: hasData,
              callbacks: {
                label: (context) => {
                  const val = context.raw as number;
                  const total = devices.length;
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
                  return ` ${context.label}: ${val} items (${pct}%)`;
                },
              },
            },
          },
          cutout: '68%',
        },
      });
    }

    // 2. Bar Chart: Devices by Type
    if (barCanvasRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const typeKeys = Object.keys(LIFESPAN_MATRIX);
      const typeCounts = typeKeys.map(
        (type) => devices.filter((d) => d.type === type).length
      );

      barChartInstance.current = new Chart(barCanvasRef.current, {
        type: 'bar',
        data: {
          labels: typeKeys.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
          datasets: [
            {
              label: 'Devices in Drawer',
              data: typeCounts,
              backgroundColor: '#4caf50',
              borderColor: '#2e7d32',
              borderWidth: 1.5,
              borderRadius: 6,
              hoverBackgroundColor: '#1b5e20',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  family: 'system-ui',
                  size: 11,
                },
              },
              grid: {
                color: '#f1f5f9',
              },
            },
            x: {
              ticks: {
                font: {
                  family: 'system-ui',
                  size: 11,
                  weight: 'bold',
                },
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [devices]);

  // Derived equivalencies
  const treeEquiv = (impact.co2SavedKg / 21).toFixed(1); // 1 mature tree absorbs ~21kg CO2/yr
  const smartphoneEquiv = Math.round(impact.copperG / 16);

  return (
    <section id="impact" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-bold mb-2">
            <PieChart className="w-4 h-4" />
            <span>Step 10: Environmental &amp; Material Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ecological Impact &amp; Metal Recovery
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Real-time charts powered by Chart.js mapping lifecycle categories and recoverable elements.
          </p>
        </div>

        <button
          onClick={() => onNavigate('about')}
          className="text-xs font-bold text-[#1b5e20] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Source Citations</span>
        </button>
      </div>

      {/* Step 10: The Two Chart.js Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Doughnut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#2e7d32]" />
                <span>Reuse vs Repair vs Recycle</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Step 10 Doughnut</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Proportion of items routed to direct reuse, component repair, or certified materials extraction.
            </p>
          </div>

          <div className="h-64 my-4 relative">
            <canvas ref={doughnutCanvasRef} />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <span className="block font-bold text-[#2e7d32] text-sm">
                {devices.filter((d) => d.label === 'Keep / Reuse').length}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">Keep/Reuse</span>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl">
              <span className="block font-bold text-amber-700 text-sm">
                {devices.filter((d) => d.label === 'Repair').length}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">Repair</span>
            </div>
            <div className="p-2 bg-blue-50 rounded-xl">
              <span className="block font-bold text-blue-700 text-sm">
                {devices.filter((d) => d.label === 'Recycle').length}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">Recycle</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Bar Chart of Devices by Type (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2e7d32]" />
                <span>Devices by Category</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Step 10 Bar Chart</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Distribution of electronic categories audited across your household drawers.
            </p>
          </div>

          <div className="h-64 my-4 relative">
            <canvas ref={barCanvasRef} />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total logged: <strong className="text-slate-800">{devices.length} devices</strong></span>
            <span className="text-emerald-700 font-semibold">Redraws instantly upon device save</span>
          </div>
        </div>

      </div>

      {/* Recovered Resources Dashboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Theoretical Mineral Extraction Potential
            </h3>
            <p className="text-xs text-slate-500">
              Calculated using peer-reviewed e-waste material composition benchmarks (UN Global E-Waste Monitor)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Audit Mass: {impact.totalWeightKg} kg
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">Copper (Cu)</span>
            <span className="text-2xl font-black font-mono text-amber-900 mt-1 block">{impact.copperG}</span>
            <span className="text-[10px] text-amber-700">grams</span>
          </div>

          <div className="p-4 rounded-2xl bg-yellow-50/70 border border-yellow-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-800 block">Gold (Au)</span>
            <span className="text-2xl font-black font-mono text-yellow-900 mt-1 block">{impact.goldMg}</span>
            <span className="text-[10px] text-yellow-700">milligrams</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">Silver (Ag)</span>
            <span className="text-2xl font-black font-mono text-slate-800 mt-1 block">{impact.silverMg}</span>
            <span className="text-[10px] text-slate-500">milligrams</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 block">Aluminium (Al)</span>
            <span className="text-2xl font-black font-mono text-cyan-900 mt-1 block">{impact.aluminiumG}</span>
            <span className="text-[10px] text-cyan-700">grams</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b5e20] block">CO₂ Averted</span>
            <span className="text-2xl font-black font-mono text-[#2e7d32] mt-1 block">~{impact.co2SavedKg}</span>
            <span className="text-[10px] text-emerald-800">kg CO₂e</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">Plastics Saved</span>
            <span className="text-2xl font-black font-mono text-purple-900 mt-1 block">{impact.plasticsPreventedKg}</span>
            <span className="text-[10px] text-purple-700">kg from landfill</span>
          </div>
        </div>

        {/* Equivalency badges */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Carbon Offsetting Equivalent</p>
              <p className="text-sm font-bold text-slate-800">
                Equal to <span className="text-[#2e7d32]">{treeEquiv} tree seedlings</span> grown for 10 years
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Urban Mining Yield</p>
              <p className="text-sm font-bold text-slate-800">
                Recovered copper can manufacture <span className="text-blue-700">{smartphoneEquiv} new smartphones</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources and Citation Table (Step 8 & BCS508 requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#2e7d32]" />
          <span>Scientific Reference &amp; Conversion Factors</span>
        </h3>
        <p className="text-xs text-slate-600">
          The following standard material recovery indices are utilized for calculations, in accordance with CPCB (Central Pollution Control Board) E-Waste Management Rules and United Nations Institute for Training and Research (UNITAR) data:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Device Category</th>
                <th className="py-2.5 px-3">Lifespan Benchmark</th>
                <th className="py-2.5 px-3">Avg Mass</th>
                <th className="py-2.5 px-3">Copper</th>
                <th className="py-2.5 px-3">Gold</th>
                <th className="py-2.5 px-3">Silver</th>
                <th className="py-2.5 px-3">Primary Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-bold">Smartphone</td>
                <td className="py-2 px-3 font-mono">4 years</td>
                <td className="py-2 px-3">0.18 kg</td>
                <td className="py-2 px-3">16 g</td>
                <td className="py-2 px-3">34 mg</td>
                <td className="py-2 px-3">280 mg</td>
                <td className="py-2 px-3 text-slate-500">UN Global E-Waste Monitor (2024)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Laptop / Notebook</td>
                <td className="py-2 px-3 font-mono">6 years</td>
                <td className="py-2 px-3">2.2 kg</td>
                <td className="py-2 px-3">380 g</td>
                <td className="py-2 px-3">125 mg</td>
                <td className="py-2 px-3">920 mg</td>
                <td className="py-2 px-3 text-slate-500">CPCB Technical Guidelines / Dell LCA</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Wall Charger</td>
                <td className="py-2 px-3 font-mono">3 years</td>
                <td className="py-2 px-3">0.09 kg</td>
                <td className="py-2 px-3">32 g</td>
                <td className="py-2 px-3">0.8 mg</td>
                <td className="py-2 px-3">6 mg</td>
                <td className="py-2 px-3 text-slate-500">IEEE Consumer Electronics Studies</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Earphones / Audio</td>
                <td className="py-2 px-3 font-mono">2 years</td>
                <td className="py-2 px-3">0.04 kg</td>
                <td className="py-2 px-3">12 g</td>
                <td className="py-2 px-3">0.3 mg</td>
                <td className="py-2 px-3">3 mg</td>
                <td className="py-2 px-3 text-slate-500">KSPCB E-Waste Waste Stream Assessment</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Television / Display</td>
                <td className="py-2 px-3 font-mono">10 years</td>
                <td className="py-2 px-3">11.5 kg</td>
                <td className="py-2 px-3">1100 g</td>
                <td className="py-2 px-3">55 mg</td>
                <td className="py-2 px-3">340 mg</td>
                <td className="py-2 px-3 text-slate-500">CPCB E-Waste Rules 2022 Schedule I</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
