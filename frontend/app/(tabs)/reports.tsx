import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/contexts/ThemeContext';
import { FileText, TrendingUp, Download, Calendar, Users, Activity, ChartBar as BarChart3, ChartPie as PieChart, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { theme, isDark } = useTheme();

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/reports?period=${selectedPeriod}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
  });

  const ReportCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string; 
    change: string; 
    icon: any; 
    color: string; 
  }) => (
    <View style={[styles.reportCard, { 
      backgroundColor: theme.colors.card,
      shadowColor: theme.colors.shadow,
    }]}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: color + '20' }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.changeIndicator}>
          <TrendingUp size={12} color="#10B981" />
          <Text style={styles.changeText}>{change}</Text>
        </View>
      </View>
      <Text style={[styles.reportValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.reportTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
    </View>
  );

  const ChartCard = ({ 
    title, 
    children, 
    onExport 
  }: { 
    title: string; 
    children: React.ReactNode; 
    onExport?: () => void; 
  }) => (
    <View style={[styles.chartCard, { 
      backgroundColor: theme.colors.card,
      shadowColor: theme.colors.shadow,
    }]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>{title}</Text>
        {onExport && (
          <TouchableOpacity style={[styles.exportButton, { backgroundColor: theme.colors.surface }]} onPress={onExport}>
            <Download size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 24,
      paddingHorizontal: 24,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    periodSelector: {
      marginTop: 16,
    },
    periodButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginRight: 12,
    },
    activePeriodButton: {
      backgroundColor: '#FFFFFF',
    },
    periodButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    activePeriodButtonText: {
      color: '#F59E0B',
    },
    content: {
      flex: 1,
    },
    metricsSection: {
      padding: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -8,
    },
    reportCard: {
      width: (width - 64) / 2,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 8,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    reportIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: '#10B981',
      marginLeft: 4,
    },
    reportValue: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      marginBottom: 4,
    },
    reportTitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    chartCard: {
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 24,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
    },
    exportButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    demographicsChart: {
      marginBottom: 16,
    },
    demographicItem: {
      marginBottom: 12,
    },
    demographicBar: {
      height: 8,
      borderRadius: 4,
      marginBottom: 4,
    },
    demographicLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    trendsChart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 120,
      marginBottom: 16,
    },
    trendItem: {
      alignItems: 'center',
      flex: 1,
    },
    trendMonth: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    trendBars: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: 8,
    },
    trendBar: {
      width: 6,
      borderRadius: 3,
      marginHorizontal: 1,
    },
    scheduledBar: {
      backgroundColor: '#2563EB',
    },
    completedBar: {
      backgroundColor: '#10B981',
    },
    cancelledBar: {
      backgroundColor: '#EF4444',
    },
    trendTotal: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 12,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    conditionsChart: {
      marginBottom: 16,
    },
    conditionItem: {
      marginBottom: 16,
    },
    conditionInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    conditionName: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    conditionCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    conditionBarContainer: {
      backgroundColor: theme.colors.surface,
      height: 6,
      borderRadius: 3,
    },
    conditionBar: {
      height: 6,
      borderRadius: 3,
    },
    section: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    exportSection: {
      paddingBottom: 24,
    },
    exportActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    exportActionButton: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    exportActionText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#D97706', '#0891B2'] : ['#F59E0B', '#06B6D4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Reports & Analytics</Text>
            <Text style={styles.headerSubtitle}>Healthcare insights and trends</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <ReportCard
              title="Total Patients"
              value={reportData?.totalPatients || '0'}
              change="+12%"
              icon={Users}
              color="#2563EB"
            />
            <ReportCard
              title="Appointments"
              value={reportData?.totalAppointments || '0'}
              change="+8%"
              icon={Calendar}
              color="#10B981"
            />
            <ReportCard
              title="Revenue"
              value={reportData?.revenue || '$0'}
              change="+15%"
              icon={TrendingUp}
              color="#F59E0B"
            />
            <ReportCard
              title="Satisfaction"
              value={reportData?.satisfaction || '0%'}
              change="+3%"
              icon={Activity}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Patient Demographics */}
        <ChartCard 
          title="Patient Demographics" 
          onExport={() => console.log('Export demographics')}
        >
          <View style={styles.demographicsChart}>
            <View style={styles.demographicItem}>
              <View style={[styles.demographicBar, { width: '60%', backgroundColor: '#2563EB' }]} />
              <Text style={styles.demographicLabel}>Female (60%)</Text>
            </View>
            <View style={styles.demographicItem}>
              <View style={[styles.demographicBar, { width: '40%', backgroundColor: '#10B981' }]} />
              <Text style={styles.demographicLabel}>Male (40%)</Text>
            </View>
            <View style={styles.demographicItem}>
              <View style={[styles.demographicBar, { width: '25%', backgroundColor: '#F59E0B' }]} />
              <Text style={styles.demographicLabel}>0-18 years (25%)</Text>
            </View>
            <View style={styles.demographicItem}>
              <View style={[styles.demographicBar, { width: '45%', backgroundColor: '#EF4444' }]} />
              <Text style={styles.demographicLabel}>19-65 years (45%)</Text>
            </View>
            <View style={styles.demographicItem}>
              <View style={[styles.demographicBar, { width: '30%', backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.demographicLabel}>65+ years (30%)</Text>
            </View>
          </View>
        </ChartCard>

        {/* Appointment Trends */}
        <ChartCard 
          title="Appointment Trends" 
          onExport={() => console.log('Export trends')}
        >
          <View style={styles.trendsChart}>
            {reportData?.appointmentTrends?.map((trend: any, index: number) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendMonth}>{trend.month}</Text>
                <View style={styles.trendBars}>
                  <View style={[styles.trendBar, styles.scheduledBar, { height: trend.scheduled * 2 }]} />
                  <View style={[styles.trendBar, styles.completedBar, { height: trend.completed * 2 }]} />
                  <View style={[styles.trendBar, styles.cancelledBar, { height: trend.cancelled * 2 }]} />
                </View>
                <Text style={styles.trendTotal}>{trend.total}</Text>
              </View>
            )) || Array.from({ length: 6 }, (_, i) => (
              <View key={i} style={styles.trendItem}>
                <Text style={styles.trendMonth}>M{i + 1}</Text>
                <View style={styles.trendBars}>
                  <View style={[styles.trendBar, styles.scheduledBar, { height: Math.random() * 60 + 20 }]} />
                  <View style={[styles.trendBar, styles.completedBar, { height: Math.random() * 60 + 20 }]} />
                  <View style={[styles.trendBar, styles.cancelledBar, { height: Math.random() * 20 + 5 }]} />
                </View>
                <Text style={styles.trendTotal}>{Math.floor(Math.random() * 50 + 20)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2563EB' }]} />
              <Text style={styles.legendText}>Scheduled</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Cancelled</Text>
            </View>
          </View>
        </ChartCard>

        {/* Top Conditions */}
        <ChartCard 
          title="Most Common Conditions" 
          onExport={() => console.log('Export conditions')}
        >
          <View style={styles.conditionsChart}>
            {[
              { condition: 'Hypertension', count: 45, color: '#EF4444' },
              { condition: 'Diabetes', count: 38, color: '#F59E0B' },
              { condition: 'Asthma', count: 29, color: '#10B981' },
              { condition: 'Arthritis', count: 22, color: '#2563EB' },
              { condition: 'Depression', count: 18, color: '#8B5CF6' },
            ].map((item, index) => (
              <View key={index} style={styles.conditionItem}>
                <View style={styles.conditionInfo}>
                  <Text style={styles.conditionName}>{item.condition}</Text>
                  <Text style={styles.conditionCount}>{item.count} patients</Text>
                </View>
                <View style={styles.conditionBarContainer}>
                  <View 
                    style={[
                      styles.conditionBar, 
                      { width: `${(item.count / 45) * 100}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </ChartCard>

        {/* Export Actions */}
        <View style={[styles.section, styles.exportSection]}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          <View style={styles.exportActions}>
            <TouchableOpacity style={styles.exportActionButton}>
              <FileText size={20} color={theme.colors.primary} />
              <Text style={styles.exportActionText}>Patient Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportActionButton}>
              <BarChart3 size={20} color={theme.colors.success} />
              <Text style={styles.exportActionText}>Analytics Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportActionButton}>
              <PieChart size={20} color={theme.colors.warning} />
              <Text style={styles.exportActionText}>Demographics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}