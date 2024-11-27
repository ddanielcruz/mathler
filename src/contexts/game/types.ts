import { type GuessKey, KeyboardKey } from './keys';

export type GuessState = 'in-progress' | 'submitted' | 'correct' | 'not-played';

export type KeyboardKeyState = 'absent' | 'present' | 'correct' | 'not-played';

export type GuessKeyState = Exclude<KeyboardKeyState, 'not-played'>;

export type GuessValueKey = {
  key: GuessKey;
  state: GuessKeyState | null; // Null is used for the current guess
};

export interface Guess {
  guess: GuessValueKey[];
  state: GuessState;
}

export type GameStatus = 'in-progress' | 'won' | 'lost';

export interface GameContextState {
  guesses: Guess[];
  keys: Partial<Record<GuessKey, KeyboardKeyState>>;
  equationResult: number;
  error: string | null;
  status: GameStatus;
}

export interface GameContextActions {
  onKeyPress: (key: KeyboardKey) => void;
}

export type GameContextType = GameContextState & GameContextActions;
