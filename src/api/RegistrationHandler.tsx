import axios from 'axios';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { REACT_APP_API_URL_PRODUCTION } from '@env';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

interface RegistrationProps {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setNameError: (error: string) => void;
  setEmailError: (error: string) => void;
  setPasswordError: (error: string) => void;
  setErrorText: (error: string) => void;
  navigation: NavigationProp<RootStackParamList, 'Register'>;
}

export const useRegistration = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  setNameError,
  setEmailError,
  setPasswordError,
  setErrorText,
  navigation,
}: RegistrationProps) => {
  const handleRegistration = async () => {
    if (!validateName(name)) {
      setNameError('Name should be at least 2 characters long and contain only letters');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters and contain at least one number and one letter');
      return;
    }

    const newUser = { name, email, password };

    try {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}user`,
        newUser,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        setPassword('');
        setEmail('');
        setName('');
        navigation.navigate('Login');
      } else {
        setErrorText('Registration failed. Please try again');
      }
    } catch (error) {
      setErrorText('Error occurred during registration. Please try again later');
      console.error('Error:', error);
    }
  };

  return { handleRegistration };
};
