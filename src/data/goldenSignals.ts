// Golden Signals data — Datadog-style platform health metrics
// Per-division data that updates when company is switched

export interface GoldenSignal {
  name: string;
  value: string;
  sparkline: number[];
  trend: { direction: 'up' | 'down' | 'flat'; value: string; positive: boolean };
  badge?: { text: string; color: 'green' | 'amber' | 'red' };
  /** For saturation: percentage 0-100 */
  gauge?: number;
}

export interface GoldenSignalsData {
  throughput: GoldenSignal;
  errorRate: GoldenSignal;
  latency: GoldenSignal;
  saturation: GoldenSignal;
}

const goldenSignalsByDivision: Record<string, GoldenSignalsData> = {
  meridian: {
    throughput: {
      name: 'Throughput',
      value: '15,847 tasks/day',
      sparkline: [12400, 13100, 13800, 14200, 14900, 15300, 15847],
      trend: { direction: 'up', value: '+6% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.03%',
      sparkline: [0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03],
      trend: { direction: 'down', value: '-25% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.2s · p95: 3.4s',
      sparkline: [1.8, 1.6, 1.5, 1.4, 1.3, 1.2, 1.2],
      trend: { direction: 'down', value: '-8% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '73% fleet capacity',
      sparkline: [65, 68, 70, 71, 72, 73, 73],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 73,
    },
  },
  hcc: {
    throughput: {
      name: 'Throughput',
      value: '6,214 tasks/day',
      sparkline: [5200, 5500, 5700, 5900, 6000, 6100, 6214],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.02%',
      sparkline: [0.06, 0.05, 0.04, 0.03, 0.03, 0.02, 0.02],
      trend: { direction: 'down', value: '-33% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.1s · p95: 2.9s',
      sparkline: [1.5, 1.4, 1.3, 1.2, 1.2, 1.1, 1.1],
      trend: { direction: 'down', value: '-9% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '68% fleet capacity',
      sparkline: [60, 62, 64, 65, 66, 67, 68],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 68,
    },
  },
  hrsi: {
    throughput: {
      name: 'Throughput',
      value: '2,847 tasks/day',
      sparkline: [2400, 2500, 2600, 2700, 2750, 2800, 2847],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.05%',
      sparkline: [0.09, 0.08, 0.07, 0.06, 0.06, 0.05, 0.05],
      trend: { direction: 'down', value: '-17% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.4s · p95: 3.8s',
      sparkline: [2.0, 1.8, 1.7, 1.6, 1.5, 1.4, 1.4],
      trend: { direction: 'down', value: '-7% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '71% fleet capacity',
      sparkline: [63, 65, 67, 68, 69, 70, 71],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 71,
    },
  },
  hsi: {
    throughput: {
      name: 'Throughput',
      value: '1,842 tasks/day',
      sparkline: [1500, 1580, 1640, 1700, 1760, 1800, 1842],
      trend: { direction: 'up', value: '+7% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.01%',
      sparkline: [0.04, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01],
      trend: { direction: 'down', value: '-50% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 0.9s · p95: 2.4s',
      sparkline: [1.3, 1.2, 1.1, 1.0, 1.0, 0.9, 0.9],
      trend: { direction: 'down', value: '-10% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '62% fleet capacity',
      sparkline: [55, 57, 58, 59, 60, 61, 62],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 62,
    },
  },
  hti: {
    throughput: {
      name: 'Throughput',
      value: '2,310 tasks/day',
      sparkline: [1900, 2000, 2080, 2150, 2210, 2260, 2310],
      trend: { direction: 'up', value: '+8% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.04%',
      sparkline: [0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.04],
      trend: { direction: 'down', value: '-20% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.3s · p95: 3.6s',
      sparkline: [1.9, 1.7, 1.6, 1.5, 1.4, 1.3, 1.3],
      trend: { direction: 'down', value: '-7% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '82% fleet capacity',
      sparkline: [74, 76, 78, 79, 80, 81, 82],
      trend: { direction: 'up', value: '+3% WoW', positive: false },
      gauge: 82,
      badge: { text: '> 80% threshold', color: 'amber' },
    },
  },
  htsi: {
    throughput: {
      name: 'Throughput',
      value: '3,980 tasks/day',
      sparkline: [3300, 3450, 3600, 3700, 3800, 3900, 3980],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.04%',
      sparkline: [0.07, 0.06, 0.05, 0.05, 0.04, 0.04, 0.04],
      trend: { direction: 'down', value: '-14% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.0s · p95: 3.1s',
      sparkline: [1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 1.0],
      trend: { direction: 'down', value: '-10% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '77% fleet capacity',
      sparkline: [70, 72, 73, 74, 75, 76, 77],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 77,
    },
  },
  he: {
    throughput: {
      name: 'Throughput',
      value: '624 tasks/day',
      sparkline: [500, 530, 550, 570, 590, 610, 624],
      trend: { direction: 'up', value: '+6% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.02%',
      sparkline: [0.05, 0.04, 0.03, 0.03, 0.02, 0.02, 0.02],
      trend: { direction: 'down', value: '-33% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 0.8s · p95: 2.1s',
      sparkline: [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8],
      trend: { direction: 'down', value: '-11% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '58% fleet capacity',
      sparkline: [50, 52, 54, 55, 56, 57, 58],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 58,
    },
  },
  gg: {
    throughput: {
      name: 'Throughput',
      value: '412 tasks/day',
      sparkline: [340, 355, 370, 380, 390, 400, 412],
      trend: { direction: 'up', value: '+7% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.01%',
      sparkline: [0.04, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01],
      trend: { direction: 'down', value: '-50% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 0.7s · p95: 1.9s',
      sparkline: [1.1, 1.0, 0.9, 0.8, 0.8, 0.7, 0.7],
      trend: { direction: 'down', value: '-12% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '51% fleet capacity',
      sparkline: [44, 46, 47, 48, 49, 50, 51],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 51,
    },
  },
};

export function getGoldenSignals(companyId: string): GoldenSignalsData {
  return goldenSignalsByDivision[companyId] ?? goldenSignalsByDivision.meridian;
}
