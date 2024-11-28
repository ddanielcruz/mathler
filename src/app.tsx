import { StatisticsProvider } from '@/contexts/statistics';

import { Game } from './components/game';
import { HowToPlayDialog } from './components/how-to-play-dialog';
import { StatisticsDialog } from './components/statistics-dialog';
import { GameProvider } from './contexts/game';

export function App() {
  return (
    <StatisticsProvider>
      <GameProvider>
        <HowToPlayDialog />
        <StatisticsDialog />
        <main className="flex min-h-svh flex-col items-center justify-center px-4">
          <Game />
        </main>
      </GameProvider>
    </StatisticsProvider>
  );
}
