import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import {Transaction, Account} from '../types/types';

interface FetchTransactionsParams {
  accountId: number;
  setAccountId: React.Dispatch<React.SetStateAction<number>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const openFirstAccount = async (
  accountId: number,
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading(true);

  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `${REACT_APP_API_URL_PRODUCTION}transactions/accounts/${accountId}/statement`,
      {
        headers: headersWithToken,
      },
    );

    setAccountId(accountId);

    if (response.status === 200) {
      const transactions = response.data || [];
      setTransactions(transactions);
    } else {
      console.log('Failed to fetch account statement');
    }
  } catch (error) {
    console.error('Error fetching account statement:', error);
  }
  setLoading(false);
};

export const fetchAccounts = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `${REACT_APP_API_URL_PRODUCTION}accounts`,
      {
        headers: headersWithToken,
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch accounts');
      return [];
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
};

export const saveNewAccount = async (
  newAccountName: string,
  newAccountCurrency: string,
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${REACT_APP_API_URL_PRODUCTION}accounts`,
      {
        name: newAccountName,
        currency: newAccountCurrency,
      },
      {
        headers: headersWithToken,
      },
    );

    if (response.status === 201) {
      const newAccount = response.data;
      setAccounts(prevAccounts => {
        if (Array.isArray(prevAccounts)) {
          return [...prevAccounts, newAccount];
        } else {
          return [newAccount];
        }
      });
      setModalVisible(false);
    } else {
      console.error('Failed to create account', response.status, response.data);
    }
  } catch (error) {
    console.error('Error creating account:', error);
  }
};

export const saveEditedAccount = async (
  editAccountId: number,
  editedAccountName: string,
  editedAccountCurrency: string,
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  fetchAccounts: () => Promise<void>,
) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.put(
      `${REACT_APP_API_URL_PRODUCTION}accounts/${editAccountId}`,
      {
        name: editedAccountName,
        currency: editedAccountCurrency,
      },
      {
        headers: headersWithToken,
      },
    );

    if (response.status === 204) {
      await fetchAccounts();
    } else {
      console.error('Failed to update account', response.status, response.data);
    }
  } catch (error) {
    console.error('Error updating account:', error);
    console.error('Server response:', error.response?.data);
  } finally {
    setEditModalVisible(false);
  }
};

export const fetchTransactions = async ({
  accountId,
  setAccountId,
  setCurrency,
  setSelectedAccountId,
  setTransactions,
}: FetchTransactionsParams) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `${REACT_APP_API_URL_PRODUCTION}transactions/accounts/${accountId}/statement`,
      {
        headers: headersWithToken,
      },
    );

    setAccountId(accountId);
    setCurrency(response.data.currency);
    setSelectedAccountId(accountId);

    if (response.status === 200 || response.status === 201) {
      const transactions = (response.data as Transaction[]) || [];
      setTransactions(transactions);
    } else {
      console.log('Failed to fetch account statement');
    }
  } catch (error) {
    console.error('Error fetching account statement:', error);
  }
};
