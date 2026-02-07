import { create } from 'zustand';

type GlobalLoadingState = {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
  set: (value: boolean) => void;
};

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  show: () => set({ isLoading: true }),
  hide: () => set({ isLoading: false }),
  set: (value) => set({ isLoading: value }),
}));
