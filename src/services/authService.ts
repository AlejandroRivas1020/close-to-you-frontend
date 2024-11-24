import AsyncStorage from '@react-native-async-storage/async-storage';
import apiCloseToYou from '../api/ApiCloseToYou';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const AUTH_TOKEN_KEY = 'accessToken';

const authService = {

  login: async (loginData: LoginData): Promise<boolean> => {
    try {
      const response = await apiCloseToYou.post('/auth/login', loginData);
      const token = response.data.accessToken;

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  register: async (registerData: RegisterData): Promise<string> => {
    try {
      const response = await apiCloseToYou.post('/auth/register', registerData);

      return response.data.message;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error.response?.data?.message || 'Registration failed';
    }
  },

};

export default authService;
