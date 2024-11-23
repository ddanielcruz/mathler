export type GuessState = 'in-progress' | 'submitted' | 'correct' | 'not-played';

export type GuessKeyState = 'absent' | 'present' | 'correct' | 'not-played';

export interface Guess {
  guess: string;
  state: GuessState;
}
