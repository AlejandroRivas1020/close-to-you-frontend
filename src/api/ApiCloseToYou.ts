import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiCloseToYou = axios.create({
  baseURL: 'https://close-to-you-backend.onrender.com/api',
  timeout: 10000,
});

apiCloseToYou.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiCloseToYou;

