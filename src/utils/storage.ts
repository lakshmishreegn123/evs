import { Device, DeviceCondition, DeviceType } from '../types/device';
import { getLabel, SAMPLE_DEVICES } from './eWasteLogic';

const STORAGE_KEY = 'dz_devices';

export function getStoredDevices(): Device[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First-time visit: populate sample devices for instant demonstration
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DEVICES));
      return SAMPLE_DEVICES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return SAMPLE_DEVICES;
  }
}

export interface SaveDeviceInput {
  name: string;
  type: DeviceType;
  yearBought: number;
  condition: DeviceCondition;
  pin: string;
  brand?: string;
  notes?: string;
}

export function saveDevice(input: SaveDeviceInput): Device {
  const currentList = getStoredDevices();
  const label = getLabel({
    type: input.type,
    yearBought: input.yearBought,
    condition: input.condition,
  });

  const newDevice: Device = {
    id: 'DZ-' + Date.now(),
    name: input.name.trim(),
    type: input.type,
    yearBought: input.yearBought,
    condition: input.condition,
    pin: input.pin.trim(),
    brand: input.brand?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    label,
    recycled: false,
    createdAt: new Date().toISOString(),
  };

  const updatedList = [newDevice, ...currentList];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  window.dispatchEvent(new Event('dz_devices_updated'));
  return newDevice;
}

export function deleteDevice(id: string): void {
  const currentList = getStoredDevices();
  const updatedList = currentList.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  window.dispatchEvent(new Event('dz_devices_updated'));
}

export function updateDevice(id: string, partial: Partial<Device>): void {
  const currentList = getStoredDevices();
  const updatedList = currentList.map((d) => {
    if (d.id === id) {
      const merged = { ...d, ...partial };
      merged.label = getLabel({
        type: merged.type,
        yearBought: merged.yearBought,
        condition: merged.condition,
      });
      return merged;
    }
    return d;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  window.dispatchEvent(new Event('dz_devices_updated'));
}

export function resetToSampleDevices(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DEVICES));
  window.dispatchEvent(new Event('dz_devices_updated'));
}

export function clearAllDevices(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('dz_devices_updated'));
}
