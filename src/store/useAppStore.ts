import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Sport, Settings, MatchHistory, AppState, TennisMatchState, RallyScoreState, PickleballState } from '../types';

interface AppStore extends AppState {
  setCurrentSport: (sport: Sport) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addMatchHistory: (match: MatchHistory) => void;
  clearMatchHistory: () => void;
  startMatch: (sport: Sport, player1Name: string, player2Name: string, player3Name?: string, player4Name?: string, firstServer?: 1 | 2 | 3 | 4, secondServer?: 1 | 2 | 3 | 4, team1Color?: 'navy' | 'blue' | 'green' | 'red' | 'purple', team2Color?: 'navy' | 'blue' | 'green' | 'red' | 'purple') => void;
  endMatch: () => void;
  updateMatchState: (state: TennisMatchState | RallyScoreState | PickleballState) => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  vibrationEnabled: true,
  volume: 0.7,
  autoSaveMatches: true,
  confirmResets: true,
  tennis: {
    matchFormat: 'best-of-3',
    scoring: 'standard',
    tiebreak: true,
  },
  badminton: {},
  tableTennis: {
    matchFormat: 'best-of-3',
  },
  squash: {
    matchFormat: 'best-of-3',
  },
  pickleball: {
    mode: 'singles',
    targetScore: 11,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentSport: 'tennis',
      settings: defaultSettings,
      matchHistory: [],
      currentMatch: null,

      setCurrentSport: (sport) => set({ currentSport: sport }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addMatchHistory: (match) =>
        set((state) => ({
          matchHistory: [match, ...state.matchHistory].slice(0, 50), // Keep last 50 matches
        })),

      clearMatchHistory: () => set({ matchHistory: [] }),

      startMatch: (sport, player1Name, player2Name, player3Name, player4Name, firstServer, secondServer, team1Color, team2Color) => {
        let initialState: TennisMatchState | RallyScoreState | PickleballState | null = null;
        const isDoubles = !!(player3Name && player4Name);

        if (sport === 'tennis' || sport === 'padel') {
          // Determine serving team and side based on firstServer
          // 1=Team1P1, 2=Team2P1, 3=Team1P2, 4=Team2P2
          const servingTeam = firstServer && isDoubles ? (firstServer <= 2 ? 1 : 2) : 1;
          initialState = {
            sets: [],
            currentSet: {
              games: [0, 0],
              currentGame: {
                player1Score: 0,
                player2Score: 0,
                serving: servingTeam,
              },
            },
            serving: servingTeam,
            side: servingTeam,
            firstServer: firstServer,
            secondServer: secondServer,
            currentServer: firstServer || 1,
          } as TennisMatchState;
        } else if (sport === 'badminton' || sport === 'table-tennis' || sport === 'squash') {
          // Determine serving team based on firstServer
          const servingTeam = firstServer && isDoubles ? (firstServer <= 2 ? 1 : 2) : 1;
          initialState = {
            player1Score: 0,
            player2Score: 0,
            serving: servingTeam,
            firstServer: firstServer,
            secondServer: secondServer,
            currentServer: firstServer || 1,
          } as RallyScoreState;
        } else if (sport === 'pickleball') {
          const servingTeam = firstServer && isDoubles ? (firstServer <= 2 ? 1 : 2) : 1;
          initialState = {
            serverScore: 0,
            receiverScore: 0,
            serverNumber: firstServer && isDoubles ? (firstServer === 1 || firstServer === 3 ? 1 : 2) : 1,
            serving: servingTeam,
            isFirstServe: true,
          } as PickleballState;
        }

        set({
          currentMatch: {
            sport,
            startTime: Date.now(),
            player1Name,
            player2Name,
            player3Name,
            player4Name,
            firstServer: firstServer,
            secondServer: secondServer,
            team1Color: team1Color || 'navy',
            team2Color: team2Color || 'blue',
            state: initialState,
          },
        });
      },

      endMatch: () => set({ currentMatch: null }),

      updateMatchState: (state) =>
        set((store) => {
          if (!store.currentMatch) return store;
          return {
            currentMatch: {
              ...store.currentMatch,
              state,
            },
          };
        }),
    }),
    {
      name: 'racket-score-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSport: state.currentSport,
        settings: state.settings,
        matchHistory: state.matchHistory,
      }),
    }
  )
);
