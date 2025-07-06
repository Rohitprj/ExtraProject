import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const SecureStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    } else {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error('Error getting item from SecureStore:', error);
        return null;
      }
    }
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
        throw error;
      }
    } else {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error('Error setting item in SecureStore:', error);
        throw error;
      }
    }
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
        throw error;
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error('Error removing item from SecureStore:', error);
        throw error;
      }
    }
  },
};