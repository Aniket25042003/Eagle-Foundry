import { cn } from '@/lib/cn';

interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps): JSX.Element {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
            active === tab
              ? 'border-[var(--border)] bg-[var(--elements)] text-[var(--foreground)]'
              : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
