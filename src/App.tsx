/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AddDeviceSection } from './components/AddDeviceSection';
import { DrawerSection } from './components/DrawerSection';
import { ImpactSection } from './components/ImpactSection';
import { CommunityDriveSection } from './components/CommunityDriveSection';
import { MapSection } from './components/MapSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Device } from './types/device';
import { calculateImpact, getPinCodeClusters } from './utils/eWasteLogic';
import { getStoredDevices, resetToSampleDevices } from './utils/storage';

export default function App() {
  // Step 5: Page navigation with hash tracking
  const [activeTab, setActiveTab] = useState<string>('home');
  const [devices, setDevices] = useState<Device[]>([]);

  // Reload devices from LocalStorage
  const loadDevices = useCallback(() => {
    const list = getStoredDevices();
    setDevices(list);
  }, []);

  // Listen for hashchange (Step 5) and storage updates
  useEffect(() => {
    loadDevices();

    const handleHash = () => {
      const hash = window.location.hash.slice(1) || 'home';
      const validTabs = ['home', 'add', 'drawer', 'impact', 'community', 'map', 'about'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Initial hash sync
    handleHash();

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('dz_devices_updated', loadDevices);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('dz_devices_updated', loadDevices);
    };
  }, [loadDevices]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSample = () => {
    if (window.confirm('Reset drawer with demo electronics devices?')) {
      resetToSampleDevices();
      loadDevices();
    }
  };

  // Computations
  const impact = useMemo(() => calculateImpact(devices), [devices]);
  const pinClusters = useMemo(() => getPinCodeClusters(devices), [devices]);

  // Count PINs with >= 5 devices for community drive alert
  const communityDriveReadyCount = useMemo(() => {
    return Object.values(pinClusters).filter((items) => items.length >= 5).length;
  }, [pinClusters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        deviceCount={devices.length}
        communityDriveReadyCount={communityDriveReadyCount}
      />

      {/* Main Page Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Step 3 & 5: One <section> per page, each with an id */}
        {activeTab === 'home' && (
          <HomeSection
            devices={devices}
            impact={impact}
            pinClusters={pinClusters}
            onNavigate={handleNavigate}
            onResetSample={handleResetSample}
          />
        )}

        {activeTab === 'add' && (
          <AddDeviceSection
            onDeviceSaved={() => {
              loadDevices();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'drawer' && (
          <DrawerSection
            devices={devices}
            onNavigate={handleNavigate}
            onRefresh={loadDevices}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactSection
            devices={devices}
            impact={impact}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'community' && (
          <CommunityDriveSection
            devices={devices}
            pinClusters={pinClusters}
            onNavigate={handleNavigate}
            onRefresh={loadDevices}
          />
        )}

        {activeTab === 'map' && (
          <MapSection />
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
