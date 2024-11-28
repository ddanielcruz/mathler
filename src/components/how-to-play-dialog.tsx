import { DialogDescription } from '@radix-ui/react-dialog';

import { Guess } from './game/guess';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function HowToPlayDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-white">How to play?</DialogTrigger>
      <DialogContent className="text-gray-700 sm:w-[calc(3.5rem*6+0.375rem*5)+3rem] sm:max-w-min">
        <DialogHeader>
          <DialogTitle className="text-blue-700">How to play?</DialogTitle>
          <DialogDescription className="sr-only">Learn how to play the game.</DialogDescription>
        </DialogHeader>

        <p>Try to find the hidden calculation in 6 guesses!</p>
        <p>
          After each guess, the color of the tiles will change to show how close you are to the
          solution.
        </p>

        <Guess
          guess={{
            guess: [
              { key: '5', state: 'present' },
              { key: '0', state: 'absent' },
              { key: '/', state: 'correct' },
              { key: '5', state: 'present' },
              { key: '-', state: 'absent' },
              { key: '2', state: 'absent' },
            ],
            state: 'submitted',
          }}
        />

        <ul className="list-disc space-y-0.5 px-4">
          <li>Green are in the correct place.</li>
          <li>Yellow are in the equation, but in a different place.</li>
          <li>Gray are not in the equation.</li>
        </ul>

        <h3 className="text-xl font-medium text-blue-700">Additional rules</h3>
        <ul className="list-disc space-y-0.5 px-4">
          <li>Numbers and operators can appear multiple times.</li>
          <li>Calculate / or * before - or + (order of operations).</li>
          <li>Commutative solutions are accepted, for example 20+7+3 and 3+7+20.</li>
          <li>Commutative solutions will be automatically rearranged to the exact solution.</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
