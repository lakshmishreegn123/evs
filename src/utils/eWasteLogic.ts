import { Device, DeviceCondition, DeviceLabel, DeviceType, MetalImpact } from '../types/device';

export const LIFESPAN_MATRIX: Record<DeviceType, number> = {
  smartphone: 4,
  laptop: 6,
  charger: 3,
  earphones: 2,
  tv: 10,
  tablet: 4,
  battery: 2,
  accessories: 2,
};

export const DEVICE_METRIC_FACTORS: Record<
  DeviceType,
  {
    avgWeightKg: number;
    copperG: number;
    goldMg: number;
    silverMg: number;
    aluminiumG: number;
    co2SavedKg: number;
    plasticsG: number;
  }
> = {
  smartphone: {
    avgWeightKg: 0.18,
    copperG: 16,
    goldMg: 34,
    silverMg: 280,
    aluminiumG: 24,
    co2SavedKg: 4.8,
    plasticsG: 65,
  },
  laptop: {
    avgWeightKg: 2.2,
    copperG: 380,
    goldMg: 125,
    silverMg: 920,
    aluminiumG: 450,
    co2SavedKg: 35.0,
    plasticsG: 820,
  },
  charger: {
    avgWeightKg: 0.09,
    copperG: 32,
    goldMg: 0.8,
    silverMg: 6,
    aluminiumG: 4,
    co2SavedKg: 1.4,
    plasticsG: 42,
  },
  earphones: {
    avgWeightKg: 0.04,
    copperG: 12,
    goldMg: 0.3,
    silverMg: 3,
    aluminiumG: 3,
    co2SavedKg: 0.7,
    plasticsG: 22,
  },
  tv: {
    avgWeightKg: 11.5,
    copperG: 1100,
    goldMg: 55,
    silverMg: 340,
    aluminiumG: 1650,
    co2SavedKg: 64.0,
    plasticsG: 4100,
  },
  tablet: {
    avgWeightKg: 0.48,
    copperG: 42,
    goldMg: 48,
    silverMg: 310,
    aluminiumG: 95,
    co2SavedKg: 9.2,
    plasticsG: 140,
  },
  battery: {
    avgWeightKg: 0.08,
    copperG: 6,
    goldMg: 0.1,
    silverMg: 1,
    aluminiumG: 14,
    co2SavedKg: 1.6,
    plasticsG: 15,
  },
  accessories: {
    avgWeightKg: 0.14,
    copperG: 24,
    goldMg: 1.2,
    silverMg: 12,
    aluminiumG: 18,
    co2SavedKg: 2.1,
    plasticsG: 60,
  },
};

/**
 * Core project logic:
 * Milk packet 'use by' date analogy.
 * Checks age against standard lifespan and condition.
 */
export function getLabel(device: {
  type: DeviceType;
  yearBought: number;
  condition: DeviceCondition;
}): DeviceLabel {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - device.yearBought);
  const lifespan = LIFESPAN_MATRIX[device.type] || 3;
  const score = age / lifespan; // End-of-Life score

  if (device.condition === 'working' && score < 1) {
    return 'Keep / Reuse';
  }
  if (device.condition === 'repairable') {
    return 'Repair';
  }
  return 'Recycle';
}

/**
 * Calculates End-of-Life (EOL) ratio score and device age
 */
export function getDeviceLifecycleStats(device: {
  type: DeviceType;
  yearBought: number;
}) {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - device.yearBought);
  const expectedLifespan = LIFESPAN_MATRIX[device.type] || 3;
  const eolScore = Number((age / expectedLifespan).toFixed(2));
  const percentUsed = Math.min(200, Math.round((age / expectedLifespan) * 100));

  return {
    currentYear,
    age,
    expectedLifespan,
    eolScore,
    percentUsed,
    isOverdue: eolScore >= 1,
  };
}

/**
 * Computes metal and ecological impact totals across saved devices
 */
