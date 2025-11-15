import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IDataService, getDataService } from '@/services/data-service';

interface AppState {
  dataService: IDataService | null;
  dataSource: 'supabase';
  initDataService: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      dataService: null,
      dataSource: 'supabase',
      initDataService: async () => {
        if (get().dataService) return;

        const service = await getDataService();
        const source = 'supabase' as const;
        
        set({ dataService: service, dataSource: source });
      },
    }),
    { name: 'AppStore' }
  )
);
