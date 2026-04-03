import type { Settings, Theme } from '../types/settings';
import { defaultSettings } from '../types/settings';

const SETTINGS_KEY = 'web-clipper-settings';

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return result[SETTINGS_KEY] || { ...defaultSettings };
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await chrome.storage.local.set({
    [SETTINGS_KEY]: { ...current, ...settings }
  });
}

export async function setTheme(theme: Theme): Promise<void> {
  await saveSettings({ theme });
}

export async function setCaptureShortcut(shortcut: string): Promise<void> {
  await saveSettings({ captureShortcut: shortcut });
}

export function formatShortcut(shortcut: string): string {
  return shortcut
    .replace('CommandOrControl', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
    .replace('Command', '⌘')
    .replace('Control', 'Ctrl')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('+', ' + ');
}

export function formatChromeShortcut(shortcut: string | undefined): string {
  if (!shortcut) return '';
  return shortcut
    .replace('Command', '⌘')
    .replace('Control', 'Ctrl')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('+', ' + ');
}

export async function getCaptureShortcut(): Promise<string | null> {
  try {
    const result = await chrome.runtime.sendMessage({ action: 'get-commands' });
    return result?.shortcut || null;
  } catch {
    return null;
  }
}

export function getPlatformKey(): string {
  return navigator.platform.includes('Mac') ? 'Mac' : 'Default';
}
