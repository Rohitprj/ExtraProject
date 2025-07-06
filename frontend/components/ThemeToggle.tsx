import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ThemeToggle({
  showLabel = false,
  size = 'medium',
}: ThemeToggleProps) {
  const { theme, themeMode, setThemeMode } = useTheme();

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const buttonSize = size === 'small' ? 32 : size === 'medium' ? 40 : 48;

  const themeOptions: {
    mode: ThemeMode;
    icon: React.ComponentType<any>;
    label: string;
  }[] = [
    { mode: 'light', icon: Sun, label: 'Light' },
    { mode: 'dark', icon: Moon, label: 'Dark' },
    // { mode: 'system', icon: Monitor, label: 'System' },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    button: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 2,
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
    },
    inactiveButton: {
      backgroundColor: 'transparent',
    },
    label: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.typography.caption.fontSize,
      fontFamily: theme.typography.caption.fontWeight,
      color: theme.colors.text,
    },
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.container}>
        {themeOptions.map(({ mode, icon: Icon, label }) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.button,
              themeMode === mode ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setThemeMode(mode)}
            accessibilityLabel={`Switch to ${label} theme`}
          >
            <Icon
              size={iconSize}
              color={
                themeMode === mode ? '#FFFFFF' : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        ))}
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {themeOptions.find((option) => option.mode === themeMode)?.label}
        </Text>
      )}
    </View>
  );
}
