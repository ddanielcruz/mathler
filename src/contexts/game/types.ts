import { type GuessKey, KeyboardKey } from './keys';

export type GuessState = 'in-progress' | 'submitted' | 'correct' | 'not-played';

export type GuessKeyState = 'absent' | 'present' | 'correct' | 'not-played';

export interface Guess {
  guess: string;
  state: GuessState;
}

export interface GameState {
  guesses: Guess[];
  keys: Partial<Record<GuessKey, GuessKeyState>>;
  equationResult: number;
}

export interface GameActions {
  onKeyPress: (key: KeyboardKey) => void;
}

export type GameContextType = GameState & GameActions;
