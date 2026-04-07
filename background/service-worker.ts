import { v4 as uuidv4 } from 'uuid';
import { addClip, deleteClip, clearAllClips, getAllClips, searchClips, markAllAsSeen, getBadgeState, DEFAULT_SPACE_ID } from '../src/lib/db';
import type { Clip, CaptureData } from '../src/types';

let translations: Record<string, string> = {};
let currentLanguage = 'en';

async function getTranslations() {
  try {
    const result = await chrome.storage.local.get('web-clipper-settings');
    const settings = result['web-clipper-settings'];
    currentLanguage = settings?.language || 'en';
  } catch {
    currentLanguage = 'en';
  }
  
  try {
    const response = await fetch(chrome.runtime.getURL(`/locales/${currentLanguage}.json`));
    if (response.ok) {
      translations = await response.json();
    } else {
      const fallback = await fetch(chrome.runtime.getURL('/locales/en.json'));
      translations = await fallback.json();
    }
  } catch {
    translations = {};
  }
}

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

async function isSidebarOpen(): Promise<boolean> {
  const result = await chrome.storage.local.get('sidebarOpen');
  return result.sidebarOpen === true;
}

async function setSidebarOpen(open: boolean): Promise<void> {
  await chrome.storage.local.set({ sidebarOpen: open });
}

async function setBadge(): Promise<void> {
  try {
    const state = await getBadgeState();
    const sidebarIsOpen = await isSidebarOpen();
    
    if (state.totalCount > 0 && !sidebarIsOpen) {
      await chrome.action.setBadgeText({ text: '·' });
      await chrome.action.setBadgeBackgroundColor({ color: '#6366F1' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (e) {
    // Badge API not available
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await getTranslations();
  createContextMenus();
  configureSidePanel();
  setBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  await getTranslations();
  await setSidebarOpen(false);
  setBadge();
});

async function configureSidePanel() {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'sidebar-opened') {
        setSidebarOpen(true);
        markAllAsSeen();
        setBadge();
      } else if (message.action === 'sidebar-closed') {
        setSidebarOpen(false);
        setBadge();
      }
      return false;
    });
  } catch (e) {
    // Side panel API not available
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    await setSidebarOpen(true);
    await markAllAsSeen();
    await setBadge();
  }
});

chrome.storage.onChanged.addListener(async (changes) => {
  if (changes['web-clipper-settings']) {
    await getTranslations();
    createContextMenus();
  }
});

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'save-text',
      title: `Web Clipper - ${t('contextMenu.saveText', 'Save text')}`,
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'save-image',
      title: `Web Clipper - ${t('contextMenu.saveImage', 'Save image')}`,
      contexts: ['image']
    });

    chrome.contextMenus.create({
      id: 'save-link',
      title: `Web Clipper - ${t('contextMenu.saveLink', 'Save link')}`,
      contexts: ['link']
    });

    chrome.contextMenus.create({
      id: 'save-page',
      title: `Web Clipper - ${t('contextMenu.savePage', 'Save page')}`,
      contexts: ['page']
    });
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  const showToast = async (message: string) => {
    await chrome.tabs.sendMessage(tab.id, { action: 'show-toast', message }).catch(() => {});
  };

  switch (info.menuItemId) {
    case 'save-text':
      if (info.selectionText) {
        await captureText(info.selectionText, tab);
        await showToast(t('toast.textSaved', 'Text saved to Web Clipper'));
      }
      break;
    case 'save-image':
      if (info.srcUrl) {
        await captureImage(info.srcUrl, info.altText || '', tab);
        await showToast(t('toast.imageSaved', 'Image saved to Web Clipper'));
      }
      break;
    case 'save-link':
      if (info.linkUrl) {
        await captureLink(info.linkUrl, info.linkText || info.linkUrl, tab);
        await showToast(t('toast.linkSaved', 'Link saved to Web Clipper'));
      }
      break;
    case 'save-page':
      if (tab.url && tab.title) {
        await capturePage(tab.url, tab.title, tab);
        await showToast(t('toast.pageSaved', 'Page saved to Web Clipper'));
      }
      break;
  }
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === '_execute_side_panel') {
    if (tab?.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      await setSidebarOpen(true);
      await markAllAsSeen();
      await setBadge();
    }
    return;
  }

  if (command === 'capture') {
    try {
      if (tab?.id && tab.url) {
        const selection = await chrome.tabs.sendMessage(tab.id, { action: 'get-selection' }).catch(() => null);
        if (selection) {
          await captureText(selection, tab);
          await chrome.tabs.sendMessage(tab.id, { 
            action: 'show-toast', 
            message: t('toast.textSaved', 'Text saved to Web Clipper') 
          }).catch(() => {});
        } else {
          await capturePage(tab.url, tab.title || 'Untitled', tab);
          await chrome.tabs.sendMessage(tab.id, { 
            action: 'show-toast', 
            message: t('toast.pageSaved', 'Page saved to Web Clipper') 
          }).catch(() => {});
        }
      }
    } catch (error) {
      // Silent fail for capture commands
    }
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse).catch((e) => sendResponse({ error: e.message }));
  return true;
});

