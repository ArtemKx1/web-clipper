import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { Language } from '../types/settings';
import en from '../locales/en.json';
import zh_CN from '../locales/zh_CN.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import ja from '../locales/ja.json';
import ru from '../locales/ru.json';
import { getSettings } from '../lib/settings';

type TranslationKey = keyof typeof en;

const translations: Record<Language, Record<string, string>> = {
  en,
  zh_CN,
  de,
  fr,
  es,
  ja,
  ru,
};

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setLanguageState(settings.language);
      setIsLoaded(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    const { saveSettings } = await import('../lib/settings');
    await saveSettings({ language: lang });
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  }, [language]);

  if (!isLoaded) {
    return null;
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export function getBrowserLanguage(): Language {
  const browserLang = navigator.language || 'en';
  
  if (browserLang.startsWith('zh')) return 'zh_CN';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ru')) return 'ru';
  
  return 'en';
}

export { type TranslationKey };
