import { useState } from 'react';
import { saveSettings } from '../lib/settings';
import { SUPPORTED_LANGUAGES, type Language } from '../types/settings';
import { getBrowserLanguage, useTranslation } from '../hooks/useTranslation';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { setLanguage } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getBrowserLanguage());

  const handleLanguageConfirm = async () => {
    await saveSettings({ language: selectedLanguage });
    await setLanguage(selectedLanguage);
    setStep(1);
  };

  const handleComplete = async () => {
    await saveSettings({ hasCompletedOnboarding: true });
    onComplete();
  };

  const openChromeShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  };

  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        selectLanguage: 'Select your language',
        selectLanguageDesc: 'Choose your preferred language for the app interface',
        continue: 'Continue',
        welcomeTitle: 'Welcome to Web Clipper',
        welcomeSubtitle: 'Your universal second brain for the web',
        feature1Title: 'Capture content',
        feature1Desc: 'Save text, links, and images',
        feature2Title: 'Organize in spaces',
        feature2Desc: 'Group your clips by topics',
        feature3Title: 'Right-click or hotkeys',
        feature3Desc: 'Save content from any page',
        getStarted: 'Get Started',
        shortcutsTitle: 'Set up shortcuts',
        shortcutsSubtitle: 'Configure keyboard shortcuts in Chrome',
        step1: 'Click the button below to open Chrome shortcuts',
        step2: 'Find Web Clipper in the list',
        step3: 'Set your shortcut for "Capture selection"',
        openShortcuts: 'Open Chrome Shortcuts',
        gotIt: "Got it, let's start!",
      },
      zh_CN: {
        selectLanguage: '选择您的语言',
        selectLanguageDesc: '选择您偏好的应用界面语言',
        continue: '继续',
        welcomeTitle: '欢迎使用 Web Clipper',
        welcomeSubtitle: '您的通用网络第二大脑',
        feature1Title: '捕获内容',
        feature1Desc: '保存文本、链接和图片',
        feature2Title: '空间整理',
        feature2Desc: '按主题分组整理',
        feature3Title: '右键或快捷键',
        feature3Desc: '从任意页面保存内容',
        getStarted: '开始使用',
        shortcutsTitle: '设置快捷键',
        shortcutsSubtitle: '在 Chrome 中配置键盘快捷键',
        step1: '点击下方按钮打开 Chrome 快捷键设置',
        step2: '在列表中找到 Web Clipper',
        step3: "为 'Capture selection' 设置快捷键",
        openShortcuts: '打开 Chrome 快捷键',
        gotIt: '知道了，开始使用！',
      },
      de: {
        selectLanguage: 'Sprache auswählen',
        selectLanguageDesc: 'Wählen Sie Ihre bevorzugte Sprache für die App-Oberfläche',
        continue: 'Weiter',
        welcomeTitle: 'Willkommen bei Web Clipper',
        welcomeSubtitle: 'Ihr universeller zweiter Hirn für das Web',
        feature1Title: 'Inhalte erfassen',
        feature1Desc: 'Text, Links und Bilder speichern',
        feature2Title: 'In Spaces organisieren',
        feature2Desc: 'Clips nach Themen gruppieren',
        feature3Title: 'Rechtsklick oder Hotkeys',
        feature3Desc: 'Inhalte von jeder Seite speichern',
        getStarted: 'Loslegen',
        shortcutsTitle: 'Shortcuts einrichten',
        shortcutsSubtitle: 'Tastenkürzel in Chrome konfigurieren',
        step1: 'Klicken Sie auf die Schaltfläche unten, um Chrome-Shortcuts zu öffnen',
        step2: 'Finden Sie Web Clipper in der Liste',
        step3: "Legen Sie Ihren Shortcut für 'Capture selection' fest",
        openShortcuts: 'Chrome-Shortcuts öffnen',
        gotIt: 'Verstanden, los geht\'s!',
      },
      fr: {
        selectLanguage: 'Sélectionnez votre langue',
        selectLanguageDesc: 'Choisissez votre langue préférée pour l\'interface de l\'application',
        continue: 'Continuer',
        welcomeTitle: 'Bienvenue sur Web Clipper',
        welcomeSubtitle: 'Votre cerveau universel pour le web',
        feature1Title: 'Capturer du contenu',
        feature1Desc: 'Enregistrer texte, liens et images',
        feature2Title: 'Organiser par espaces',
        feature2Desc: 'Regrouper vos clips par thèmes',
        feature3Title: 'Clic droit ou raccourcis',
        feature3Desc: 'Enregistrer du contenu depuis n\'importe quelle page',
        getStarted: 'Commencer',
        shortcutsTitle: 'Configurer les raccourcis',
        shortcutsSubtitle: 'Définissez les raccourcis clavier dans Chrome',
        step1: 'Cliquez sur le bouton ci-dessous pour ouvrir les raccourcis Chrome',
        step2: 'Trouvez Web Clipper dans la liste',
        step3: "Définissez votre raccourci pour 'Capture selection'",
        openShortcuts: 'Ouvrir les raccourcis Chrome',
        gotIt: 'Compris, c\'est parti !',
      },
      es: {
        selectLanguage: 'Selecciona tu idioma',
        selectLanguageDesc: 'Elige tu idioma preferido para la interfaz de la aplicación',
        continue: 'Continuar',
        welcomeTitle: 'Bienvenido a Web Clipper',
        welcomeSubtitle: 'Tu cerebro universal para la web',
        feature1Title: 'Capturar contenido',
        feature1Desc: 'Guardar texto, enlaces e imágenes',
        feature2Title: 'Organizar en espacios',
        feature2Desc: 'Agrupar clips por temas',
        feature3Title: 'Clic derecho o atajos',
        feature3Desc: 'Guardar contenido desde cualquier página',
        getStarted: 'Comenzar',
        shortcutsTitle: 'Configurar atajos',
        shortcutsSubtitle: 'Define los atajos de teclado en Chrome',
        step1: 'Haz clic en el botón de abajo para abrir los atajos de Chrome',
        step2: 'Encuentra Web Clipper en la lista',
        step3: "Define tu atajo para 'Capture selection'",
        openShortcuts: 'Abrir atajos de Chrome',
        gotIt: '¡Entendido, empecemos!',
      },
      ja: {
        selectLanguage: '言語を選択',
        selectLanguageDesc: 'アプリのインターフェースに使用する言語を選んでください',
        continue: '続ける',
        welcomeTitle: 'Web Clipperへようこそ',
        welcomeSubtitle: 'あなたのための万能ウェブセカンドブレイン',
        feature1Title: 'コンテンツをキャプチャ',
        feature1Desc: 'テキスト、リンク、画像を一括保存',
        feature2Title: 'スペースで整理',
        feature2Desc: 'トピック別にクリップをグループ化',
        feature3Title: '右クリックまたはホットキー',
        feature3Desc: '任意のページからコンテンツを保存',
        getStarted: '始める',
        shortcutsTitle: 'ショートカットの設定',
        shortcutsSubtitle: 'Chromeでキーボードショートカットを設定',
        step1: '下のボタンをクリックしてChromeショートカットを開く',
        step2: 'リストからWeb Clipperを見つける',
        step3: "「Capture selection」のショートカットを設定",
        openShortcuts: 'Chromeショートカットを開く',
        gotIt: '了解、始めましょう！',
      },
      ru: {
        selectLanguage: 'Выберите язык',
        selectLanguageDesc: 'Выберите предпочтительный язык интерфейса приложения',
        continue: 'Продолжить',
        welcomeTitle: 'Добро пожаловать в Web Clipper',
        welcomeSubtitle: 'Ваш универсальный второй мозг для веба',
        feature1Title: 'Сохраняйте контент',
        feature1Desc: 'Текст, ссылки и изображения',
        feature2Title: 'Организуйте в пространства',
        feature2Desc: 'Группируйте закладки по темам',
        feature3Title: 'Правый клик или горячие клавиши',
        feature3Desc: 'Сохраняйте контент с любой страницы',
        getStarted: 'Начать',
        shortcutsTitle: 'Настройка горячих клавиш',
        shortcutsSubtitle: 'Настройте горячие клавиши в Chrome',
        step1: 'Нажмите кнопку ниже, чтобы открыть настройки горячих клавиш Chrome',
        step2: 'Найдите Web Clipper в списке',
        step3: "Установите горячие клавиши для 'Capture selection'",
        openShortcuts: 'Открыть настройки Chrome',
        gotIt: 'Понятно, поехали!',
      },
    };
    return translations[selectedLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm animate-scale-in">
        {step === 0 && (
          <div className="bg-surface-2 rounded-2xl p-6 shadow-xl border border-border">
            <div className="relative -mx-6 -mt-6 mb-6 h-2 rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent" />
            </div>
            
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img 
                  src="/icons/icon128.png" 
                  alt="Web Clipper" 
                  className="w-20 h-20 rounded-2xl shadow-glow"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">{t('selectLanguage')}</h2>
              <p className="text-sm text-muted-foreground">{t('selectLanguageDesc')}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 max-h-[280px] overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                    selectedLanguage === lang.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent bg-surface-3 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="truncate">{lang.nativeLabel}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleLanguageConfirm}
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow active:scale-[0.98]"
            >
              {t('continue')}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-surface-2 rounded-2xl p-6 shadow-xl border border-border">
            <div className="relative -mx-6 -mt-6 mb-6 h-2 rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent" />
            </div>
            
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img 
                  src="/icons/icon128.png" 
                  alt="Web Clipper" 
                  className="w-20 h-20 rounded-2xl shadow-glow"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">{t('welcomeTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('welcomeSubtitle')}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('feature1Title')}</p>
                  <p className="text-xs text-muted-foreground">{t('feature1Desc')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('feature2Title')}</p>
                  <p className="text-xs text-muted-foreground">{t('feature2Desc')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('feature3Title')}</p>
                  <p className="text-xs text-muted-foreground">{t('feature3Desc')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow active:scale-[0.98]"
            >
              {t('getStarted')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-surface-2 rounded-2xl p-6 shadow-xl border border-border">
            <div className="relative -mx-6 -mt-6 mb-6 h-2 rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent" />
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-1 mb-4">
                <div className="w-12 h-10 rounded-lg bg-surface-4 border-2 border-surface-5 flex items-center justify-center shadow-key">
                  <span className="text-xs font-bold text-foreground">⇧</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary border-2 border-primary-light flex items-center justify-center shadow-key">
                  <span className="text-sm font-bold text-primary-foreground">E</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">{t('shortcutsTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('shortcutsSubtitle')}</p>
            </div>

            <div className="bg-surface-3 rounded-xl p-4 mb-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">1</span>
                <p className="text-sm text-foreground pt-0.5">{t('step1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">2</span>
                <p className="text-sm text-foreground pt-0.5">{t('step2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">3</span>
                <p className="text-sm text-foreground pt-0.5">{t('step3')}</p>
              </div>
            </div>

            <button
              onClick={openChromeShortcuts}
              className="w-full py-3.5 mb-3 rounded-xl font-semibold transition-all duration-300 bg-surface-3 text-foreground hover:bg-surface-4 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              {t('openShortcuts')}
            </button>

            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow active:scale-[0.98]"
            >
              {t('gotIt')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
