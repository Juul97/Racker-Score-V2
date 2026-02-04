export type Sport = 'tennis' | 'padel' | 'badminton' | 'table-tennis' | 'squash' | 'pickleball';

export type Theme = 'light' | 'dark';

export interface Player {
  name: string;
  color?: string;
}

export interface Team {
  player1: Player;
  player2?: Player; // For doubles
}

// Tennis/Padel scoring
export type TennisScore = 0 | 15 | 30 | 40 | 'ad' | 'game';
export interface TennisGameState {
  player1Score: TennisScore;
  player2Score: TennisScore;
  serving: 1 | 2;
}

export interface TennisSetState {
  games: [number, number];
  currentGame: TennisGameState;
  tiebreak?: {
    player1Score: number;
    player2Score: number;
    serving: 1 | 2;
  };
}

export interface TennisMatchState {
  sets: Array<{ games: [number, number]; tiebreak?: [number, number] }>;
  currentSet: TennisSetState;
  serving: 1 | 2;
  side: 1 | 2; // Which side is serving
  firstServer?: 1 | 2 | 3 | 4; // For doubles: which player serves first
  secondServer?: 1 | 2 | 3 | 4; // For doubles: which player serves second (must be from opposite team)
  currentServer?: 1 | 2 | 3 | 4; // Current server in doubles rotation
}

// Badminton/Table Tennis/Squash scoring (rally scoring)
export interface RallyScoreState {
  player1Score: number;
  player2Score: number;
  serving: 1 | 2;
  firstServer?: 1 | 2 | 3 | 4; // For doubles: which player serves first (1=Team1P1, 2=Team2P1, 3=Team1P2, 4=Team2P2)
  secondServer?: 1 | 2 | 3 | 4; // For doubles: which player serves second (must be from opposite team)
  currentServer?: 1 | 2 | 3 | 4; // Current server in doubles rotation
}

// Pickleball scoring
export interface PickleballState {
  serverScore: number;
  receiverScore: number;
  serverNumber: 1 | 2; // 1st or 2nd server
  serving: 1 | 2; // Which team is serving
  isFirstServe: boolean; // True if this is the first serve of the game
}

export interface MatchHistory {
  id: string;
  sport: Sport;
  date: string;
  duration: number;
  player1Name: string;
  player2Name: string;
  result: string; // e.g., "6-4, 7-5" or "21-18, 19-21, 21-16"
  winner: 1 | 2;
  totalPoints?: [number, number];
}

export interface Settings {
  theme: Theme;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volume: number;
  autoSaveMatches: boolean;
  confirmResets: boolean;
  // Sport-specific defaults
  tennis: {
    matchFormat: 'best-of-3' | 'best-of-5';
    scoring: 'standard' | 'no-ad';
    tiebreak: boolean;
  };
  badminton: {
    // No specific settings yet
  };
  tableTennis: {
    matchFormat: 'best-of-3' | 'best-of-5' | 'best-of-7';
  };
  squash: {
    matchFormat: 'best-of-3' | 'best-of-5';
  };
  pickleball: {
    mode: 'singles' | 'doubles';
    targetScore: 11 | 15 | 21;
  };
}

export interface AppState {
  currentSport: Sport;
  settings: Settings;
  matchHistory: MatchHistory[];
  // Current match state (sport-specific)
  currentMatch: {
    sport: Sport;
    startTime: number;
    player1Name: string;
    player2Name: string;
    player3Name?: string; // For doubles
    player4Name?: string; // For doubles
    firstServer?: 1 | 2 | 3 | 4; // For doubles: which player serves first
    secondServer?: 1 | 2 | 3 | 4; // For doubles: which player serves second (must be from opposite team)
    team1Color?: 'navy' | 'blue' | 'green' | 'red' | 'purple'; // Team 1 color
    team2Color?: 'navy' | 'blue' | 'green' | 'red' | 'purple'; // Team 2 color
    state: TennisMatchState | RallyScoreState | PickleballState | null;
  } | null;
}
