import { GuessKeyState } from '@/contexts/game';
import { cn } from '@/lib/tailwind';

interface GuessKeyProps {
  value: string;
  state: GuessKeyState | null;
  active: boolean;
  className?: string;
}

export function GuessKey({ value, state, active, className }: GuessKeyProps) {
  return (
    <div
      data-testid="guess-key"
      data-state={state}
      className={cn(
        'flex size-11 items-center justify-center rounded-lg text-3xl text-white transition-colors sm:size-14 sm:text-4xl',
        // Default state (not played)
        !active && !state && 'bg-white/25',
        // Active input state
        active && 'bg-white text-blue-700 opacity-100',
        // Game states
        !active && state === 'absent' && 'bg-gray-500',
        !active && state === 'present' && 'bg-yellow-500',
        !active && state === 'correct' && 'bg-green-500',
        className,
      )}
    >
      {value}
    </div>
  );
}
