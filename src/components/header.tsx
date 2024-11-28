import { HowToPlayDialog } from './how-to-play-dialog';
import { StatisticsDialog } from './statistics-dialog';

export function Header() {
  return (
    <header className="inset-x-0 bg-white/10 sm:fixed">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4">
        <img src="mathler.svg" alt="" className="size-10" />

        <div className="flex items-start gap-2">
          <HowToPlayDialog />
          <StatisticsDialog />
        </div>
      </div>
    </header>
  );
}
