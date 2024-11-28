import { StatisticsProvider } from '@/contexts/statistics';

import { Game } from './components/game';
import { HowToPlay } from './components/how-to-play';
import { GameProvider } from './contexts/game';

export function App() {
  return (
    <StatisticsProvider>
      <GameProvider>
        <HowToPlay />
        <main className="flex min-h-svh flex-col items-center justify-center px-4">
          <Game />
        </main>
      </GameProvider>
    </StatisticsProvider>
  );
}
