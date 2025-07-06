import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    accent: string;
    shadow: string;
    overlay: string;
    disabled: string;
    placeholder: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; fontWeight: string; lineHeight: number };
    caption: { fontSize: number; fontWeight: string; lineHeight: number };
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#2563EB',
    secondary: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    notification: '#EF4444',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#06B6D4',
    accent: '#8B5CF6',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    disabled: '#9CA3AF',
    placeholder: '#9CA3AF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'Inter-Bold', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: 'Inter-Bold', lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: 'Inter-SemiBold', lineHeight: 28 },
    body: { fontSize: 16, fontWeight: 'Inter-Regular', lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: 'Inter-Regular', lineHeight: 16 },
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    notification: '#F87171',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#22D3EE',
    accent: '#A78BFA',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    disabled: '#6B7280',
    placeholder: '#9CA3AF',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}