import { create } from 'zustand';

interface AppState {
  dataService: any;
  setDataService: (service: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dataService: null,
  setDataService: (service) => set({ dataService: service }),
}));
