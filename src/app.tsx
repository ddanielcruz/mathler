import { StatisticsProvider } from '@/contexts/statistics';

import { Game } from './components/game';
import { Header } from './components/header';
import { GameProvider } from './contexts/game';

export function App() {
  return (
    <StatisticsProvider>
      <GameProvider>
        <div className="sm:relative">
          <Header />
          <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center p-4 sm:min-h-svh">
            <Game />
          </main>
        </div>
      </GameProvider>
    </StatisticsProvider>
  );
}
