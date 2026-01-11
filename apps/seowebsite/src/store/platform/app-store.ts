
import { create } from 'zustand'
import fxService from '@/lib/platform/services/platform-service'

interface AppState {
  dataService: typeof fxService
  initDataService: () => void
}

export const useAppStore = create<AppState>((set) => ({
  dataService: fxService,
  initDataService: () => {},
}))
