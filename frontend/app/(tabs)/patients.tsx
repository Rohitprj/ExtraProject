import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Search, Plus, Filter, Phone, Mail, Calendar, MapPin, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { patientsApi } from '@/utils/api';
import { Patient } from '@/types';

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const queryClient = useQueryClient();
  const { theme, isDark } = useTheme();

  const { data: patientsResponse, isLoading, error } = useQuery({
    queryKey: ['patients', searchQuery],
    queryFn: async () => {
      const params = searchQuery ? { search: searchQuery } : undefined;
      const response = await patientsApi.getAll(params);
      return response;
    },
  });

  const patients = patientsResponse?.data || [];

  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const response = await patientsApi.delete(patientId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      Alert.alert('Success', 'Patient deleted successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to delete patient');
    },
  });

  const handleDeletePatient = (patient: Patient) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deletePatientMutation.mutate(patient.id)
        },
      ]
    );
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <View style={[styles.patientCard, { 
      backgroundColor: theme.colors.card,
      shadowColor: theme.colors.shadow,
    }]}>
      <View style={styles.patientHeader}>
        <View style={[styles.patientAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.patientInitials}>
            {patient.firstName[0]}{patient.lastName[0]}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { color: theme.colors.text }]}>
            {patient.firstName} {patient.lastName}
          </Text>
          <Text style={[styles.patientAge, { color: theme.colors.textSecondary }]}>
            Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
          </Text>
        </View>
        <View style={styles.patientActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setEditingPatient(patient)}
          >
            <Edit3 size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, { 
              backgroundColor: isDark ? 'rgba(248, 113, 113, 0.2)' : '#FEF2F2' 
            }]}
            onPress={() => handleDeletePatient(patient)}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.patientDetails}>
        <View style={styles.detailRow}>
          <Phone size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{patient.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Mail size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{patient.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {patient.address.city}, {patient.address.state}
          </Text>
        </View>
      </View>

      {patient.currentMedications.length > 0 && (
        <View style={[styles.medicationsSection, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.medicationsTitle, { color: theme.colors.text }]}>Current Medications:</Text>
          {patient.currentMedications.slice(0, 2).map((med, index) => (
            <Text key={index} style={[styles.medicationText, { color: theme.colors.textSecondary }]}>
              • {med.name} - {med.dosage}
            </Text>
          ))}
          {patient.currentMedications.length > 2 && (
            <Text style={[styles.medicationText, { color: theme.colors.textSecondary }]}>
              +{patient.currentMedications.length - 2} more
            </Text>
          )}
        </View>
      )}
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
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
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
    filterButton: {
      padding: 8,
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    errorTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.error,
      marginTop: 16,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 48,
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
    patientsGrid: {
      padding: 24,
    },
    patientCard: {
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
    patientHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    patientAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    patientInitials: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    patientAge: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginTop: 2,
    },
    patientActions: {
      flexDirection: 'row',
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    deleteButton: {},
    patientDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      marginLeft: 8,
    },
    medicationsSection: {
      borderTopWidth: 1,
      paddingTop: 12,
    },
    medicationsTitle: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    medicationText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginBottom: 2,
    },
  });

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={isDark ? ['#059669', '#0891B2'] : ['#10B981', '#06B6D4']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Patients</Text>
              <Text style={styles.headerSubtitle}>Error loading patients</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Users size={48} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>
            Unable to connect to the server. Please check your internet connection and try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#059669', '#0891B2'] : ['#10B981', '#06B6D4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Patients</Text>
            <Text style={styles.headerSubtitle}>
              {patients.length} total patients
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Patients List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading patients...</Text>
          </View>
        ) : patients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Users size={48} color={theme.colors.disabled} />
            <Text style={styles.emptyTitle}>No Patients Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first patient to get started'}
            </Text>
          </View>
        ) : (
          <View style={styles.patientsGrid}>
            {patients.map((patient: Patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}