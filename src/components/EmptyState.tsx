import { useTranslation } from '../hooks/useTranslation';

interface EmptyStateProps {
  isSearching: boolean;
  searchQuery: string;
}

export default function EmptyState({ isSearching, searchQuery }: EmptyStateProps) {
  const { t } = useTranslation();

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-surface-3 animate-pulse">
          <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-foreground font-medium">{t('header.search')}...</p>
      </div>
    );
  }

  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-surface-3">
          <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-semibold mb-1 text-foreground">{t('emptyState.noResults')}</p>
        <p className="text-xs text-muted-foreground">{t('emptyState.noResultsHint')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 animate-float">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/20 animate-bounce">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }}></div>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 blur-xl -z-10 animate-glow"></div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-foreground tracking-tight">{t('app.taglineFull')}</h3>
      <p className="text-sm mb-8 max-w-[260px] text-muted-foreground">{t('emptyState.noClipsHint')}</p>
      
      <div className="rounded-2xl p-5 text-left w-full max-w-[300px] bg-surface-2 border border-border shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-muted-foreground">{t('emptyState.quickCapture')}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <kbd className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-surface-3 text-muted-foreground border border-border/50">
              ⌘⇧E
            </kbd>
            <span className="text-xs text-muted-foreground">{t('emptyState.captureShortcut')}</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-surface-3 text-muted-foreground border border-border/50">
              {t('emptyState.rightClick')}
            </kbd>
            <span className="text-xs text-muted-foreground">{t('emptyState.saveContent')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
