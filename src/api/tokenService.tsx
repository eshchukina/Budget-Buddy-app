import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_URL_PRODUCTION } from '@env';

export const refreshTokenGet = async (): Promise<boolean> => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      console.log('Refresh token is missing');
      return false;
    }

    const response = await axios.post(
      `${REACT_APP_API_URL_PRODUCTION}refresh`,
      { refreshToken: storedRefreshToken },
    );

    if (response.status === 200) {
      const { accessToken, refreshToken, expires_in } = response.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expires_in.toString());

      console.log('Token refreshed successfully');
      return true;
    } else {
      console.log('Token refresh failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    return false;
  }
};
