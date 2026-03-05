// src/components/CooldownBar.tsx
interface CooldownBarProps {
  daysRemaining: number;
}

export function CooldownBar({ daysRemaining }: CooldownBarProps) {
  const totalDays = 7;
  const current = Math.max(0, Math.min(totalDays, daysRemaining));
  const width = (current / totalDays) * 100;
  const isToday = daysRemaining <= 0;
  const isTomorrow = daysRemaining === 1;

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[10px] font-bold uppercase text-stone-500 mb-1">
        <span>Cooldown Timer</span>
        <span>{isToday ? 'CONVERTS TOMORROW' : `${daysRemaining} Days Left`}</span>
      </div>
      <div className="h-4 w-full bg-[#e0f2fe] rounded border border-blue-300 relative overflow-hidden">
        <div
          className="h-full absolute right-0 top-0 transition-all duration-500"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(to left, #ec4899, #3b82f6)'
          }}
        />
        {isTomorrow && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 animate-pulse">
            <span className="text-[9px] font-bold text-red-900 uppercase">Converts Tomorrow</span>
          </div>
        )}
      </div>
    </div>
  );
}