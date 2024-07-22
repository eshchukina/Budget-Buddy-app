import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import AccountCard from './AccountCard';
import NewAccountModal from './NewAccountModal';
import New from 'react-native-vector-icons/Ionicons';
import CustomButton from '../buttons/CustomButton';
import CurrencyExchange from '../currencyExchange/CurrencyExchange';
import EditAccountModal from './EditAccountModal';
import {useTranslation} from 'react-i18next';

interface Account {
  id: number;
  name: string;
  currency: string;
  currentBalance: number;
  futureBalance: number;
  user_id: number;
}

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  date: string;
  description: string;
  tag: string;
  balance: number;
}

interface AccountDetailsProps {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  toggleSideBar: () => void;
  setAccountId: React.Dispatch<React.SetStateAction<string>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  currencyModalVisible: boolean;
  setCurrencyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  transactions: Transaction[];
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  setTransactions,
  setAccountId,
  setCurrency,
  currencyModalVisible,
  setCurrencyModalVisible,
  accounts,
  setAccounts,
  transactions,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountCurrency, setNewAccountCurrency] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAccountId, setEditAccountId] = useState<number | null>(null);
  const [editedAccountName, setEditedAccountName] = useState('');
  const [editedAccountCurrency, setEditedAccountCurrency] = useState('');
  const [userName, setUserName] = useState('');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const {t} = useTranslation();

  useEffect(() => {
    fetchAccounts();
    fetchUserName();
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchUserName();
  }, [transactions]);

  useEffect(() => {
    if (accounts.length > 0 && isFirstLaunch) {
      openFirstAccount(accounts[0].id);
      setIsFirstLaunch(false);
      setSelectedAccountId(accounts[0].id);
      setCurrency(accounts[0].currency);
    }
  }, [accounts]);

  const openFirstAccount = async (accountId: number) => {
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

  const fetchUserName = async () => {
    setLoading(true);

    try {
      const name = await AsyncStorage.getItem('name');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log('Error fetching user name:', error);
    }
    setLoading(false);
  };

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
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
  const handleCreateAccount = () => {
    setModalVisible(true);
    setNewAccountName('');
  };

  const saveNewAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
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
        setAccounts([...accounts, newAccount]);

        setModalVisible(false);
      } else {
      }
    } catch (error) {
      console.log('Error creating account:', error);
    }
  };

  const saveEditedAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
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

      if (response.status === 200) {
        const updatedAccount = response.data;
        const updatedAccounts = accounts.map(acc =>
          acc.id === editAccountId ? updatedAccount : acc,
        );
        setAccounts(updatedAccounts);
      } else {
      }
    } catch (error) {
      console.log('Error updating account:', error);
      console.log('Server response:', error.response.data);
    }
    setEditModalVisible(false);
    fetchAccounts();
  };

  const handleDelete = async account => {
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

              if (response.ok) {
                const updatedAccounts = accounts.filter(
                  acc => acc.id !== account.id,
                );
                setAccounts(updatedAccounts);
              } else {
              }
            } catch (error) {
              console.error('Error deleting account:', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={'#e2a55e'}
          style={{transform: [{scale: 2}]}}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>
          {t('hello')}, {userName}!
        </Text>

        <CustomButton
          icon={<New name="add" size={30} color="#e2a55e" />}
          onPress={handleCreateAccount}
          backgroundColor="#f6f6f5"
        />
      </View>
      <FlatList
        horizontal
        data={accounts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <AccountCard
            key={item.id}
            account={item}
            setTransactions={setTransactions}
            onEdit={accountId => {
              setEditAccountId(accountId);
              setEditModalVisible(true);
              setEditedAccountName(item.name);
            }}
            setCurrency={setCurrency}
            handleDelete={handleDelete}
            setAccountId={setAccountId}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      <EditAccountModal
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        editedAccountName={editedAccountName}
        setEditedAccountName={setEditedAccountName}
        editedAccountCurrency={editedAccountCurrency}
        setEditedAccountCurrency={setEditedAccountCurrency}
        saveEditedAccount={saveEditedAccount}
      />

      <NewAccountModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newAccountName={newAccountName}
        setNewAccountName={setNewAccountName}
        newAccountCurrency={newAccountCurrency}
        setNewAccountCurrency={setNewAccountCurrency}
        saveNewAccount={saveNewAccount}
      />
      <CurrencyExchange
        modalVisible={currencyModalVisible}
        setModalVisible={setCurrencyModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,

    backgroundColor: '#f6f6f5',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heading: {
    fontSize: 24,
    color: '#5e718b',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerWrappper: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default AccountDetails;
