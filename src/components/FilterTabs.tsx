import type { FilterType } from '../types';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Images' },
  { id: 'link', label: 'Links' },
  { id: 'note', label: 'Notes' },
];

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="px-2 pb-2">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {filters.map(({ id, label }) => {
          const count = counts[id];
          const isActive = activeFilter === id;
          
          return (
            <button
              key={id}
              onClick={() => onFilterChange(id)}
              className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'var(--surface-2)',
                minWidth: 'auto',
              }}
            >
              <span>{label}</span>
              {count > 0 && (
                <span 
                  className="text-[9px] px-1 py-0.5 rounded-full font-bold"
                  style={{ 
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)',
                    color: isActive ? '#FFFFFF' : 'var(--muted-foreground)'
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
