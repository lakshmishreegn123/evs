import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Navigation, 
  Layers, 
  Search,
  CheckCircle2,
  Building
} from 'lucide-react';
import { VERIFIED_COLLECTION_POINTS } from '../data/collectionPoints';
import { CollectionPoint } from '../types/device';

export const MapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [searchPin, setSearchPin] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);

  // Filter collection points by search
  const filteredPoints = VERIFIED_COLLECTION_POINTS.filter((point) => {
    return (
      point.name.toLowerCase().includes(searchPin.toLowerCase()) ||
      point.pin.includes(searchPin) ||
      point.address.toLowerCase().includes(searchPin.toLowerCase()) ||
      point.type.toLowerCase().includes(searchPin.toLowerCase())
    );
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center: Bengaluru central
    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 11,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Custom circular SVG icon generator
    const createCustomIcon = (type: string) => {
      const color = type.includes('Dismantler') ? '#2e7d32' : type.includes('Bin') ? '#2563eb' : '#059669';
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
          ">
            ♻
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });
    };

    // Add markers for all points
    VERIFIED_COLLECTION_POINTS.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(point.type),
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; max-width: 220px; font-size: 12px; line-height: 1.4;">
          <strong style="color: #1b5e20; font-size: 13px; display: block; margin-bottom: 4px;">${point.name}</strong>
          <span style="display: inline-block; background: #e8f5e9; color: #1b5e20; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-bottom: 6px;">
            ${point.type}
          </span>
          <p style="margin: 0 0 4px 0; color: #475569;">${point.address}, PIN: ${point.pin}</p>
          <p style="margin: 0 0 4px 0; color: #0284c7; font-weight: bold;">📞 ${point.phone}</p>
          <p style="margin: 0; font-family: monospace; font-size: 10px; color: #64748b;">Reg: ${point.registrationNo}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedPoint(point);
      });

      markersRef.current[point.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleFlyTo = (point: CollectionPoint) => {
    setSelectedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 14, {
        duration: 1.2,
      });
      const marker = markersRef.current[point.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <section id="map" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-bold mb-2">
            <MapPin className="w-4 h-4" />
            <span>Step 11: Authorised Collection Centres</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CPCB &amp; KSPCB Registered Recyclers
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Official e-waste dismantlers, drop-off bins, and authorized facilitation hubs across Karnataka.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchPin}
            onChange={(e) => setSearchPin(e.target.value)}
            placeholder="Search by PIN or area..."
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Map & Detail Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Interactive Leaflet Map (OpenStreetMap)</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{VERIFIED_COLLECTION_POINTS.length} Verified Centres</span>
          </div>

          <div className="mt-3 w-full h-[450px] rounded-2xl overflow-hidden relative border border-slate-200 shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          <div className="mt-3 px-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32] inline-block" /> Dismantler
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block" /> Recycler / Hub
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] inline-block" /> Drop-off Bin
              </span>
            </div>
            <span>Click any pin to inspect verified registration credentials</span>
          </div>
        </div>

        {/* Collection Points Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col max-h-[530px] overflow-y-auto pr-1">
          {filteredPoints.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
              No collection points match "{searchPin}". Try searching "560001", "560034", or "BTM".
            </div>
          ) : (
            filteredPoints.map((point) => {
              const isSelected = selectedPoint?.id === point.id;
              return (
                <div
                  key={point.id}
                  onClick={() => handleFlyTo(point)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-emerald-50/50 border-emerald-400 shadow-sm ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1b5e20] bg-emerald-100 px-2 py-0.5 rounded mb-1">
                        {point.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{point.name}</h4>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] shrink-0 font-semibold">
                      PIN {point.pin}
                    </span>
                  </div>

                  <p className="mt-1 text-slate-600 line-clamp-2">
                    {point.address}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-[#2e7d32]" />
                      {point.phone}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlyTo(point);
                      }}
                      className="text-[#2e7d32] font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-[11px]"
                    >
                      <span>Locate</span>
                      &rarr;
                    </button>
                  </div>

                  <div className="mt-1 font-mono text-[10px] text-slate-400">
                    Reg: {point.registrationNo}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Official Registry Sources & Regulatory Disclaimer (Step 11 requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#2e7d32]" />
          <h3 className="text-base font-bold text-slate-900">
            Source Verification &amp; Statutory Regulatory References
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In compliance with the E-Waste (Management) Rules, 2022 notified by the Ministry of Environment, Forest and Climate Change (MoEFCC), 
          all listed recycling centres are cross-referenced with official state pollution control board rosters:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-800">CPCB National Registry</strong>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">Central</span>
            </div>
            <p className="text-slate-600">
              Central Pollution Control Board List of Registered E-Waste Recyclers and Extended Producer Responsibility (EPR) Authorizations.
            </p>
            <div className="pt-1">
              <a
                href="https://cpcb.nic.in"
                target="_blank"
                rel="noreferrer"
                className="text-[#2e7d32] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>cpcb.nic.in / e-waste</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-800">KSPCB State Registry</strong>
              <span className="text-[10px] bg-emerald-100 text-[#1b5e20] px-1.5 py-0.5 rounded font-mono">Karnataka</span>
            </div>
            <p className="text-slate-600">
              Karnataka State Pollution Control Board Waste Management Cell (WMC) registered authorized dismantlers and collection centers.
            </p>
            <div className="pt-1">
              <a
                href="https://kspcb.karnataka.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[#2e7d32] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>kspcb.karnataka.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
