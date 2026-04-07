import { useState } from 'react';
import type { Clip } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ClipCardProps {
  clip: Clip;
  onDeleteRequest: (clip: Clip) => void;
}

const typeConfig = {
  text: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    bgClass: 'bg-type-text-bg',
    colorClass: 'text-type-text',
  },
  image: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    bgClass: 'bg-type-image-bg',
    colorClass: 'text-type-image',
  },
  link: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    bgClass: 'bg-type-link-bg',
    colorClass: 'text-type-link',
  },
  note: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    bgClass: 'bg-type-note-bg',
    colorClass: 'text-type-note',
  },
};

function getDomain(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url.slice(0, 25);
  }
}

function formatTimestamp(timestamp: number, t: (key: string) => string): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (seconds < 60) return t('time.justNow');
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ClipCard({ clip, onDeleteRequest }: ClipCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const config = typeConfig[clip.type];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = clip.type === 'link' ? clip.url : clip.content;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteRequest(clip);
  };

  const handleOpenUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clip.url) {
      chrome.tabs.create({ url: clip.url });
    }
  };

  return (
    <div
      className={`group relative flex items-stretch rounded-xl mb-2 cursor-pointer transition-all duration-300 animate-fade-in overflow-hidden ${
        isHovered 
          ? 'bg-surface-3 shadow-md scale-[1.01]' 
          : 'bg-surface-2'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
      }}
    >
      <div 
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div className={`relative flex items-start gap-3 p-3 flex-1 min-w-0 transition-transform duration-300 ${
        isHovered ? '-translate-x-[52px]' : 'translate-x-0'
      }`}>

        <div className={`relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${config.bgClass} ${config.colorClass} ${
          isHovered ? 'scale-105' : ''
        }`}>
          {config.icon}
          <div className={`absolute inset-0 rounded-lg ${config.bgClass} blur-lg opacity-40`} />
        </div>

        <div className="flex-1 min-w-0">
          {clip.type === 'image' && clip.imageUrl && !imageError ? (
            <div className="flex gap-3">
              <img 
                src={clip.imageUrl} 
                alt={clip.imageAlt || 'Image'}
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-surface-4 transition-all duration-200 group-hover:ring-primary/30"
                onError={() => setImageError(true)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm line-clamp-2 leading-relaxed text-foreground">
                  {clip.content}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm line-clamp-2 leading-relaxed text-foreground">
              {clip.content}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {clip.favicon && (
              <img 
                src={clip.favicon} 
                alt="" 
                className="w-3.5 h-3.5 rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="truncate">
              {clip.type === 'note' ? t('clipCard.quickNote') : getDomain(clip.url)}
            </span>
            <span className="opacity-40">·</span>
            <span>{t('clipCard.saved')} {formatTimestamp(clip.timestamp, t)}</span>
          </div>
        </div>
      </div>

      <div
        className={`absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 p-1 rounded-lg transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
        style={{ backgroundColor: 'var(--surface-2)' }}
      >
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
          style={{ 
            backgroundColor: copied ? 'var(--primary)' : 'transparent', 
            color: copied ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          }}
          title={copied ? t('clipCard.copied') : t('clipCard.copy')}
        >
          {copied ? (
            <svg className="w-3.5 h-3.5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
          )}
        </button>
        
        {clip.url && clip.type !== 'image' && (
          <button
            onClick={handleOpenUrl}
            className="p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center text-muted-foreground hover:text-foreground"
            style={{ backgroundColor: 'transparent' }}
            title={t('clipCard.openLink')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleDeleteClick}
          className="p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center text-muted-foreground hover:text-destructive"
          style={{ backgroundColor: 'transparent' }}
          title={t('clipCard.delete')}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
