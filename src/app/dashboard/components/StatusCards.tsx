type CardProps = {
  title: string;
  count: number;
  color: string;
};

function Card({ title, count, color }: CardProps) {
  return (
    <div 
      className="bg-card text-card-foreground rounded-xl p-6 flex items-center justify-between border border-border hover:shadow-lg transition-shadow"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold text-card-foreground">{count}</p>
      </div>

      <div
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
        style={{ backgroundColor: color }}
      >
        <span className="text-white font-bold text-xl">
          {count}
        </span>
      </div>
    </div>
  );
}

export default function StatusCards({
  stats,
}: {
  stats: Record<string, number>;
}) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <Card
        title="Awaiting Response"
        count={stats['Awaiting Response'] ?? 0}
        color="#4f46e5"
      />
      <Card
        title="Email Sent"
        count={stats['Email Sent'] ?? 0}
        color="#a855f7"
      />
      <Card
        title="Call Postponed"
        count={stats['Call Postponed'] ?? 0}
        color="#06b6d4"
      />
      <Card
        title="Wrong Number"
        count={stats['Wrong Number'] ?? 0}
        color="#f97316"
      />
    </div>
  );
}