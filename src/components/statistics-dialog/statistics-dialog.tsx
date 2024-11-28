import { useStatistics } from '@/contexts/statistics';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { GuessDistributionBar } from './guess-distribution-bar';
import { StatisticsRow } from './statistics-row';

export function StatisticsDialog() {
  const { statistics } = useStatistics();
  const { gamesPlayed, gamesWon, currentStreak, bestStreak, guessDistribution } = statistics;

  // Calculate win rate
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  // Find the maximum value in guess distribution for scaling
  const maxGuesses = Math.max(...Object.values(guessDistribution));
  const totalGuesses = Object.values(guessDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <Dialog>
      <DialogTrigger className="text-white">Stats</DialogTrigger>
      <DialogContent className="flex flex-col gap-4 text-gray-700">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Statistics</DialogTitle>
          <DialogDescription className="sr-only">View game statistics.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-around">
          <StatisticsRow label="Played" value={gamesPlayed} />
          <StatisticsRow label="Win %" value={`${winRate}%`} />
          <StatisticsRow label="Current streak" value={currentStreak} />
          <StatisticsRow label="Best streak" value={bestStreak} />
        </div>

        <div>
          <h3 className="mb-2 text-center font-medium">Guess Distribution</h3>
          <div className="flex flex-col gap-1">
            {Object.entries(guessDistribution).map(([guess, count]) => (
              <GuessDistributionBar
                key={guess}
                count={count}
                isMax={count === maxGuesses && count > 0}
                total={totalGuesses}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
