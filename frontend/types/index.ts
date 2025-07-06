export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  currentMedications: Medication[];
  allergies: string[];
  bloodType: string;
  insuranceProvider: string;
  insuranceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  type: 'checkup' | 'consultation' | 'followup' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: number;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  newPatientsThisMonth: number;
  upcomingAppointments: Appointment[];
  recentPatients: Patient[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}