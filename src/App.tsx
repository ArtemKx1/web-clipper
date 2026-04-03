import { useState, useEffect, useCallback, DragEvent } from 'react';
import Header from './components/Header';
import QuickNote from './components/QuickNote';
import FilterTabs from './components/FilterTabs';
import ClipList from './components/ClipList';
import EmptyState from './components/EmptyState';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import type { Clip, FilterType } from './types';
import type { Theme } from './types/settings';
import { getSettings } from './lib/settings';
import { DEFAULT_SPACE_ID } from './lib/db';

function App() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingDeleteClip, setPendingDeleteClip] = useState<Clip | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [currentSpaceId, setCurrentSpaceId] = useState(DEFAULT_SPACE_ID);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(t);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer?.items;
    const files = e.dataTransfer?.files;
    
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            try {
              chrome.runtime.sendMessage({
                action: 'add-clip',
                data: {
                  id: crypto.randomUUID(),
                  type: 'image',
                  content: file.name || 'Dropped image',
                  imageUrl,
                  timestamp: Date.now(),
                  spaceId: currentSpaceId
                }
              });
            } catch {
              // Extension context invalidated
            }
          };
          reader.readAsDataURL(file);
        }
      }
      return;
    }

    if (items) {
      for (const item of Array.from(items)) {
        if (item.kind === 'string') {
          const text = await new Promise<string>((resolve) => {
            item.getAsString(resolve);
          });

          try {
            if (text.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i)) {
              chrome.runtime.sendMessage({
                action: 'add-clip',
                data: {
                  id: crypto.randomUUID(),
                  type: 'image',
                  content: text,
                  imageUrl: text,
                  timestamp: Date.now(),
                  spaceId: currentSpaceId
                }
              });
            } else if (text.match(/^https?:\/\//i)) {
              chrome.runtime.sendMessage({
                action: 'add-clip',
                data: {
                  id: crypto.randomUUID(),
                  type: 'link',
                  content: text,
                  url: text,
                  timestamp: Date.now(),
                  spaceId: currentSpaceId
                }
              });
            } else {
              chrome.runtime.sendMessage({
                action: 'add-clip',
                data: {
                  id: crypto.randomUUID(),
                  type: 'text',
                  content: text,
                  timestamp: Date.now(),
                  spaceId: currentSpaceId
                }
              });
            }
          } catch {
            // Extension context invalidated
          }
        }
      }
    }
  }, [currentSpaceId]);

  useEffect(() => {
    getSettings().then((settings) => {
      setTheme(settings.theme);
      applyTheme(settings.theme);
      if (!settings.hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    });
    
    try {
      chrome.runtime.sendMessage({ action: 'sidebar-opened' });
    } catch {
      // Extension context invalidated
    }
    
    return () => {
      try {
        chrome.runtime.sendMessage({ action: 'sidebar-closed' });
      } catch {
        // Extension context invalidated
      }
    };
  }, [applyTheme]);

  const loadClips = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'get-clips', data: currentSpaceId });
      if (response?.clips) {
        setClips(response.clips);
      }
    } catch {
      // Extension context invalidated or service worker unavailable
    }
  }, [currentSpaceId]);

  useEffect(() => {
    loadClips();

    const handleMessage = (message: { action: string; data?: unknown }) => {
      if (message.action === 'clip-added') {
        setClips(prev => [message.data as Clip, ...prev]);
      } else if (message.action === 'clip-deleted') {
        setClips(prev => prev.filter(c => c.id !== (message.data as { id: string }).id));
      } else if (message.action === 'clips-cleared') {
        setClips([]);
      }
    };

    try {
      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
        try {
          chrome.runtime.onMessage.removeListener(handleMessage);
        } catch {
          // Already removed
        }
      };
    } catch {
      // Extension context invalidated
    }
  }, [loadClips]);

  useEffect(() => {
    const searchClips = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await chrome.runtime.sendMessage({ 
            action: 'search-clips', 
            data: searchQuery 
          });
          if (response?.clips) {
            setClips(response.clips);
          }
        } catch {
          // Extension context invalidated
        }
        setIsSearching(false);
      } else {
        loadClips();
      }
    };

    const debounce = setTimeout(searchClips, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, loadClips]);

  const handleDeleteRequest = (clip: Clip) => {
    setPendingDeleteClip(clip);
  };

  const handleDeleteConfirm = async () => {
    if (pendingDeleteClip) {
      try {
        await chrome.runtime.sendMessage({ action: 'delete-clip', data: pendingDeleteClip.id });
        setClips(prev => prev.filter(c => c.id !== pendingDeleteClip.id));
      } catch {
        // Extension context invalidated
      }
      setPendingDeleteClip(null);
    }
  };

  const handleDeleteCancel = () => {
    setPendingDeleteClip(null);
  };

  const handleClearAllRequest = () => {
    setShowClearAllConfirm(true);
  };

  const handleClearAllConfirm = async () => {
    try {
      await chrome.runtime.sendMessage({ action: 'clear-all' });
      setClips([]);
    } catch {
      // Extension context invalidated
    }
    setShowClearAllConfirm(false);
  };

  const handleAddNote = (content: string) => {
    try {
      chrome.runtime.sendMessage({
        action: 'add-clip',
        data: {
          id: crypto.randomUUID(),
          type: 'note',
          content,
          timestamp: Date.now(),
          spaceId: currentSpaceId
        }
      });
    } catch {
      // Extension context invalidated
    }
  };

  const filteredClips = filter === 'all' 
    ? clips 
    : clips.filter(c => c.type === filter);

  return (
    <div 
      className="flex flex-col h-full relative"
      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDragLeave={(e) => { 
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false); 
      }}
      onDrop={handleDrop}
    >
      <div 
        className="flex flex-col h-full transition-colors duration-300 bg-background text-foreground relative overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.03) 0%, transparent 60%)'
        }} />
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onClearAllRequest={handleClearAllRequest}
          onOpenSettings={() => setShowSettings(true)}
          hasClips={clips.length > 0}
          currentSpaceId={currentSpaceId}
          onSpaceChange={setCurrentSpaceId}
        />
        
        <QuickNote onSubmit={handleAddNote} />
        
        <FilterTabs 
          activeFilter={filter} 
          onFilterChange={setFilter}
          counts={{
            all: clips.length,
            text: clips.filter(c => c.type === 'text').length,
            image: clips.filter(c => c.type === 'image').length,
            link: clips.filter(c => c.type === 'link').length,
            note: clips.filter(c => c.type === 'note').length,
          }}
        />
        
        <div className="flex-1 overflow-hidden px-4 py-3">
          {filteredClips.length === 0 ? (
            <EmptyState isSearching={isSearching} searchQuery={searchQuery} />
          ) : (
            <ClipList 
              clips={filteredClips} 
              onDeleteRequest={handleDeleteRequest}
            />
          )}
        </div>
      </div>

      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {isDragging && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-fade-in bg-black/80 backdrop-blur-md"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center gradient-primary shadow-glow animate-bounce">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-primary-light opacity-50 blur-lg -z-10"></div>
          </div>
          <p className="text-sm font-semibold text-foreground mt-4">
            Drop to save
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            Images, links, text, or files
          </p>
        </div>
      )}

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {pendingDeleteClip && (
        <div 
          className="absolute inset-0 z-[9999] animate-fade-in flex items-center justify-center overlay"
          onClick={handleDeleteCancel}
        >
          <div 
            className="p-5 rounded-2xl shadow-xl mx-6 animate-scale-in max-w-[280px] bg-surface-3 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-destructive to-destructive/80 shadow-lg">
                  <svg className="w-5 h-5 text-destructive-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <div className="absolute -inset-0.5 rounded-xl from-destructive to-destructive/60 opacity-30 blur-sm -z-10"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Delete clip?
                </p>
                <p className="text-xs mt-0.5 truncate max-w-[180px] text-muted-foreground">
                  {pendingDeleteClip.content.slice(0, 50)}{pendingDeleteClip.content.length > 50 ? '...' : ''}
                </p>
              </div>
            </div>
            <p className="text-xs mb-4 text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-surface-4 text-muted-foreground hover:bg-surface-5 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:opacity-90 active:scale-[0.98] shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearAllConfirm && (
        <div 
          className="absolute inset-0 z-[9999] animate-fade-in flex items-center justify-center overlay"
          onClick={() => setShowClearAllConfirm(false)}
        >
          <div 
            className="p-5 rounded-2xl shadow-xl mx-6 animate-scale-in max-w-[280px] bg-surface-3 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-destructive to-destructive/80 shadow-lg">
                  <svg className="w-5 h-5 text-destructive-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <div className="absolute -inset-0.5 rounded-xl from-destructive to-destructive/60 opacity-30 blur-sm -z-10"></div>
              </div>
              <p className="text-sm font-bold text-foreground">
                Delete all clips?
              </p>
            </div>
            <p className="text-xs mb-4 text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-surface-4 text-muted-foreground hover:bg-surface-5 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:opacity-90 active:scale-[0.98] shadow-lg"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
