import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import en from '../locales/en.json';
import ar from '../locales/ar.json';
import he from '../locales/he.json';

type Language = 'en' | 'ar' | 'he';
type Mode = 'light' | 'dark';

type Translations = { [key: string]: string | Translations };

type SettingsContextType = {
  lang: Language;
  mode: Mode;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  toggleMode: () => void;
};

const dictionaries: Record<Language, Translations> = {
  en, ar, he
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('he');
  const [mode, setMode] = useState<Mode>(() => {
    // Load theme from localStorage on initial load; default to dark
    const saved = localStorage.getItem('theme-mode');
    return (saved as Mode) || 'dark';
  });

  // Keep layout stable (no LTR/RTL flipping) as requested
  const dir: 'ltr' | 'rtl' = 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
  }, [dir]);

  const theme = useMemo(() => createTheme({
    direction: dir,
    palette: { 
      mode,
      ...(mode === 'dark' && {
        background: {
          default: '#0a0a0f',
          paper: '#1a1a2e',
        },
        primary: {
          main: '#00d4aa',
          light: '#4de6c7',
          dark: '#00b894',
        },
        secondary: {
          main: '#7c4dff',
          light: '#b47cff',
          dark: '#3f1dcb',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#9ca3af',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
        action: {
          hover: 'rgba(255, 255, 255, 0.04)',
          selected: 'rgba(255, 255, 255, 0.08)',
          disabled: 'rgba(255, 255, 255, 0.26)',
          disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
        grey: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      }),
      ...(mode === 'light' && {
        background: {
          default: '#ffffff',
          paper: '#ffffff',
        },
        primary: {
          main: '#6c63ff',
          light: '#9c88ff',
          dark: '#5a52f0',
        },
        secondary: {
          main: '#00d4aa',
          light: '#4de6c7',
          dark: '#00b894',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#6b7280',
        },
        divider: 'rgba(0, 0, 0, 0.08)',
        action: {
          hover: 'rgba(0, 0, 0, 0.04)',
          selected: 'rgba(0, 0, 0, 0.08)',
        },
      }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
      h1: { 
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em'
      },
      h2: { 
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
        letterSpacing: '-0.02em'
      },
      h3: { 
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.015em'
      },
      h4: { 
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '-0.01em'
      },
      h5: { 
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        letterSpacing: '-0.005em'
      },
      h6: { 
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.01em'
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            height: '100%',
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
          },
          '#root': {
            height: '100%',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)' 
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)'
              : 'none',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)'
              : 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)'
              : 'none',
            backdropFilter: 'blur(20px)',
          },
        },
      },
    },
  }), [dir, mode]);

  const t = (key: string): string => {
    const dict = dictionaries[lang] || {};
    const result = key
      .split('.')
      .reduce<unknown>((obj, part) => (obj && (obj as Record<string, unknown>)[part] !== undefined ? (obj as Record<string, unknown>)[part] : undefined), dict as unknown);
    return typeof result === 'string' ? result : key;
  };

  const setLanguage = (l: Language) => setLang(l);
  const toggleMode = () => {
    setMode((m) => {
      const newMode = m === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  const value: SettingsContextType = { lang, mode, dir, t, setLanguage, toggleMode };

  return (
    <SettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}


