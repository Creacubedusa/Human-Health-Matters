import { create } from 'zustand';
import type { DonorDashboard, DonorLiveActivity } from '../types/donor.types';

const LIVE_ACTIVITY_TEMPLATES: Array<Pick<DonorLiveActivity, 'diagnosis' | 'patientType' | 'amount'>> = [
  { diagnosis: 'Blood Pressure Assessment', patientType: 'Underinsured · Emergency', amount: 100 },
  { diagnosis: 'Respiratory Health Review', patientType: 'Underinsured · Emergency', amount: 45 },
  { diagnosis: 'Blood Sugar Control Review', patientType: 'Uninsured · Urgent', amount: 55 },
  { diagnosis: 'Hypertension Review', patientType: 'Underinsured · Low', amount: 30 },
  { diagnosis: 'Diabetes Management', patientType: 'Uninsured · Moderate', amount: 40 },
];

function buildLiveActivityEntry(seed: number): DonorLiveActivity {
  const template = LIVE_ACTIVITY_TEMPLATES[seed % LIVE_ACTIVITY_TEMPLATES.length]!;
  return {
    id: `live-${Date.now()}-${seed}`,
    diagnosis: template.diagnosis,
    patientType: template.patientType,
    amount: template.amount,
    timeLabel: 'Just now',
  };
}

function relabelLiveActivity(items: DonorLiveActivity[]) {
  return items.map((item, index) => ({
    ...item,
    timeLabel:
      index === 0
        ? 'Just now'
        : index === 1
          ? '1 min ago'
          : `${Math.min(index, 9) * 2} min ago`,
  }));
}

function getPatientsHelpedIncrement(amount: number) {
  if (amount >= 500) return 5;
  if (amount >= 250) return 3;
  if (amount >= 100) return 2;
  if (amount >= 50) return 1;
  return 0;
}

interface DonorState {
  dashboard: DonorDashboard | null;
  setDashboard: (data: DonorDashboard) => void;
  simulateDashboardTick: () => void;
  applyDemoDonation: (amount: number) => void;
  clearDashboard: () => void;
}

export const useDonorStore = create<DonorState>((set) => ({
  dashboard: null,
  setDashboard: (data) => set({ dashboard: data }),
  simulateDashboardTick: () =>
    set((state) => {
      if (!state.dashboard) return state;

      const nextActivity = buildLiveActivityEntry(state.dashboard.liveActivity.length + 1);

      return {
        dashboard: {
          ...state.dashboard,
          liveActivity: relabelLiveActivity([nextActivity, ...state.dashboard.liveActivity]).slice(0, 5),
        },
      };
    }),
  applyDemoDonation: (amount) =>
    set((state) => {
      if (!state.dashboard) return state;

      const matchedAmount = Math.max(25, Math.min(amount, 150));
      const patientsHelpedIncrement = getPatientsHelpedIncrement(amount);
      const nextActivity: DonorLiveActivity = {
        id: `donation-${Date.now()}`,
        diagnosis: 'Donation matched to urgent care',
        patientType: 'Care pool · Real-time allocation',
        amount: matchedAmount,
        timeLabel: 'Just now',
      };

      return {
        dashboard: {
          ...state.dashboard,
          careFunding: state.dashboard.careFunding + amount,
          poolBalance: state.dashboard.poolBalance + amount,
          poolProgress: Math.min(state.dashboard.poolProgress + amount / 20000, 0.98),
          patientsHelped: state.dashboard.patientsHelped + patientsHelpedIncrement,
          liveActivity: relabelLiveActivity([nextActivity, ...state.dashboard.liveActivity]).slice(0, 5),
        },
      };
    }),
  clearDashboard: () => set({ dashboard: null }),
}));
