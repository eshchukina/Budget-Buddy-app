import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';

export const refreshToken = async (
  setRefreshIntervalId: React.Dispatch<
    React.SetStateAction<NodeJS.Timeout | null>
  >,
) => {
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

        const expiresInMilliseconds = expires_in * 1000;
        const refreshTime = expiresInMilliseconds - 60000;

        if (setRefreshIntervalId) {
          clearTimeout(setRefreshIntervalId);
        }
        const newIntervalId = setTimeout(async () => {
          await refreshToken(setRefreshIntervalId);
          console.log('Token refreshed');
        }, refreshTime);

        setRefreshIntervalId(newIntervalId);
      } else {
        console.log('Token refresh failed with status:', response.status);
      }
    } else {
      console.log('Refresh token is missing');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};
