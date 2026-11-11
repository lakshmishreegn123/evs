import React, { useState, useMemo } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Wrench, 
  Sparkles, 
  Download, 
  PlusCircle, 
  LayoutGrid, 
  ListFilter, 
  RotateCcw,
  Smartphone,
  Laptop,
  Zap,
  Headphones,
  Tv,
  Tablet,
  BatteryCharging,
  Layers,
  Info,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import { Device, DeviceLabel, DeviceType } from '../types/device';
import { DEVICE_METRIC_FACTORS, getDeviceLifecycleStats } from '../utils/eWasteLogic';
import { deleteDevice, updateDevice, resetToSampleDevices, clearAllDevices } from '../utils/storage';

interface DrawerSectionProps {
  devices: Device[];
  onNavigate: (tab: string) => void;
  onRefresh: () => void;
}

export const DrawerSection: React.FC<DrawerSectionProps> = ({
  devices,
  onNavigate,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDeviceForModal, setSelectedDeviceForModal] = useState<Device | null>(null);

  // Unique PIN codes for quick filter
  const uniquePins = useMemo(() => {
    const set = new Set<string>();
    devices.forEach((d) => {
      if (d.pin) set.add(d.pin);
    });
    return Array.from(set).sort();
  }, [devices]);

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.brand && d.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.pin.includes(searchQuery) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLabel = selectedLabel === 'all' || d.label === selectedLabel;
      const matchesType = selectedType === 'all' || d.type === selectedType;
      const matchesPin = selectedPin === 'all' || d.pin === selectedPin;

      return matchesSearch && matchesLabel && matchesType && matchesPin;
    });
  }, [devices, searchQuery, selectedLabel, selectedType, selectedPin]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your drawer?`)) {
      deleteDevice(id);
      onRefresh();
    }
  };

  const handleToggleRecycled = (device: Device) => {
    updateDevice(device.id, { recycled: !device.recycled });
    onRefresh();
  };

  const handleExportCSV = () => {
    if (devices.length === 0) return;
    const headers = ['ID', 'Name', 'Category', 'YearBought', 'Condition', 'PIN', 'Label', 'Recycled', 'Created'];
    const rows = devices.map((d) => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      d.type,
      d.yearBought,
      d.condition,
      d.pin,
      d.label,
      d.recycled ? 'Yes' : 'No',
      d.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `drawerzero_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (devices.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(devices, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `drawerzero_inventory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Device type icons
  const deviceTypeIcons: Record<DeviceType, React.ReactNode> = {
    smartphone: <Smartphone className="w-4 h-4" />,
    laptop: <Laptop className="w-4 h-4" />,
    charger: <Zap className="w-4 h-4" />,
    earphones: <Headphones className="w-4 h-4" />,
    tv: <Tv className="w-4 h-4" />,
    tablet: <Tablet className="w-4 h-4" />,
    battery: <BatteryCharging className="w-4 h-4" />,
    accessories: <Layers className="w-4 h-4" />,
  };

  return (
    <section id="drawer" className="space-y-6 animate-fadeIn">
      {/* Top Header & Bulk Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-bold mb-2">
            <FolderArchive className="w-4 h-4" />
            <span>Step 8: Saved Devices Inventory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Electronic Drawer ({devices.length})
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            All audited devices stored locally in <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">localStorage['dz_devices']</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('add')}
            className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Device</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Download CSV table"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Download JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset your drawer with realistic demonstration devices?')) {
                resetToSampleDevices();
                onRefresh();
              }
            }}
            className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Reset to sample dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Samples</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Row 1: Search and View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by device name, brand, PIN, or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#2e7d32] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#2e7d32] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Verdict:
          </span>
          {[
            { id: 'all', label: `All (${devices.length})` },
            { id: 'Keep / Reuse', label: `Keep / Reuse (${devices.filter(d => d.label === 'Keep / Reuse').length})`, color: 'text-emerald-700' },
            { id: 'Repair', label: `Repair (${devices.filter(d => d.label === 'Repair').length})`, color: 'text-amber-700' },
            { id: 'Recycle', label: `Recycle (${devices.filter(d => d.label === 'Recycle').length})`, color: 'text-blue-700' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLabel(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLabel === tab.id
                  ? 'bg-[#2e7d32] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {uniquePins.length > 1 && (
            <div className="ml-auto flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-bold">PIN:</span>
              <select
                value={selectedPin}
                onChange={(e) => setSelectedPin(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-700"
              >
                <option value="all">All PINs</option>
                {uniquePins.map((p) => (
                  <option key={p} value={p}>
                    {p} ({devices.filter(d => d.pin === p).length})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      {filteredDevices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#2e7d32] mx-auto">
            <FolderArchive className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No devices found in this filter</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedLabel !== 'all' || selectedPin !== 'all'
              ? 'Try resetting your search query or verdict filters.'
              : 'Your electronic drawer is empty. Audit your first device to start tracking e-waste.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLabel('all');
                setSelectedPin('all');
              }}
              className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('add')}
              className="text-xs font-bold text-white bg-[#2e7d32] px-4 py-2 rounded-xl hover:bg-[#1b5e20] cursor-pointer"
            >
              Add a Device
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDevices.map((device) => {
            const stats = getDeviceLifecycleStats({
              type: device.type,
              yearBought: device.yearBought,
            });
            const factor = DEVICE_METRIC_FACTORS[device.type] || DEVICE_METRIC_FACTORS.smartphone;

            const badgeStyles: Record<DeviceLabel, string> = {
              'Keep / Reuse': 'bg-emerald-100 text-emerald-800 border-emerald-300',
              Repair: 'bg-amber-100 text-amber-900 border-amber-300',
              Recycle: 'bg-blue-100 text-blue-900 border-blue-300',
            };

            return (
              <div
                key={device.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  device.recycled ? 'border-emerald-300 bg-emerald-50/20 opacity-80' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Bar: ID and Verdict Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{device.id}</span>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${badgeStyles[device.label]}`}>
                      {device.label}
                    </span>
                  </div>

                  {/* Device Title & Category */}
                  <div className="mt-3 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      {deviceTypeIcons[device.type]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {device.name}
                      </h4>
                      <p className="text-xs text-slate-500 capitalize">
                        {device.type} {device.brand ? `• ${device.brand}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Lifecycle Breakdown Box */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Age vs Lifespan:</span>
                      <span className="font-bold font-mono text-slate-800">
                        {stats.age} yrs / {stats.expectedLifespan} yrs
                      </span>
                    </div>

                    {/* Lifespan bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          stats.eolScore < 1 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, stats.percentUsed)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>EOL Score: <strong className="font-mono">{stats.eolScore}</strong></span>
                      <span className="capitalize font-medium">Condition: <strong className="text-slate-700">{device.condition}</strong></span>
                    </div>
                  </div>

                  {/* PIN & Notes */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      PIN {device.pin}
                    </span>
                    <span className="text-[11px]">
                      ~{factor.avgWeightKg} kg • Cu: {factor.copperG}g
                    </span>
                  </div>

                  {device.notes && (
                    <p className="mt-2 text-xs text-slate-600 bg-slate-50/70 p-2 rounded-lg italic">
                      "{device.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleRecycled(device)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      device.recycled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Mark if you have handed this over to a recycler"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{device.recycled ? 'Recycled ✓' : 'Mark Recycled'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedDeviceForModal(device)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Inspect detailed mineral & lifecycle breakdown"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(device.id, device.name)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Device Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">EOL Score</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">PIN</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDevices.map((device) => {
                  const stats = getDeviceLifecycleStats({
                    type: device.type,
                    yearBought: device.yearBought,
                  });
                  return (
                    <tr key={device.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 font-semibold">{device.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{device.name}</td>
                      <td className="py-3 px-4 capitalize text-slate-600">{device.type}</td>
                      <td className="py-3 px-4 font-mono">{device.yearBought}</td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          device.condition === 'working' ? 'bg-emerald-50 text-emerald-800' :
                          device.condition === 'repairable' ? 'bg-amber-50 text-amber-800' :
                          'bg-red-50 text-red-800'
                        }`}>
                          {device.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {stats.eolScore}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          device.label === 'Keep / Reuse' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          device.label === 'Repair' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {device.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{device.pin}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDeviceForModal(device)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            title="Details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(device.id, device.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedDeviceForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-slate-400">{selectedDeviceForModal.id}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedDeviceForModal.name}
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  {selectedDeviceForModal.type} • Bought {selectedDeviceForModal.yearBought} • PIN {selectedDeviceForModal.pin}
                </p>
              </div>
              <button
                onClick={() => setSelectedDeviceForModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Calculations Breakdown */}
            {(() => {
              const stats = getDeviceLifecycleStats({
                type: selectedDeviceForModal.type,
                yearBought: selectedDeviceForModal.yearBought,
              });
              const factor = DEVICE_METRIC_FACTORS[selectedDeviceForModal.type] || DEVICE_METRIC_FACTORS.smartphone;

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#e8f5e9]/50 border border-emerald-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b5e20]">
                      Algorithm Audit Math (Step 6)
                    </h4>
                    <div className="text-xs space-y-1 font-mono text-slate-700">
                      <p>Age = {stats.currentYear} - {selectedDeviceForModal.yearBought} = <strong>{stats.age} years</strong></p>
                      <p>Expected Lifespan = <strong>{stats.expectedLifespan} years</strong></p>
                      <p>Score = {stats.age} / {stats.expectedLifespan} = <strong>{stats.eolScore}</strong></p>
                      <p>Condition = <strong>{selectedDeviceForModal.condition}</strong></p>
                      <p className="pt-1 text-[#2e7d32] font-sans font-bold">
                        Calculated Label: {selectedDeviceForModal.label}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Estimated Material Recovery Potential
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                      <div>Weight: <strong>{factor.avgWeightKg} kg</strong></div>
                      <div>Copper: <strong>{factor.copperG} g</strong></div>
                      <div>Gold: <strong>{factor.goldMg} mg</strong></div>
                      <div>Silver: <strong>{factor.silverMg} mg</strong></div>
                      <div>Aluminium: <strong>{factor.aluminiumG} g</strong></div>
                      <div>CO₂ Saved: <strong>~{factor.co2SavedKg} kg</strong></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2">
              <button
                onClick={() => setSelectedDeviceForModal(null)}
                className="w-full py-2.5 bg-[#2e7d32] text-white text-xs font-bold rounded-xl hover:bg-[#1b5e20] transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
