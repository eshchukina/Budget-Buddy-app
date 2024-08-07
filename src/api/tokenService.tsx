import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';

export const refreshToken = async (): Promise<boolean> => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}refresh`,
        {refreshToken: storedRefreshToken},
      );

      if (response.status === 200) {
        const {accessToken, refreshToken, expires_in} = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('expiresIn', expires_in.toString());
        console.log('REFRESH');
        return true;
      } else {
        console.log('Token refresh failed with status:', response.status);
        return false;
      }
    } else {
      console.log('Refresh token is missing');
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('expiresIn');
      }
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
};
