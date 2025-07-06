import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'error' | 'success' | 'warning';
  children: React.ReactNode;
}

export default function ThemedText({ 
  variant = 'body', 
  color = 'text',
  style, 
  children, 
  ...props 
}: ThemedTextProps) {
  const { theme } = useTheme();

  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'textSecondary':
        return theme.colors.textSecondary;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.text;
    }
  };

  const getTypographyStyle = () => {
    return theme.typography[variant];
  };

  const styles = StyleSheet.create({
    text: {
      color: getTextColor(),
      ...getTypographyStyle(),
    },
  });

  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}