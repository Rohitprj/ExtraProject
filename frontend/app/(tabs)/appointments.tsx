import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, Clock, Search, Plus, User, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Calendar as CalendarIcon } from 'lucide-react-native';
import { Appointment } from '@/types';

export default function AppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const { theme, isDark } = useTheme();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async (): Promise<Appointment[]> => {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate === 'all' || appointment.date === selectedDate;
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'completed': return '#06B6D4';
      case 'cancelled': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const StatusIcon = getStatusIcon(appointment.status);
    const statusColor = getStatusColor(appointment.status);

    return (
      <View style={[styles.appointmentCard, { 
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.shadow,
      }]}>
        <View style={styles.appointmentHeader}>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.text }]}>{appointment.time}</Text>
            <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>{appointment.duration} min</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <StatusIcon size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {appointment.status}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentContent}>
          <View style={styles.patientInfo}>
            <View style={[styles.patientAvatar, { backgroundColor: theme.colors.primary }]}>
              <User size={16} color="#FFFFFF" />
            </View>
            <View style={styles.patientDetails}>
              <Text style={[styles.patientName, { color: theme.colors.text }]}>{appointment.patientName}</Text>
              <Text style={[styles.appointmentType, { color: theme.colors.textSecondary }]}>{appointment.type}</Text>
            </View>
          </View>

          <View style={styles.doctorInfo}>
            <Text style={[styles.doctorLabel, { color: theme.colors.textSecondary }]}>Doctor:</Text>
            <Text style={[styles.doctorName, { color: theme.colors.text }]}>{appointment.doctorName}</Text>
          </View>

          {appointment.notes && (
            <View style={[styles.notesContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.notesLabel, { color: theme.colors.text }]}>Notes:</Text>
              <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>{appointment.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.appointmentActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.actionButtonText, styles.primaryActionText]}>
              {appointment.status === 'scheduled' ? 'Confirm' : 'View'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filtersContainer: {
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: '#111827',
      paddingVertical: 12,
    },
    statusFilters: {
      marginTop: 16,
    },
    statusFilter: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginRight: 12,
    },
    activeStatusFilter: {
      backgroundColor: '#FFFFFF',
    },
    statusFilterText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    activeStatusFilterText: {
      color: '#8B5CF6',
    },
    dateSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dateSelectorText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginLeft: 12,
    },
    changeDateButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    changeDateText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 48,
    },
    appointmentsList: {
      padding: 24,
    },
    appointmentCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    timeContainer: {
      alignItems: 'flex-start',
    },
    timeText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
    },
    durationText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginTop: 2,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 4,
      textTransform: 'capitalize',
    },
    appointmentContent: {
      marginBottom: 16,
    },
    patientInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    patientAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    patientDetails: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    appointmentType: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginTop: 2,
      textTransform: 'capitalize',
    },
    doctorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    doctorLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      marginRight: 8,
    },
    doctorName: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    notesContainer: {
      marginTop: 8,
      padding: 12,
      borderRadius: 8,
    },
    notesLabel: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 4,
    },
    notesText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      lineHeight: 20,
    },
    appointmentActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 0.48,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryAction: {},
    actionButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    primaryActionText: {
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#7C3AED', '#0891B2'] : ['#8B5CF6', '#06B6D4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Appointments</Text>
            <Text style={styles.headerSubtitle}>
              {appointments.length} total appointments
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search appointments..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Status Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}
        >
          {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilter,
                filterStatus === status && styles.activeStatusFilter
              ]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text style={[
                styles.statusFilterText,
                filterStatus === status && styles.activeStatusFilterText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <CalendarIcon size={20} color={theme.colors.textSecondary} />
        <Text style={styles.dateSelectorText}>
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <TouchableOpacity style={styles.changeDateButton}>
          <Text style={styles.changeDateText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={theme.colors.disabled} />
            <Text style={styles.emptyTitle}>No Appointments Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No appointments scheduled for this date'}
            </Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}