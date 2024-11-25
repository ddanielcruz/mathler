import equations from '@/data/equations.json';

export function getDailyEquation() {
  // Get the timestamp of the start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timestamp = today.getTime();

  // Use the timestamp to get the equation
  const equation = equations[timestamp % equations.length];
  const result: number = eval(equation);

  return { equation, result };
}
