interface CaptureResponse {
  selection: string | null;
  pageUrl: string;
  pageTitle: string;
  pageFavicon: string;
}

interface ImageInfo {
  srcUrl: string;
  alt: string;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'show-toast') {
    showToast(message.message || 'Saved');
    sendResponse({ success: true });
  }
  if (message.action === 'capture') {
    const selection = window.getSelection()?.toString().trim() || null;
    sendResponse({
      selection,
      pageUrl: window.location.href,
      pageTitle: document.title,
      pageFavicon: getFavicon()
    } as CaptureResponse);
  }
  if (message.action === 'get-selection') {
    const selection = window.getSelection()?.toString().trim() || null;
    sendResponse(selection);
  }
  if (message.action === 'get-image-info') {
    const target = message.target as EventTarget | null;
    if (target instanceof HTMLImageElement) {
      sendResponse({ srcUrl: target.src, alt: target.alt } as ImageInfo);
    } else {
      sendResponse(null);
    }
  }
  return true;
});

document.addEventListener('keydown', async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
    e.preventDefault();
    e.stopPropagation();
    
    if (!chrome.runtime?.id) return;
    
    const selection = window.getSelection()?.toString().trim() || null;
    
    const sendMessage = async (message: unknown): Promise<boolean> => {
      try {
        await chrome.runtime.sendMessage(message);
        return true;
      } catch {
        return false;
      }
    };
    
    if (selection) {
      const success = await sendMessage({
        action: 'add-clip',
        data: {
          id: crypto.randomUUID(),
          type: 'text',
          content: selection,
          url: window.location.href,
          title: document.title,
          timestamp: Date.now()
        }
      });
      showToast(success ? 'Saved to Web Clipper' : 'Failed to save');
    } else {
      const success = await sendMessage({
        action: 'capture-page',
        data: {
          type: 'link',
          content: document.title,
          url: window.location.href,
          pageFavicon: getFavicon()
        }
      });
      showToast(success ? 'Saved to Web Clipper' : 'Failed to save');
    }
  }
});

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: rgba(30, 30, 30, 0.95);
    color: white;
    border-radius: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 999999;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  if (!document.querySelector('#clipper-toast-styles')) {
    style.id = 'clipper-toast-styles';
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function getFavicon(): string {
  const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
  if (link?.href) return link.href;
  
  try {
    const url = new URL(window.location.href);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
  } catch {
    return '';
  }
}

document.addEventListener('contextmenu', (e) => {
  if (!chrome.runtime?.id) return;
  
  const target = e.target as HTMLElement;
  
  if (target.tagName === 'IMG') {
    chrome.storage.session.set({
      lastImageContext: {
        srcUrl: (target as HTMLImageElement).src,
        alt: (target as HTMLImageElement).alt
      }
    });
  }
});
