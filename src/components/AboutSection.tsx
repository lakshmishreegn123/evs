import React from 'react';
import { 
  BookOpen, 
  Code, 
  Lightbulb, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Globe, 
  ExternalLink,
  GitBranch,
  Terminal
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#1b5e20] px-3 py-1 rounded-full">
              Course Code: BCS508 — Web Programming &amp; Mini-Project
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              DrawerZero: Project Documentation &amp; Technical Report
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Household E-Waste Lifecycle Audit, Material Recovery Estimator &amp; Community Aggregator
            </p>
          </div>
          <div className="shrink-0 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Submission Format</span>
            <span className="text-xs font-mono font-bold text-slate-700">BCS508 Evaluation Ready</span>
          </div>
        </div>

        {/* Executive Summary in 5 Sections matching Step 3 specs */}
        <div className="mt-8 space-y-10 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1: The Problem */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">1</span>
              <h2>The Problem Statement</h2>
            </div>
            <p>
              Electronic waste (e-waste) is currently the world’s fastest-growing domestic waste stream, generating over 
              <strong> 62 million metric tonnes</strong> annually according to the UN Global E-waste Monitor. 
              However, an estimated <strong>40% of small consumer electronics</strong> (smartphones, cables, chargers, 
              laptops, tablets) remain indefinitely stored in domestic household drawers—a phenomenon sociologists and 
              environmental scientists term <em>"the drawer hoard effect"</em>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-xs">
                <strong className="text-red-900 block font-bold mb-1">Environmental Hazards:</strong>
                Swollen lithium-ion batteries and decaying solder joints leak toxic lead (Pb), cadmium (Cd), and mercury (Hg), 
                imposing grave leachate risks if dumped with municipal mixed garbage.
              </div>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                <strong className="text-amber-900 block font-bold mb-1">Locked Critical Minerals:</strong>
                One tonne of discarded smartphones contains approximately 300g of gold and 100kg of copper—yielding 
                concentrations 10 to 50 times richer than naturally mined virgin ores.
              </div>
            </div>
          </div>

          {/* Section 2: The Solution & Processing Logic */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">2</span>
              <h2>The Solution: End-of-Life (EOL) Decision Engine</h2>
            </div>
            <p>
              DrawerZero solves user inertia by removing the cognitive burden of decision-making. 
              Just as a supermarket milk carton displays a clear <strong>"Use By" date</strong>, DrawerZero compares 
              each device’s chronological age against its scientific industry lifespan benchmark:
            </p>

            {/* Step 6 Processing Explanation */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-md">
              <div className="text-slate-400 mb-2">// Step 6: The Core Processing Algorithm</div>
              <pre className="text-emerald-400">
{`const lifespan = { smartphone: 4, laptop: 6, charger: 3, earphones: 2, tv: 10 };

function getLabel(device) {
  const age = new Date().getFullYear() - device.yearBought;
  const score = age / lifespan[device.type];      // End-of-Life score

  if (device.condition === 'working' && score < 1) return 'Keep / Reuse';
  if (device.condition === 'repairable')            return 'Repair';
  return 'Recycle';
}`}
              </pre>
            </div>

            <p className="text-xs text-slate-600">
              <strong>Processing Breakdown:</strong>
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>Score &lt; 1.0 &amp; Condition 'working':</strong> The device has not exhausted its useful lifespan. The recommendation is <em>Keep / Reuse</em> (e.g. donate to a school, use as secondary monitor/hotspot).</li>
              <li><strong>Condition 'repairable':</strong> Economic life extension. Repairing the battery or screen prevents new hardware production emissions. Recommendation: <em>Repair</em>.</li>
              <li><strong>Score &ge; 1.0 OR Condition 'broken':</strong> Obsolete, unrepairable, or beyond viable security support. Recommendation: <em>Recycle</em> at an authorized CPCB dismantler.</li>
            </ul>
          </div>

          {/* Section 3: Original Feature - PIN Clustering & Community Drives */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">3</span>
              <h2>Original Contribution: Community Drive Aggregation (Step 9)</h2>
            </div>
            <p>
              In conventional e-waste setups, citizens must travel alone to distant industrial disposal points. 
              The fuel emissions and courier expenses frequently exceed the environmental recovery benefit.
            </p>
            <p>
              DrawerZero introduces an <strong>automated spatial aggregation rule</strong>:
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-950">
              <p className="font-bold mb-1 font-sans text-sm text-[#1b5e20]">Spatial Clustering Logic:</p>
              <code>
                const byPin = {}; <br />
                list.forEach(d =&gt; byPin[d.pin] = (byPin[d.pin] || 0) + 1); <br />
                if (byPin[pin] &gt;= 5) unlockCommunityDrive(pin);
              </code>
            </div>

            <p className="text-xs text-slate-600">
              When 5 or more devices accumulate in the same postal code, an automated bulk collection drive is scheduled. 
              This reaches logistics breakeven, allowing authorized recyclers to dispatch dedicated transport vans to society clubhouses for free.
            </p>
          </div>

          {/* Section 4: Technology Stack & Architecture */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">4</span>
              <h2>Technology Stack &amp; Architecture</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Frontend Layer</strong>
                <p className="text-slate-600">HTML5, CSS3, Tailwind CSS with green-white palette (<code className="font-mono">:root --green:#2e7d32</code>), Flexbox &amp; CSS Grid.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">State &amp; Persistence</strong>
                <p className="text-slate-600">LocalStorage API (<code className="font-mono">dz_devices</code> key) with hash-based single-page routing (<code className="font-mono">#home</code>, <code className="font-mono">#add</code>, etc.).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Visualization</strong>
                <p className="text-slate-600">Chart.js dynamic Doughnut (Reuse/Repair/Recycle) &amp; Bar charts (Devices by category).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Geospatial Mapping</strong>
                <p className="text-slate-600">Leaflet.js interactive maps linked to verified CPCB/KSPCB recycling facilities.</p>
              </div>
            </div>
          </div>

          {/* Section 5: Statutory Sources & Regulatory Bodies */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">5</span>
              <h2>Statutory Sources &amp; Literature Cited</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
              <li>
                <strong>CPCB E-Waste (Management) Rules, 2022:</strong> Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India.
              </li>
              <li>
                <strong>Karnataka State Pollution Control Board (KSPCB):</strong> Waste Management Cell list of authorized dismantlers and recyclers under EPR framework.
              </li>
              <li>
                <strong>UN Global E-Waste Monitor (2024 Edition):</strong> International Telecommunication Union (ITU) &amp; UNITAR material composition data.
              </li>
              <li>
                <strong>IEEE Transactions on Sustainable Computing:</strong> Consumer electronics lifecycle and urban mining recovery yield calculations.
              </li>
            </ul>
          </div>

          {/* Section 6: Step 12 Test Verification Protocol */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[#1b5e20] font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1b5e20] flex items-center justify-center text-xs font-black">6</span>
              <h2>Testing &amp; Quality Assurance (Step 12 Checklist)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Empty Form Test:</strong> Submitting without inputs triggers explicit inline field errors.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Wrong PIN Regex Test:</strong> Non-6-digit PINs (e.g. "123", "abc") fail regex <code className="font-mono">/^\d&#123;6&#125;$/</code>.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Future Year Test:</strong> Purchase year &gt; 2026 is blocked with explicit notification.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Persistence Test:</strong> Reloading or closing browser preserves all drawer items via localStorage.
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Step 13 Deployment Instructions */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <GitBranch className="w-4 h-4 text-[#2e7d32]" />
              <span>Step 13: GitHub Pages Deployment Instructions</span>
            </div>
            <ol className="list-decimal pl-5 text-slate-600 space-y-1">
              <li>Initialize local git repository and commit all assets (<code className="font-mono">git init &amp;&amp; git add . &amp;&amp; git commit -m "Initial DrawerZero release"</code>).</li>
              <li>Create a new public repository named <code className="font-mono font-bold">drawerzero</code> on GitHub.</li>
              <li>Push to GitHub and enable <strong>Settings &rarr; Pages &rarr; Deploy from branch (main / gh-pages)</strong>.</li>
              <li>Live URL: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">https://yourusername.github.io/drawerzero/</code>.</li>
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
};
