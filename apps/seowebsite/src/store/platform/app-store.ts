import { create } from 'zustand';

interface AppState {
  dataService: any;
  setDataService: (service: any) => void;
  initDataService?: () => void;
  dataSource?: any;
}

export const useAppStore = create<AppState>((set) => ({
  dataService: null,
  setDataService: (service) => set({ dataService: service }),
  initDataService: () => {
    // Stub implementation
    console.warn("initDataService called (stub)");
  },
  dataSource: null,
}));
