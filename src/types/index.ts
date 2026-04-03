export type ClipType = 'text' | 'image' | 'link' | 'note';

export interface Space {
  id: string;
  name: string;
  createdAt: number;
  isDefault?: boolean;
}

export interface Clip {
  id: string;
  type: ClipType;
  content: string;
  url?: string;
  title?: string;
  favicon?: string;
  imageUrl?: string;
  imageAlt?: string;
  timestamp: number;
  spaceId: string;
}

export interface CaptureData {
  type: 'text' | 'image' | 'link' | 'page';
  content: string;
  url?: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  pageFavicon?: string;
}

export type FilterType = 'all' | ClipType;

export interface Message {
  action: string;
  data?: unknown;
}

export interface StorageSchema {
  clips: Clip[];
}
