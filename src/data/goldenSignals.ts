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
      value: '15,847 events/day',
      sparkline: [12400, 13100, 13800, 14200, 14900, 15300, 15847],
      trend: { direction: 'up', value: '+6% WoW', positive: true },
      badge: { text: 'eCMS + HCSS + P6', color: 'green' },
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
  oakwood: {
    throughput: {
      name: 'Throughput',
      value: '4,820 tasks/day',
      sparkline: [4100, 4250, 4400, 4520, 4620, 4740, 4820],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.04%',
      sparkline: [0.09, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04],
      trend: { direction: 'down', value: '-20% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.1s · p95: 3.2s',
      sparkline: [1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.1],
      trend: { direction: 'down', value: '-8% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '71% fleet capacity',
      sparkline: [64, 66, 67, 68, 69, 70, 71],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 71,
    },
  },
  pinnacle: {
    throughput: {
      name: 'Throughput',
      value: '3,240 tasks/day',
      sparkline: [2700, 2850, 2960, 3050, 3120, 3180, 3240],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.05%',
      sparkline: [0.11, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05],
      trend: { direction: 'down', value: '-17% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.3s · p95: 3.7s',
      sparkline: [1.9, 1.7, 1.6, 1.5, 1.4, 1.3, 1.3],
      trend: { direction: 'down', value: '-7% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '76% fleet capacity',
      sparkline: [68, 70, 72, 73, 74, 75, 76],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 76,
    },
  },
  atlas: {
    throughput: {
      name: 'Throughput',
      value: '8,420 tasks/day',
      sparkline: [7100, 7400, 7700, 7900, 8100, 8280, 8420],
      trend: { direction: 'up', value: '+6% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.03%',
      sparkline: [0.07, 0.06, 0.05, 0.04, 0.03, 0.03, 0.03],
      trend: { direction: 'down', value: '-25% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 0.9s · p95: 2.6s',
      sparkline: [1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.9],
      trend: { direction: 'down', value: '-10% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '69% fleet capacity',
      sparkline: [62, 64, 65, 66, 67, 68, 69],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 69,
    },
  },
  northbridge: {
    throughput: {
      name: 'Throughput',
      value: '32,400 tasks/day',
      sparkline: [27000, 28500, 29800, 30600, 31400, 31900, 32400],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.04%',
      sparkline: [0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04],
      trend: { direction: 'down', value: '-20% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.0s · p95: 3.0s',
      sparkline: [1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 1.0],
      trend: { direction: 'down', value: '-9% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '74% fleet capacity',
      sparkline: [67, 69, 70, 71, 72, 73, 74],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 74,
    },
  },
  'nb-aerospace': {
    throughput: {
      name: 'Throughput',
      value: '9,840 tasks/day',
      sparkline: [8200, 8600, 8900, 9200, 9450, 9650, 9840],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
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
      value: 'p50: 0.8s · p95: 2.2s',
      sparkline: [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8],
      trend: { direction: 'down', value: '-11% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '66% fleet capacity',
      sparkline: [58, 60, 62, 63, 64, 65, 66],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 66,
    },
  },
  'nb-energy': {
    throughput: {
      name: 'Throughput',
      value: '12,600 tasks/day',
      sparkline: [10500, 11000, 11400, 11800, 12100, 12400, 12600],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.03%',
      sparkline: [0.07, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03],
      trend: { direction: 'down', value: '-25% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.0s · p95: 2.8s',
      sparkline: [1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 1.0],
      trend: { direction: 'down', value: '-9% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '78% fleet capacity',
      sparkline: [70, 72, 74, 75, 76, 77, 78],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 78,
    },
  },
  'nb-financial': {
    throughput: {
      name: 'Throughput',
      value: '18,200 tasks/day',
      sparkline: [15200, 15900, 16500, 17100, 17500, 17900, 18200],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
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
      value: 'p50: 0.7s · p95: 2.1s',
      sparkline: [1.1, 1.0, 0.9, 0.8, 0.8, 0.7, 0.7],
      trend: { direction: 'down', value: '-12% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '72% fleet capacity',
      sparkline: [64, 66, 68, 69, 70, 71, 72],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 72,
    },
  },
  'nb-health': {
    throughput: {
      name: 'Throughput',
      value: '7,640 tasks/day',
      sparkline: [6400, 6700, 6900, 7100, 7300, 7480, 7640],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.05%',
      sparkline: [0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05],
      trend: { direction: 'down', value: '-17% WoW', positive: true },
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
      value: '75% fleet capacity',
      sparkline: [67, 69, 71, 72, 73, 74, 75],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 75,
    },
  },
  estonia: {
    throughput: {
      name: 'Throughput',
      value: '24,800 tasks/day',
      sparkline: [20800, 21700, 22500, 23200, 23800, 24300, 24800],
      trend: { direction: 'up', value: '+5% WoW', positive: true },
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
      value: 'p50: 0.9s · p95: 2.5s',
      sparkline: [1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.9],
      trend: { direction: 'down', value: '-10% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '70% fleet capacity',
      sparkline: [63, 65, 66, 67, 68, 69, 70],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 70,
    },
  },
  'ee-finance': {
    throughput: {
      name: 'Throughput',
      value: '6,420 tasks/day',
      sparkline: [5400, 5600, 5800, 6000, 6150, 6300, 6420],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.03%',
      sparkline: [0.07, 0.06, 0.05, 0.04, 0.03, 0.03, 0.03],
      trend: { direction: 'down', value: '-25% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 0.8s · p95: 2.3s',
      sparkline: [1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.8],
      trend: { direction: 'down', value: '-11% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '64% fleet capacity',
      sparkline: [56, 58, 60, 61, 62, 63, 64],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 64,
    },
  },
  'ee-social': {
    throughput: {
      name: 'Throughput',
      value: '5,280 tasks/day',
      sparkline: [4400, 4600, 4780, 4940, 5060, 5170, 5280],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.05%',
      sparkline: [0.11, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05],
      trend: { direction: 'down', value: '-17% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.4s · p95: 3.9s',
      sparkline: [2.1, 1.9, 1.8, 1.6, 1.5, 1.4, 1.4],
      trend: { direction: 'down', value: '-7% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '68% fleet capacity',
      sparkline: [60, 62, 64, 65, 66, 67, 68],
      trend: { direction: 'up', value: '+1% WoW', positive: true },
      gauge: 68,
    },
  },
  'ee-economic': {
    throughput: {
      name: 'Throughput',
      value: '3,840 tasks/day',
      sparkline: [3200, 3350, 3480, 3580, 3680, 3760, 3840],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
    },
    errorRate: {
      name: 'Error Rate',
      value: '0.04%',
      sparkline: [0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04],
      trend: { direction: 'down', value: '-20% WoW', positive: true },
      badge: { text: '< 0.1% target', color: 'green' },
    },
    latency: {
      name: 'Latency',
      value: 'p50: 1.1s · p95: 3.1s',
      sparkline: [1.7, 1.5, 1.4, 1.3, 1.2, 1.1, 1.1],
      trend: { direction: 'down', value: '-8% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '59% fleet capacity',
      sparkline: [51, 53, 55, 56, 57, 58, 59],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 59,
    },
  },
  'ee-ria': {
    throughput: {
      name: 'Throughput',
      value: '8,940 tasks/day',
      sparkline: [7500, 7800, 8100, 8350, 8550, 8750, 8940],
      trend: { direction: 'up', value: '+4% WoW', positive: true },
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
      value: 'p50: 0.6s · p95: 1.8s',
      sparkline: [1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6],
      trend: { direction: 'down', value: '-14% WoW', positive: true },
    },
    saturation: {
      name: 'Saturation',
      value: '61% fleet capacity',
      sparkline: [53, 55, 57, 58, 59, 60, 61],
      trend: { direction: 'up', value: '+2% WoW', positive: true },
      gauge: 61,
    },
  },
};

export function getGoldenSignals(companyId: string): GoldenSignalsData {
  return goldenSignalsByDivision[companyId] ?? goldenSignalsByDivision.meridian;
}
