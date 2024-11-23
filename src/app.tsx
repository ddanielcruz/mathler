import { Game } from './components/game';
import { GameProvider } from './contexts/game';

export function App() {
  return (
    <GameProvider>
      <main className="flex min-h-svh flex-col items-center justify-center">
        <Game />
      </main>
    </GameProvider>
  );
}
