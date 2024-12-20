import { useEventListener } from 'usehooks-ts';

import { DIGITS, isKeyboardKey, useGame } from '@/contexts/game';

import { KeyboardKey } from './keyboard-key';
import { KeyboardOperators } from './keyboard-operators';

// TODO Listen to left and right arrow keys to navigate between keys
export function Keyboard() {
  const { onKeyPress } = useGame();

  useEventListener('keydown', (event) => {
    const key = event.key === 'Backspace' ? 'Delete' : event.key;
    if (isKeyboardKey(key)) {
      onKeyPress(key);
    }
  });

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2" data-testid="keyboard">
      {/* Digits row */}
      <div className="grid grid-cols-7 gap-1.5 sm:flex">
        {DIGITS.map((digit) => (
          <KeyboardKey key={digit} value={digit} />
        ))}
        <KeyboardOperators className="inline-flex sm:hidden" />
      </div>

      {/* Operators and control row */}
      <div className="flex gap-1.5">
        <KeyboardKey wide value="Enter" />
        <KeyboardOperators className="hidden sm:inline-flex" />
        <KeyboardKey wide value="Delete" />
      </div>
    </div>
  );
}
