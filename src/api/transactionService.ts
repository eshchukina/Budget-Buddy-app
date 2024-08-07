import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import {Transaction} from '../types/types';

interface TransactionToEdit {
  id: string;
}

export const createNewTransaction = async ({
  accountId,
  description,
  tag,
  amount,
  date,
  setModalVisible,
  setLoading,
  fetchTransactions,
  setDescription,
  setAmount,
  setErrorText,
}: {
  accountId: number;
  description: string;
  tag: string;
  amount: string;
  date: Date;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTransactions: () => void;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const isNegative = tag !== 'salary';

    const newTransactionData: Transaction = {
      account_id: accountId,
      description,
      tag,
      amount: isNegative ? -parseFloat(amount) : parseFloat(amount),
      date: moment(date).toISOString(),
    };

    const response = await axios.post(
      `${REACT_APP_API_URL_PRODUCTION}transactions`,
      newTransactionData,
      {
        headers: headersWithToken,
      },
    );

    if (response.status === 201) {
      console.log('Success', 'New transaction created successfully.');
      setModalVisible(false);
      fetchTransactions();
    } else {
      console.log('Error', 'Failed to create new transaction.');
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    console.log('Error', 'Failed to create new transaction.');
  }
  setLoading(false);
  fetchTransactions();
  setDescription('');
  setAmount('');
  setErrorText('');
};

export const updateTransaction = async ({
  accountId,
  description,
  tag,
  amount,
  date,
  transactionToEdit,
  setModalVisible,
  setLoading,
  fetchTransactions,
  setDescription,
  setAmount,
  setErrorText,
}: {
  accountId: number;
  description: string;
  tag: string;
  amount: string;
  date: Date;
  transactionToEdit: TransactionToEdit;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTransactions: () => void;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  if (!description || !amount || !tag) {
    console.log('Validation Error:', 'All fields are required');
    setErrorText('All fields are required');
    return;
  }
  setLoading(true);

  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Token:', token);

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const transactionData: Transaction = {
      account_id: accountId,
      description,
      tag,
      amount: parseFloat(amount),
      date: moment(date).toISOString(),
    };

    console.log('Transaction Data:', transactionData);

    const response = await axios.put(
      `${REACT_APP_API_URL_PRODUCTION}transactions/${transactionToEdit.id}`,
      transactionData,
      {headers: headersWithToken},
    );

    if (response.status === 200 || response.status === 204) {
      console.log('Success:', 'Transaction updated successfully.');
      setModalVisible(false);
      fetchTransactions();
      setDescription('');
      setAmount('');
      setErrorText('');
    } else {
      console.log('Error:', 'Failed to update transaction.');
      setErrorText('Failed to update transaction.');
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    setErrorText('Error updating transaction.');
  } finally {
    setLoading(false);
  }
};

export const deleteTransaction = async (
  transactionId: string,
  fetchTransactions: () => void,
) => {
  // setLoading(true);
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const headersWithToken = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.delete(
      `${REACT_APP_API_URL_PRODUCTION}transactions/${transactionId}`,
      {
        headers: headersWithToken,
      },
    );

    if (response.status === 200) {
      console.log('Success', 'Transaction deleted successfully.');
      fetchTransactions();
    } else {
      console.log('Error', 'Failed to delete transaction.');
      fetchTransactions();
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    console.log('Error', 'Failed to delete transaction.');
  } finally {
    // setLoading(false);
  }
};

export const fetchTransactions = async (
  accountId: number,
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>,
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

    const url = `${REACT_APP_API_URL_PRODUCTION}transactions/accounts/${accountId}/statement`;

    const response = await axios.get(url, {headers: headersWithToken});

    if (response.status === 200) {
      const transactions = response.data || [];
      setTransactions(transactions);
    } else {
      console.log(
        'Failed to fetch account statement. Status:',
        response.status,
      );
    }
  } catch (error) {
    console.error(
      'Error fetching account statement:',
      error.response?.data || error.message,
    );
  } finally {
  }
};
