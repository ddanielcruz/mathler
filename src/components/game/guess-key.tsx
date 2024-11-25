import { useGame } from '@/contexts/game';
import { cn } from '@/lib/tailwind';

interface GuessKeyProps {
  value: string;
  active: boolean;
  className?: string;
}

export function GuessKey({ value, active, className }: GuessKeyProps) {
  const { keys } = useGame();
  const keyState = value ? keys[value.toLowerCase() as keyof typeof keys] : undefined;

  return (
    <div
      className={cn(
        'flex size-11 items-center justify-center rounded-lg text-3xl text-white transition-colors sm:size-14 sm:text-4xl',
        // Default state (not played)
        !active && !keyState && 'bg-white/25',
        // Active input state
        active && 'bg-white text-blue-700 opacity-100',
        // Game states
        !active && keyState === 'absent' && 'bg-gray-500',
        !active && keyState === 'present' && 'bg-yellow-500',
        !active && keyState === 'correct' && 'bg-green-500',
        className,
      )}
    >
      <span>{value}</span>
    </div>
  );
}
