import { useState, useEffect } from 'react';
import type { Settings, Theme, Language } from '../types/settings';
import { SUPPORTED_LANGUAGES } from '../types/settings';
import { getSettings, saveSettings, formatChromeShortcut, getCaptureShortcut } from '../lib/settings';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsProps {
  onClose: () => void;
}

const themes: { value: Theme; labelKey: string; icon: JSX.Element }[] = [
  {
    value: 'dark',
    labelKey: 'settings.themeDark',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    value: 'light',
    labelKey: 'settings.themeLight',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
];

export default function Settings({ onClose }: SettingsProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [chromeShortcut, setChromeShortcut] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
    getCaptureShortcut().then(setChromeShortcut);
  }, []);

  const handleThemeChange = async (theme: Theme) => {
    if (!settings) return;
    const updated = { ...settings, theme };
    setSettings(updated);
    await saveSettings({ theme });
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  };

  const handleLanguageChange = async (language: Language) => {
    if (!settings) return;
    const updated = { ...settings, language };
    setSettings(updated);
    await saveSettings({ language });
    window.location.reload();
  };

  if (!settings) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-12">
      <div 
        className="absolute inset-0 overlay"
        onClick={onClose} 
      />
      
      <div className="relative z-[10000] w-full max-w-sm mx-4 rounded-2xl overflow-hidden animate-scale-in bg-surface-3 shadow-xl border border-border">
        <div className="relative h-1 bg-gradient-to-r from-primary via-primary-light to-primary">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all duration-200 bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-4 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-muted-foreground">{t('settings.theme')}</h3>
            <div className="flex gap-2">
              {themes.map((themeItem) => (
                <button
                  key={themeItem.value}
                  onClick={() => handleThemeChange(themeItem.value)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2"
                  style={{
                    backgroundColor: settings.theme === themeItem.value ? 'var(--primary)' : 'var(--surface-2)',
                    borderColor: settings.theme === themeItem.value ? 'var(--primary)' : 'transparent',
                    color: settings.theme === themeItem.value ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    boxShadow: settings.theme === themeItem.value ? 'var(--shadow-glow-sm)' : 'none',
                  }}
                >
                  {themeItem.icon}
                  <span>{t(themeItem.labelKey)}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-muted-foreground">{t('settings.language')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                    settings.language === lang.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent bg-surface-2 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="truncate">{lang.nativeLabel}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-muted-foreground">
              {t('settings.shortcut')}
            </h3>
            
            {chromeShortcut ? (
              <div className="px-4 py-3 rounded-xl bg-surface-2 border border-primary/30 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('settings.shortcutCurrent')}</span>
                <span className="font-mono font-semibold text-foreground text-sm">
                  {formatChromeShortcut(chromeShortcut)}
                </span>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-xl bg-surface-2 border border-yellow-500/30 flex items-center gap-3">
                <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-xs text-muted-foreground">
                  {t('settings.shortcutNotSet')}
                </span>
              </div>
            )}
            
            <button
              onClick={() => chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
              className="w-full mt-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-4 flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              {t('settings.shortcutConfigure')}
            </button>
          </section>

          <section className="pt-4 border-t border-border">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center gradient-primary shadow-glow">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t('settings.version', { version: '1.0.5' })}</p>
                <p className="text-xs text-muted-foreground">{t('settings.footer')}</p>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-4">
              {t('settings.footerCredit', { author: 'Artem K.' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
