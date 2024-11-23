import { DIGITS, OPERATORS } from '@/contexts/game';

import { KeyboardKey } from './keyboard-key';

export function Keyboard() {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {/* Digits row */}
      <div className="flex gap-1.5">
        {DIGITS.map((digit) => (
          <KeyboardKey key={digit} value={digit} />
        ))}
      </div>

      {/* Operators and control row */}
      <div className="flex gap-1.5">
        <KeyboardKey wide value="Enter" />
        {OPERATORS.map((operator) => (
          <KeyboardKey key={operator} value={operator} />
        ))}
        <KeyboardKey wide value="Delete" />
      </div>
    </div>
  );
}
