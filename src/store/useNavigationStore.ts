import { create } from 'zustand';

type View = 'homepage' | 'dashboard' | 'history' | 'settings' | 'about' | 'match-summary' | 'statistics' | 'players';

interface NavigationStore {
  currentView: View;
  previousView: View | null;
  setView: (view: View) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentView: 'homepage',
  previousView: null,
  setView: (view) => {
    const current = get().currentView;
    // Don't update previousView if navigating to the same view
    if (current !== view) {
      set({ previousView: current, currentView: view });
    } else {
      set({ currentView: view });
    }
  },
  goBack: () => {
    const { previousView } = get();
    if (previousView) {
      set({ currentView: previousView, previousView: null });
    } else {
      // Default to homepage if no previous view
      set({ currentView: 'homepage', previousView: null });
    }
  },
}));
