import { useState, KeyboardEvent } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface QuickNoteProps {
  onSubmit: (content: string) => void;
}

export default function QuickNote({ onSubmit }: QuickNoteProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="relative group">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('quickNote.placeholder')}
          className="w-full rounded-xl px-4 py-3 pr-14 text-sm transition-all duration-300 bg-surface-2 text-foreground border border-transparent placeholder:text-muted-foreground focus:bg-surface-3 focus:border-primary focus:shadow-glow-sm group-hover:bg-surface-3"
        />
        <button
          onClick={() => {
            if (content.trim()) {
              onSubmit(content.trim());
              setContent('');
            }
          }}
          disabled={!content.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg gradient-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:opacity-90 active:scale-95 disabled:hover:scale-100 shadow-glow disabled:shadow-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
