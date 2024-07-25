
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL_PRODUCTION } from '@env';
import { validateEmail, validatePassword  } from '../utils/validation';
interface HandleLoginParams {
  email: string;
  password: string;
  setEmailError: (error: string) => void;
  setPasswordError: (error: string) => void;
  setErrorText: (error: string) => void;
  login: (token: string) => void;
  refreshIntervalId: NodeJS.Timeout | null;
  setRefreshIntervalId: (id: NodeJS.Timeout | null) => void;
}

export const handleLogin = async ({
  email,
  password,
  setEmailError,
  setPasswordError,
  setErrorText,
  login,

}: HandleLoginParams) => {
  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address');
    return;
  } else {
    setEmailError('');
  }

  if (!validatePassword(password)) {
    setPasswordError(
      'Password must be at least 6 characters long and include at least one number and one letter'
    );
    return;
  } else {
    setPasswordError('');
  }

  try {
    const response = await axios.post(
      `${REACT_APP_API_URL_PRODUCTION}authorization`,
      { email, password }
    );

    if (response.status === 200) {
      const { accessToken, refreshToken, expires_in, id, name } = response.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expires_in.toString());
      await AsyncStorage.setItem('accountId', id.toString());
      await AsyncStorage.setItem('name', name);

      login(accessToken);
   

    } else {
      setErrorText('Invalid email or password. Please try again');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorText('Error occurred during login. Please try again later');
  }
};