async function handleMessage(message: { action: string; data?: unknown }): Promise<unknown> {
  switch (message.action) {
    case 'add-clip':
      await addClip(message.data as Clip);
      await setBadge();
      return { success: true };
    case 'delete-clip':
      await deleteClip(message.data as string);
      await setBadge();
      return { success: true };
    case 'get-clips':
      return { clips: await getAllClips(message.data as string || DEFAULT_SPACE_ID) };
    case 'search-clips':
      return { clips: await searchClips(message.data as string) };
    case 'clear-all':
      await clearAllClips();
      await setBadge();
      return { success: true };
    case 'mark-seen':
      await markAllAsSeen();
      await setBadge();
      return { success: true };
    case 'sidebar-opened':
      await setSidebarOpen(true);
      await markAllAsSeen();
      await setBadge();
      return { success: true };
    case 'sidebar-closed':
      await setSidebarOpen(false);
      await setBadge();
      return { success: true };
    case 'capture-page':
      return await handleCapturePage(message.data as CaptureData);
    case 'get-commands':
      try {
        const commands = await chrome.commands.getAll();
        const captureCommand = commands.find(c => c.name === 'capture');
        return { shortcut: captureCommand?.shortcut || null };
      } catch {
        return { shortcut: null };
      }
    case 'get-translations':
      await getTranslations();
      return { translations, language: currentLanguage };
    default:
      return { error: 'Unknown action' };
  }
}

async function handleCapturePage(data: CaptureData): Promise<{ clip?: Clip }> {
  const tab = await getCurrentTab();
  if (!tab) return {};

  const clip: Clip = {
    id: uuidv4(),
    type: data.type,
    content: data.content,
    url: data.url || tab.url,
    title: data.title || tab.title,
    favicon: data.pageFavicon || await getFavicon(tab.url || ''),
    timestamp: Date.now(),
    spaceId: DEFAULT_SPACE_ID
  };

  if (data.imageUrl) {
    clip.imageUrl = data.imageUrl;
    clip.imageAlt = data.imageAlt;
  }

  await addClip(clip);
  await setBadge();
  return { clip };
}

async function captureText(text: string, tab: chrome.tabs.Tab): Promise<Clip> {
  const clip: Clip = {
    id: uuidv4(),
    type: 'text',
    content: text,
    url: tab.url,
    title: tab.title,
    favicon: await getFavicon(tab.url || ''),
    timestamp: Date.now(),
    spaceId: DEFAULT_SPACE_ID
  };
  await addClip(clip);
  await setBadge();
  return clip;
}

async function captureImage(imageUrl: string, alt: string, tab: chrome.tabs.Tab): Promise<Clip> {
  const clip: Clip = {
    id: uuidv4(),
    type: 'image',
    content: imageUrl,
    url: tab.url,
    title: tab.title,
    favicon: await getFavicon(tab.url || ''),
    imageUrl: imageUrl,
    imageAlt: alt,
    timestamp: Date.now(),
    spaceId: DEFAULT_SPACE_ID
  };
  await addClip(clip);
  await setBadge();
  return clip;
}

async function captureLink(linkUrl: string, linkText: string, tab: chrome.tabs.Tab): Promise<Clip> {
  const clip: Clip = {
    id: uuidv4(),
    type: 'link',
    content: linkText,
    url: linkUrl,
    title: tab.title,
    favicon: await getFavicon(tab.url || ''),
    timestamp: Date.now(),
    spaceId: DEFAULT_SPACE_ID
  };
  await addClip(clip);
  await setBadge();
  return clip;
}

async function capturePage(url: string, title: string, tab: chrome.tabs.Tab): Promise<Clip> {
  const clip: Clip = {
    id: uuidv4(),
    type: 'link',
    content: title,
    url: url,
    title: title,
    favicon: await getFavicon(url),
    timestamp: Date.now(),
    spaceId: DEFAULT_SPACE_ID
  };
  await addClip(clip);
  await setBadge();
  return clip;
}

async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getFavicon(url: string): Promise<string> {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return '';
  }
}
