import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';

interface AccountCardProps {
  account: {
    id: number;
    name: string;
    email: string;
    currency: string;
    currentBalance: number;
    futureBalance: number;
  };
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, setTransactions }) => {
  const fetchTransactions = async () => {
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
        `${REACT_APP_API_URL_PRODUCTION}transactions/accounts/${account.id}/statement`,
        {
          headers: headersWithToken,
        },
      );

      if (response.status === 200) {
        setTransactions(response.data);
      } else {
        console.log('Failed to fetch account statement');
      }
    } catch (error) {
      console.error('Error fetching account statement:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={fetchTransactions}>
      <Text style={styles.cardText}>ID: {account.id}</Text>
      <Text style={styles.cardText}>Name: {account.name}</Text>
      <Text style={styles.cardText}>Email: {account.email}</Text>
      <Text style={styles.cardText}>Currency: {account.currency}</Text>
      <Text style={styles.cardText}>
        Current Balance: {account.currentBalance}
      </Text>
      <Text style={styles.cardText}>
        Future Balance: {account.futureBalance}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b4bfc5',
    borderRadius: 20,
    padding: 20,
    marginRight: 10,
    marginBottom: 10,
    width: 200,
    height: 200,
  },
  cardText: {
    color: '#5e718b',
    fontSize: 10,
  },
});

export default AccountCard;
