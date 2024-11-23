import { Guesses } from './guesses';
import { Keyboard } from './keyboard';

export function Game() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Guesses />
      <Keyboard />
    </div>
  );
}
