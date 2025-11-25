import { create } from 'zustand';
import { Vibe } from '@/types';

interface VibeStore {
  vibes: Vibe[];
  currentVibe: Vibe | null;
  isLoading: boolean;
  error: string | null;
  
  setVibes: (vibes: Vibe[]) => void;
  setCurrentVibe: (vibe: Vibe | null) => void;
  addVibe: (vibe: Vibe) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVibeStore = create<VibeStore>((set) => ({
  vibes: [],
  currentVibe: null,
  isLoading: false,
  error: null,

  setVibes: (vibes) => set({ vibes }),
  
  setCurrentVibe: (vibe) => set({ currentVibe: vibe }),
  
  addVibe: (vibe) =>
    set((state) => ({
      vibes: [vibe, ...state.vibes],
      currentVibe: vibe,
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      vibes: [],
      currentVibe: null,
      isLoading: false,
      error: null,
    }),
}));

