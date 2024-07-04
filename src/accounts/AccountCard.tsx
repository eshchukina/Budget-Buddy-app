import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import CustomButton from '../buttons/CustomButton';
import Delete from 'react-native-vector-icons/AntDesign';
import Edit from 'react-native-vector-icons/FontAwesome';

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
  handleDelete: any;
}

const AccountCard: React.FC<AccountCardProps> = ({
  handleDelete,
  setAccountId,
  onEdit,
  account,
  setTransactions,
}) => {
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
      setAccountId(account.id);

      if (response.status === 200) {
        const transactions = response.data || [];
        setTransactions(transactions);
      } else {
        console.log('Failed to fetch account statement');
      }
    } catch (error) {
      console.error('Error fetching account statement:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={fetchTransactions}>
      <Text style={styles.cardText}> {account.name}</Text>
      <Text style={styles.cardText}>Currency: {account.currency}</Text>
      <Text style={styles.cardText}>
        Current Balance: {account.currentBalance}
      </Text>
      <Text style={styles.cardText}>
        Future Balance: {account.futureBalance}
      </Text>
      <View style={styles.buttons}>
        <CustomButton
          icon={<Edit name="edit" size={20} color="#cf7041" />}
          onPress={() => onEdit(account.id)}
          backgroundColor={'#b4bfc5'}
        />
        <CustomButton
          icon={<Delete name="delete" size={20} color="#cf7041" />}
          onPress={() => handleDelete(account)}
          backgroundColor={'#b4bfc5'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b4bfc5',
    borderRadius: 20,
    padding: 10,
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10,
    marginBottom: 10,
    width: 150,
    height: 150,
  },
  cardText: {
    color: '#5e718b',
    fontSize: 12,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default AccountCard;
