// services/accountService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_URL_PRODUCTION } from '@env';
import { Account } from '../types/types';

export const fetchAccounts = async (setAccounts: React.Dispatch<React.SetStateAction<Account[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${REACT_APP_API_URL_PRODUCTION}accounts`, {
      headers: headersWithToken,
    });

    if (response.status === 200) {
      setAccounts(response.data);
    } else {
      console.error('Failed to fetch accounts');
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  } finally {
    setLoading(false);
  }
};
