import { OPERATORS } from '@/contexts/game';

import { KeyboardKey } from './keyboard-key';

export function KeyboardOperators({ className }: { className?: string }) {
  return OPERATORS.map((operator) => (
    <KeyboardKey key={operator} value={operator} className={className} />
  ));
}
