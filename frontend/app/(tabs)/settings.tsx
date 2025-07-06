import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, LogOut, ChevronRight, Moon, Globe, Download, CircleHelp as HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [dataSync, setDataSync] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <ThemedText variant="caption" color="textSecondary" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </ThemedText>
      <ThemedView variant="card" style={styles.sectionContent}>
        {children}
      </ThemedView>
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showChevron = true 
  }: { 
    icon: any; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void; 
    rightComponent?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.settingText}>
          <ThemedText variant="body">{title}</ThemedText>
          {subtitle && (
            <ThemedText variant="caption" color="textSecondary" style={styles.settingSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && onPress && (
          <ChevronRight size={16} color={theme.colors.disabled} style={{ marginLeft: 8 }} />
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontFamily: theme.typography.h2.fontWeight,
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: theme.typography.body.fontWeight,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    profileAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInitials: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      letterSpacing: 0.5,
    },
    sectionContent: {
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    settingText: {
      flex: 1,
    },
    settingSubtitle: {
      marginTop: 2,
    },
    settingRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(248, 113, 113, 0.3)' : '#FEE2E2',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    logoutButtonText: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    versionText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    versionNumber: {
      fontSize: 12,
      fontFamily: theme.typography.caption.fontWeight,
      color: theme.colors.disabled,
      marginTop: 4,
    },
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#5B21B6', '#0891B2'] : ['#6366F1', '#06B6D4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your preferences</Text>
          </View>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {user?.firstName[0]}{user?.lastName[0]}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SettingSection title="Profile">
          <SettingItem
            icon={User}
            title={`${user?.firstName} ${user?.lastName}`}
            subtitle={user?.email}
            onPress={() => console.log('Edit profile')}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance">
          <SettingItem
            icon={Palette}
            title="Theme"
            subtitle="Choose your preferred theme"
            rightComponent={<ThemeToggle size="small" />}
            showChevron={false}
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Push notifications and alerts"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={notifications ? '#FFFFFF' : theme.colors.disabled}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English (US)"
            onPress={() => console.log('Change language')}
          />
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection title="Data & Privacy">
          <SettingItem
            icon={Database}
            title="Data Synchronization"
            subtitle="Sync data across devices"
            rightComponent={
              <Switch
                value={dataSync}
                onValueChange={setDataSync}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={dataSync ? '#FFFFFF' : theme.colors.disabled}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={Shield}
            title="Privacy Settings"
            subtitle="Manage data privacy"
            onPress={() => console.log('Privacy settings')}
          />
          <SettingItem
            icon={Download}
            title="Export Data"
            subtitle="Download your data"
            onPress={() => console.log('Export data')}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => console.log('Help')}
          />
          <SettingItem
            icon={SettingsIcon}
            title="About"
            subtitle="App version and information"
            onPress={() => console.log('About')}
          />
        </SettingSection>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <ThemedText variant="body" color="textSecondary">Patient Dashboard Pro</ThemedText>
          <ThemedText variant="caption" color="textSecondary" style={styles.versionNumber}>
            Version 1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}