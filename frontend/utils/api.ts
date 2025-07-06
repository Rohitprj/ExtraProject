import { SecureStorage } from './secure-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.187:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await SecureStorage.getItemAsync('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } else {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return {
        success: true,
        data: null as T,
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = await this.getAuthHeaders();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Specific API functions
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData: any) => apiClient.post('/auth/register', userData),

  getCurrentUser: () => apiClient.get('/auth/me'),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: () => apiClient.post('/auth/refresh'),
};

export const patientsApi = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get('/patients', params),

  getById: (id: string) => apiClient.get(`/patients/${id}`),

  create: (patientData: any) => apiClient.post('/patients', patientData),

  update: (id: string, patientData: any) =>
    apiClient.put(`/patients/${id}`, patientData),

  delete: (id: string) => apiClient.delete(`/patients/${id}`),

  getMedicalHistory: (id: string) =>
    apiClient.get(`/patients/${id}/medical-history`),

  getMedications: (id: string) => apiClient.get(`/patients/${id}/medications`),
};

export const appointmentsApi = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get('/appointments', params),

  getById: (id: string) => apiClient.get(`/appointments/${id}`),

  create: (appointmentData: any) =>
    apiClient.post('/appointments', appointmentData),

  update: (id: string, appointmentData: any) =>
    apiClient.put(`/appointments/${id}`, appointmentData),

  delete: (id: string) => apiClient.delete(`/appointments/${id}`),

  getDoctorAvailability: (doctorId: string, date: string) =>
    apiClient.get(`/appointments/doctor/${doctorId}/availability`, { date }),
};

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),

  getRecentActivity: (params?: Record<string, string>) =>
    apiClient.get('/dashboard/recent-activity', params),
};

export const usersApi = {
  getAll: (params?: Record<string, string>) => apiClient.get('/users', params),

  getById: (id: string) => apiClient.get(`/users/${id}`),

  getDoctors: () => apiClient.get('/users/doctors'),

  update: (id: string, userData: any) =>
    apiClient.put(`/users/${id}`, userData),

  delete: (id: string) => apiClient.delete(`/users/${id}`),
};
