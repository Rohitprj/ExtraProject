import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'card';
  children: React.ReactNode;
}

export default function ThemedView({ 
  variant = 'default', 
  style, 
  children, 
  ...props 
}: ThemedViewProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return theme.colors.surface;
      case 'card':
        return theme.colors.card;
      default:
        return theme.colors.background;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: getBackgroundColor(),
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}