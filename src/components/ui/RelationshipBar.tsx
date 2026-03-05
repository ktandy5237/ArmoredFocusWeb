// src/components/RelationshipBar.tsx
interface RelationshipBarProps {
  score: number;
}

export function RelationshipBar({ score }: RelationshipBarProps) {
  const safeScore = Math.max(1, Math.min(100, score || 0));
  const gradientWidth = (100 / safeScore) * 100;

  return (
    <div className="w-full h-3 bg-gray-300 rounded-full border border-gray-400 relative overflow-hidden">
      <div
        className="h-full absolute left-0 top-0 transition-all duration-500 overflow-hidden"
        style={{ width: `${safeScore}%` }}
      >
        <div
          className="h-full"
          style={{
            width: `${gradientWidth}%`,
            background: 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)',
          }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-[1px] bg-black/40 top-0"
            style={{ left: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}