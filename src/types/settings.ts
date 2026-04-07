export type Theme = 'dark' | 'light';

export type Language = 'en' | 'zh_CN' | 'de' | 'fr' | 'es' | 'ja' | 'ru';

export const SUPPORTED_LANGUAGES: { value: Language; label: string; nativeLabel: string; flag: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { value: 'zh_CN', label: 'Chinese', nativeLabel: '简体中文', flag: '🇨🇳' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺' },
];

export interface Settings {
  theme: Theme;
  language: Language;
  captureShortcut: string;
  openShortcut: string;
  hasCompletedOnboarding: boolean;
}

export const defaultSettings: Settings = {
  theme: 'dark',
  language: 'en',
  captureShortcut: 'CommandOrControl+Shift+E',
  openShortcut: 'CommandOrControl+Shift+S',
  hasCompletedOnboarding: false,
};
