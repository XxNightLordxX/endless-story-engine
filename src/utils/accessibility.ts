/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Generate ARIA labels for buttons with icons
 */
export const getAriaLabel = (action: string, context?: string): string => {
  const baseLabels: Record<string, string> = {
    'menu': 'Open menu',
    'close': 'Close',
    'settings': 'Settings',
    'search': 'Search',
    'filter': 'Filter',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'next': 'Next',
    'previous': 'Previous',
    'first': 'First',
    'last': 'Last',
    'play': 'Play',
    'pause': 'Pause',
    'stop': 'Stop',
    'skip': 'Skip',
    'volume': 'Volume',
    'mute': 'Mute',
    'fullscreen': 'Fullscreen',
    'theme': 'Toggle theme',
    'sidebar': 'Toggle sidebar',
    'notification': 'Notifications',
    'profile': 'Profile',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
    'bookmark': 'Bookmark',
    'share': 'Share',
    'export': 'Export',
    'download': 'Download',
    'upload': 'Upload',
    'help': 'Help',
    'info': 'Information',
    'warning': 'Warning',
    'error': 'Error',
    'success': 'Success',
  };

  const label = baseLabels[action] || action;
  return context ? `${label} - ${context}` : label;
};

/**
 * Generate unique IDs for accessibility purposes
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Focus management utilities
 */
export const focusManager = {
  /**
   * Trap focus within a container element
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      return () => {};
    }
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    firstElement.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  },
  
  /**
   * Restore focus to previously focused element
   */
  restoreFocus: (): void => {
    const previouslyFocused = document.querySelector('[data-previous-focus]') as HTMLElement;
    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused.removeAttribute('data-previous-focus');
    }
  },
  
  /**
   * Save current focus for later restoration
   */
  saveFocus: (): void => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.setAttribute('data-previous-focus', 'true');
    }
  },
};

/**
 * Keyboard navigation shortcuts
 */
export const keyboardShortcuts = {
  /**
   * Check if keyboard shortcut is triggered
   */
  matchesShortcut: (e: KeyboardEvent, shortcut: string): boolean => {
    const keys = shortcut.toLowerCase().split('+');
    const pressedKeys: string[] = [];
    
    if (e.ctrlKey) pressedKeys.push('ctrl');
    if (e.shiftKey) pressedKeys.push('shift');
    if (e.altKey) pressedKeys.push('alt');
    if (e.metaKey) pressedKeys.push('meta');
    pressedKeys.push(e.key.toLowerCase());
    
    return keys.every(key => pressedKeys.includes(key));
  },
  
  /**
   * Get keyboard shortcut display text
   */
  getShortcutDisplay: (shortcut: string): string => {
    const keyMap: Record<string, string> = {
      'ctrl': '⌘',
      'shift': '⇧',
      'alt': '⌥',
      'meta': '⌘',
      'arrowleft': '←',
      'arrowright': '→',
      'arrowup': '↑',
      'arrowdown': '↓',
      'escape': 'Esc',
      'enter': 'Return',
      ' ': 'Space',
    };
    
    return shortcut
      .toLowerCase()
      .split('+')
      .map(key => keyMap[key] || key.toUpperCase())
      .join('');
  },
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance: (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map((val, i) => {
      const normalized = parseInt(val) / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  
  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const luminance1 = colorContrast.getLuminance(color1);
    const luminance2 = colorContrast.getLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },
  
  /**
   * Check if color contrast meets WCAG AA standard
   */
  meetsWCAG_AA: (color1: string, color2: string): boolean => {
    return colorContrast.getContrastRatio(color1, color2) >= 4.5;
  },
  
  /**
   * Check if color contrast meets WCAG AAA standard
   */
  meetsWCAG_AAA: (color1: string, color2: string): boolean => {
    return colorContrast.getContrastRatio(color1, color2) >= 7;
  },
};

/**
 * Skip link utility for keyboard users
 */
export const createSkipLink = (targetId: string, text: string = 'Skip to main content'): HTMLElement => {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className = 'skip-link';
  link.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 100;
    transition: top 0.2s;
  `;
  
  link.addEventListener('focus', () => {
    link.style.top = '0';
  });
  
  link.addEventListener('blur', () => {
    link.style.top = '-40px';
  });
  
  return link;
};

/**
 * Screen reader only utility class
 */
export const screenReaderOnly = () => {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);
};