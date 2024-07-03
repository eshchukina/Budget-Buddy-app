import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_API_URL_PRODUCTION} from '@env';


const AccountDetails: React.FC = () => {
  const [activeAccount, setActiveAccount] = useState<any>(null);

  useEffect(() => {
    const fetchAccountById = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const accountId = await AsyncStorage.getItem('accountId');

        if (!token || !accountId) {
          throw new Error('No token or accountId found');
        }
  
        const headersWithToken = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.get(`${REACT_APP_API_URL_PRODUCTION}accounts`, {
          headers: headersWithToken,
        });
  
        console.log(response)
        if (response.status === 200) {
          const account = response.data;
          setActiveAccount(account);
        } else {
          console.log('Failed to fetch account by id');
        }
      } catch (error) {
        console.log('Error fetching account by id:', error);
      }
    };
  
    fetchAccountById();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Details</Text>
      {activeAccount ? (
        <View>
          <Text>Name: {activeAccount.name}</Text>
          <Text>Email: {activeAccount.email}</Text>
          {/* Display other account details */}
        </View>
      ) : (
        <Text>Loading account details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AccountDetails;
