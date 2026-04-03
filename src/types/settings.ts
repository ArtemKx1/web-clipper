export type Theme = 'dark' | 'light';

export interface Settings {
  theme: Theme;
  captureShortcut: string;
  openShortcut: string;
  hasCompletedOnboarding: boolean;
}

export const defaultSettings: Settings = {
  theme: 'dark',
  captureShortcut: 'CommandOrControl+Shift+E',
  openShortcut: 'CommandOrControl+Shift+S',
  hasCompletedOnboarding: false,
};
