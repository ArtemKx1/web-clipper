import { useState, useEffect, useRef } from 'react';
import type { Space } from '../types';

interface SpaceSelectorProps {
  currentSpaceId: string;
  onSpaceChange: (spaceId: string) => void;
}

export default function SpaceSelector({ currentSpaceId, onSpaceChange }: SpaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadSpaces = async () => {
    try {
      const { getAllSpaces } = await import('../lib/db');
      const allSpaces = await getAllSpaces();
      if (allSpaces.length === 0) {
        setSpaces([{ id: 'default', name: 'My Space', createdAt: Date.now(), isDefault: true }]);
      } else {
        setSpaces(allSpaces);
      }
    } catch {
      setSpaces([{ id: 'default', name: 'My Space', createdAt: Date.now(), isDefault: true }]);
    }
  };

  const currentSpace = spaces.find(s => s.id === currentSpaceId) || spaces[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 bg-surface-2 hover:bg-surface-3 text-foreground border border-transparent hover:border-border"
      >
        <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center shadow-glow-sm">
          <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <span className="text-sm font-medium max-w-[120px] truncate">{currentSpace?.name || 'My Space'}</span>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen z-[9990]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-surface-2 border border-border shadow-lg z-[9999] animate-scale-in overflow-hidden">
          <div className="p-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
              Spaces
            </p>
            {spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => {
                  onSpaceChange(space.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  space.id === currentSpaceId 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-surface-3'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  space.id === currentSpaceId ? 'gradient-primary shadow-glow-sm' : 'bg-surface-3'
                }`}>
                  <svg className={`w-3.5 h-3.5 ${space.id === currentSpaceId ? 'text-primary-foreground' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <span className="text-sm font-medium flex-1 text-left truncate">{space.name}</span>
                {space.isDefault && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground">Default</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="border-t border-border p-2">
            <div className="relative">
              <button
                disabled
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 opacity-60 cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-foreground block">Create Space</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  SOON
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