export function calculateImpact(devices: Device[]): MetalImpact {
  return devices.reduce(
    (acc, device) => {
      const factor = DEVICE_METRIC_FACTORS[device.type] || DEVICE_METRIC_FACTORS.smartphone;
      return {
        totalWeightKg: Number((acc.totalWeightKg + factor.avgWeightKg).toFixed(2)),
        copperG: Number((acc.copperG + factor.copperG).toFixed(1)),
        goldMg: Number((acc.goldMg + factor.goldMg).toFixed(1)),
        silverMg: Number((acc.silverMg + factor.silverMg).toFixed(1)),
        aluminiumG: Number((acc.aluminiumG + factor.aluminiumG).toFixed(1)),
        co2SavedKg: Number((acc.co2SavedKg + factor.co2SavedKg).toFixed(1)),
        plasticsPreventedKg: Number(
          (acc.plasticsPreventedKg + factor.plasticsG / 1000).toFixed(2)
        ),
      };
    },
    {
      totalWeightKg: 0,
      copperG: 0,
      goldMg: 0,
      silverMg: 0,
      aluminiumG: 0,
      co2SavedKg: 0,
      plasticsPreventedKg: 0,
    }
  );
}

/**
 * Step 9: Group saved devices by PIN code
 * If a PIN has 5 or more devices, trigger community drive banner
 */
export function getPinCodeClusters(devices: Device[]): Record<string, Device[]> {
  const byPin: Record<string, Device[]> = {};
  devices.forEach((d) => {
    const pin = d.pin?.trim();
    if (pin) {
      if (!byPin[pin]) byPin[pin] = [];
      byPin[pin].push(d);
    }
  });
  return byPin;
}

/**
 * Sample devices pre-populated for testing and evaluation
 */
export const SAMPLE_DEVICES: Device[] = [
  {
    id: 'DZ-171500101',
    name: 'Redmi Note 7 Pro',
    type: 'smartphone',
    yearBought: 2019,
    condition: 'broken',
    pin: '560001',
    brand: 'Xiaomi',
    notes: 'Cracked screen, swollen battery sitting in drawer since 2022',
    label: 'Recycle',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'DZ-171500102',
    name: 'Dell Inspiron 15 3000',
    type: 'laptop',
    yearBought: 2023,
    condition: 'working',
    pin: '560001',
    brand: 'Dell',
    notes: 'Good working condition, spare laptop for study',
    label: 'Keep / Reuse',
    createdAt: '2026-02-01T11:20:00Z',
  },
  {
    id: 'DZ-171500103',
    name: 'Fast Wall Charger 30W',
    type: 'charger',
    yearBought: 2020,
    condition: 'broken',
    pin: '560001',
    brand: 'OnePlus',
    notes: 'Frayed cable joint, doesn’t charge reliably',
    label: 'Recycle',
    createdAt: '2026-02-14T09:15:00Z',
  },
  {
    id: 'DZ-171500104',
    name: 'Boat Rockerz 255',
    type: 'earphones',
    yearBought: 2024,
    condition: 'repairable',
    pin: '560001',
    brand: 'boAt',
    notes: 'Left earpiece wire loose, right side working fine',
    label: 'Repair',
    createdAt: '2026-02-28T14:40:00Z',
  },
  {
    id: 'DZ-171500105',
    name: 'Samsung Galaxy J7',
    type: 'smartphone',
    yearBought: 2017,
    condition: 'broken',
    pin: '560001',
    brand: 'Samsung',
    notes: 'Old micro-USB phone, dead motherboard',
    label: 'Recycle',
    createdAt: '2026-03-05T16:10:00Z',
  },
  {
    id: 'DZ-171500106',
    name: 'Sony Bravia 32-inch LCD',
    type: 'tv',
    yearBought: 2012,
    condition: 'broken',
    pin: '560034',
    brand: 'Sony',
    notes: 'HDMI port stopped working, replaced with smart TV',
    label: 'Recycle',
    createdAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'DZ-171500107',
    name: 'Apple iPad Air 2',
    type: 'tablet',
    yearBought: 2016,
    condition: 'repairable',
    pin: '560034',
    brand: 'Apple',
    notes: 'Battery drains in 15 mins, screen is perfect',
    label: 'Repair',
    createdAt: '2026-03-12T18:30:00Z',
  },
];
