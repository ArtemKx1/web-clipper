import { useState } from 'react';
import { saveSettings } from '../lib/settings';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    await saveSettings({ hasCompletedOnboarding: true });
    onComplete();
  };

  const openChromeShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm animate-scale-in">
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
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">Welcome to Web Clipper</h2>
              <p className="text-sm text-muted-foreground">Your universal second brain for the web</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Capture content</p>
                  <p className="text-xs text-muted-foreground">Save text, links, and images</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Organize in spaces</p>
                  <p className="text-xs text-muted-foreground">Group your clips by topics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Right-click or hotkeys</p>
                  <p className="text-xs text-muted-foreground">Save content from any page</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow active:scale-[0.98]"
            >
              Get Started
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
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center gradient-primary shadow-glow">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-primary-light opacity-30 blur-sm -z-10" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">Set up shortcuts</h2>
              <p className="text-sm text-muted-foreground">Configure keyboard shortcuts in Chrome</p>
            </div>

            <div className="bg-surface-3 rounded-xl p-4 mb-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">1</span>
                <p className="text-sm text-foreground pt-0.5">Click the button below to open Chrome shortcuts</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">2</span>
                <p className="text-sm text-foreground pt-0.5">Find <strong>Web Clipper</strong> in the list</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow-sm">3</span>
                <p className="text-sm text-foreground pt-0.5">Set your shortcut for "Capture selection"</p>
              </div>
            </div>

            <button
              onClick={openChromeShortcuts}
              className="w-full py-3.5 mb-3 rounded-xl font-semibold transition-all duration-300 bg-surface-3 text-foreground hover:bg-surface-4 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              Open Chrome Shortcuts
            </button>

            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow active:scale-[0.98]"
            >
              Got it, let's start!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
