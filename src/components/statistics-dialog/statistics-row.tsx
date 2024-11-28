interface StatisticsRowProps {
  label: string;
  value: string | number;
}

export function StatisticsRow({ label, value }: StatisticsRowProps) {
  return (
    <div data-testid={label} className="flex flex-col items-center">
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
