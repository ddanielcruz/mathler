import { GuessKey, useGame } from '@/contexts/game';
import { cn } from '@/lib/tailwind';

interface KeyboardKeyProps {
  value: string;
  wide?: boolean;
  className?: string;
}

export function KeyboardKey({ value, wide = false, className }: KeyboardKeyProps) {
  const { keys } = useGame();
  const keyState = value ? keys[value.toLowerCase() as GuessKey] : undefined;

  return (
    <button
      className={cn(
        'flex size-11 items-center justify-center rounded-lg text-lg font-medium shadow-sm transition-all sm:size-14 sm:text-xl',
        'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700',
        'active:scale-95',
        wide && 'w-20 sm:w-24',
        // Default state
        !keyState && 'bg-white text-black hover:brightness-95 active:brightness-90',
        // Game states
        keyState === 'absent' && 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700',
        keyState === 'present' &&
          'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700',
        keyState === 'correct' && 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
        className,
      )}
    >
      {value}
    </button>
  );
}
