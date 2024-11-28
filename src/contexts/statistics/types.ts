export interface GuessDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: GuessDistribution;
}

export interface StatisticsContextType {
  statistics: Statistics;
  addGameResult: (won: boolean, guessCount: number) => void;
}
