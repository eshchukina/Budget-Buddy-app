// DeleteAccountHandler.tsx
import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL_PRODUCTION } from '@env';

interface Account {
  id: number;
}

interface DeleteAccountHandlerProps {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  t: (key: string) => string;
}

export const useDeleteAccountHandler = ({ accounts, setAccounts, t }: DeleteAccountHandlerProps) => {
  const handleDelete = async (account: Account) => {
    Alert.alert(
      '',
      t('alertAc'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) throw new Error('No token found');
  
              const headersWithToken = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              };
  
              const response = await fetch(
                `${REACT_APP_API_URL_PRODUCTION}accounts/${account.id}`,
                {
                  method: 'DELETE',
                  headers: headersWithToken,
                },
              );
  
              const responseBody = await response.text(); // Получение тела ответа
              if (response.ok) {
                const updatedAccounts = accounts.filter(
                  acc => acc.id !== account.id,
                );
                setAccounts(updatedAccounts);
                console.log('Account deleted');
              } else {
                console.error('Failed to delete account:', response.status, responseBody);
              }
            } catch (error) {
              console.error('Error deleting account:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  return { handleDelete };
};
