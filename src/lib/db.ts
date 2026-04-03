import { openDB, IDBPDatabase } from 'idb';
import type { Clip, ClipType, Space } from '@/types';

const DB_NAME = 'web-clipper-db';
const DB_VERSION = 5;
const CLIPS_STORE = 'clips';
const SPACES_STORE = 'spaces';
const META_STORE = 'meta';

const DEFAULT_SPACE_ID = 'default';

interface WebClipperDB {
  clips: {
    key: string;
    value: Clip;
    indexes: { 'by-type': ClipType; 'by-timestamp': number; 'by-space': string };
  };
  spaces: {
    key: string;
    value: Space;
  };
  meta: {
    key: string;
    value: number;
  };
}

interface BadgeState {
  hasUnread: boolean;
  totalCount: number;
  lastSeenTimestamp: number;
}

let dbPromise: Promise<IDBPDatabase<WebClipperDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WebClipperDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(CLIPS_STORE)) {
            const store = db.createObjectStore(CLIPS_STORE, { keyPath: 'id' });
            store.createIndex('by-type', 'type');
            store.createIndex('by-timestamp', 'timestamp');
            store.createIndex('by-space', 'spaceId');
          }
          
          if (!db.objectStoreNames.contains(SPACES_STORE)) {
            const spaceStore = db.createObjectStore(SPACES_STORE, { keyPath: 'id' });
            const defaultSpace: Space = {
              id: DEFAULT_SPACE_ID,
              name: 'My Space',
              createdAt: Date.now(),
              isDefault: true,
            };
            spaceStore.add(defaultSpace);
          }
          
          if (!db.objectStoreNames.contains(META_STORE)) {
            db.createObjectStore(META_STORE);
          }
        }
        
        if (oldVersion < 5 && oldVersion >= 1) {
          if (!db.objectStoreNames.contains(SPACES_STORE)) {
            const spaceStore = db.createObjectStore(SPACES_STORE, { keyPath: 'id' });
            const defaultSpace: Space = {
              id: DEFAULT_SPACE_ID,
              name: 'My Space',
              createdAt: Date.now(),
              isDefault: true,
            };
            spaceStore.add(defaultSpace);
          }
        }
      },
      blocked() {
        // Silently handle blocked upgrades
      },
    });
  }
  return dbPromise;
}

export async function addClip(clip: Clip): Promise<void> {
  const db = await getDB();
  const clipWithSpace = { ...clip, spaceId: clip.spaceId || DEFAULT_SPACE_ID };
  await db.put(CLIPS_STORE, clipWithSpace);
  notifySidebar('clip-added', clipWithSpace);
}

export async function deleteClip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(CLIPS_STORE, id);
  notifySidebar('clip-deleted', { id });
}

export async function getAllClips(spaceId: string = DEFAULT_SPACE_ID): Promise<Clip[]> {
  const db = await getDB();
  try {
    const clips = await db.getAllFromIndex(CLIPS_STORE, 'by-timestamp');
    return clips.filter(c => c.spaceId === spaceId).reverse();
  } catch {
    const clips = await db.getAll(CLIPS_STORE);
    return clips.filter(c => c.spaceId === spaceId).reverse();
  }
}

export async function getClipsByType(type: ClipType, spaceId: string = DEFAULT_SPACE_ID): Promise<Clip[]> {
  const db = await getDB();
  try {
    const clips = await db.getAllFromIndex(CLIPS_STORE, 'by-type', type);
    return clips.filter(c => c.spaceId === spaceId).reverse();
  } catch {
    const clips = await db.getAll(CLIPS_STORE);
    return clips.filter(c => c.type === type && c.spaceId === spaceId).reverse();
  }
}

export async function searchClips(query: string, spaceId: string = DEFAULT_SPACE_ID): Promise<Clip[]> {
  const allClips = await getAllClips(spaceId);
  const lowerQuery = query.toLowerCase();
  return allClips.filter(clip => 
    clip.content.toLowerCase().includes(lowerQuery) ||
    clip.title?.toLowerCase().includes(lowerQuery) ||
    clip.url?.toLowerCase().includes(lowerQuery)
  );
}

export async function clearAllClips(spaceId: string = DEFAULT_SPACE_ID): Promise<void> {
  const db = await getDB();
  const allClips = await db.getAll(CLIPS_STORE);
  const tx = db.transaction(CLIPS_STORE, 'readwrite');
  for (const clip of allClips) {
    if (clip.spaceId === spaceId) {
      await tx.store.delete(clip.id);
    }
  }
  await tx.done;
  notifySidebar('clips-cleared', null);
}

export async function markAllAsSeen(): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  await db.put(META_STORE, now, 'lastSeenTimestamp');
  notifySidebar('marked-seen', null);
}

export async function getBadgeState(spaceId: string = DEFAULT_SPACE_ID): Promise<BadgeState> {
  const db = await getDB();
  const clips = await db.getAll(CLIPS_STORE);
  const filteredClips = clips.filter(c => c.spaceId === spaceId);
  const lastSeenTimestamp = (await db.get(META_STORE, 'lastSeenTimestamp')) || 0;
  const hasUnread = filteredClips.some(clip => clip.timestamp > lastSeenTimestamp);
  
  return {
    hasUnread,
    totalCount: filteredClips.length,
    lastSeenTimestamp,
  };
}

async function notifySidebar(action: string, data: unknown) {
  try {
    await chrome.runtime.sendMessage({ action, data });
  } catch {
    // Silent catch
  }
}

export async function getClipCount(spaceId: string = DEFAULT_SPACE_ID): Promise<number> {
  const db = await getDB();
  const clips = await db.getAll(CLIPS_STORE);
  return clips.filter(c => c.spaceId === spaceId).length;
}

export async function getAllSpaces(): Promise<Space[]> {
  const db = await getDB();
  try {
    return await db.getAll(SPACES_STORE);
  } catch {
    return [{ id: DEFAULT_SPACE_ID, name: 'My Space', createdAt: Date.now(), isDefault: true }];
  }
}

export async function addSpace(space: Space): Promise<void> {
  const db = await getDB();
  await db.put(SPACES_STORE, space);
}

export async function deleteSpace(id: string): Promise<void> {
  const db = await getDB();
  const space = await db.get(SPACES_STORE, id);
  if (space?.isDefault) return;
  await db.delete(SPACES_STORE, id);
  await clearAllClips(id);
}

export { DEFAULT_SPACE_ID };
