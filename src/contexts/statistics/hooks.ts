import { useContext } from 'react';

import { StatisticsContext } from './context';

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }

  return context;
}
