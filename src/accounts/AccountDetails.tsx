import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL_PRODUCTION } from '@env';
import AccountCard from './AccountCard';
import Menu from 'react-native-vector-icons/MaterialIcons';
import User from 'react-native-vector-icons/Feather';
import Search from 'react-native-vector-icons/Feather';
import CustomButton from '../buttons/CustomButton';

interface AccountDetailsProps {
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ setTransactions }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
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

        const response = await axios.get(
          `${REACT_APP_API_URL_PRODUCTION}accounts`,
          {
            headers: headersWithToken,
          },
        );

        if (response.status === 200) {
          const fetchedAccounts = response.data;
          setAccounts(fetchedAccounts);
        } else {
          console.log('Failed to fetch accounts');
        }
      } catch (error) {
        console.log('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomButton
          icon={<Menu name="menu" size={30} color="#96aa9a" />}
          onPress={() => console.log('click')}
        />

        <View style={styles.headerWrappper}>
          <CustomButton
            icon={<Search name="search" size={30} color="#96aa9a" />}
            onPress={() => console.log('click')}
          />
          <CustomButton
            icon={<User name="user" size={30} color="#96aa9a" />}
            onPress={() => console.log('click')}
          />
        </View>
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>Hello, John!</Text>
      </View>
      <FlatList
        horizontal
        data={accounts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <AccountCard
            key={item.id}
            account={item}
            setTransactions={setTransactions}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerWrappper: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    paddingTop: 20,
    textAlign: 'left',
  },
});

export default AccountDetails;
