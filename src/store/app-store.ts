import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IDataService, getDataService } from '@/services/data-service';

interface AppState {
  dataService: IDataService | null;
  dataSource: 'mock' | 'firebase';
  initDataService: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      dataService: null,
      dataSource: 'mock',
      initDataService: async () => {
        if (get().dataService) return;

        const service = await getDataService();
        const source = (await import('@/services/data-service')).USE_MOCK_DATA ? 'mock' : 'firebase';
        
        set({ dataService: service, dataSource: source });
      },
    }),
    { name: 'AppStore' }
  )
);
