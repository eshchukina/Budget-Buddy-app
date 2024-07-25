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
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import AccountCard from './AccountCard';
import NewAccountModal from './NewAccountModal';
import New from 'react-native-vector-icons/Ionicons';
import CustomButton from '../buttons/CustomButton';
import CurrencyExchange from '../currencyExchange/CurrencyExchange';
import EditAccountModal from './EditAccountModal';
import {useTranslation} from 'react-i18next';
import {openFirstAccount} from '../api/accountService.';
import {Account, Transaction} from '../types/types';

import {
  fetchAccounts,
  saveNewAccount,
  saveEditedAccount,
} from '../api/accountService.';

interface AccountDetailsProps {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  toggleSideBar: () => void;
  setAccountId: React.Dispatch<React.SetStateAction<number>>;
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
    fetchAccountsData();
    fetchUserName();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAccountsData();
    setLoading(false);
  }, [transactions]);

  useEffect(() => {
    if (Array.isArray(accounts) && accounts.length > 0 && isFirstLaunch) {
      openFirstAccount(
        accounts[0].id,
        setAccountId,
        setTransactions,
        setLoading,
      );
      setIsFirstLaunch(false);
      setSelectedAccountId(accounts[0].id);
      setCurrency(accounts[0].currency);
    }
  }, [accounts, isFirstLaunch, setAccountId, setCurrency, setTransactions]);

  const fetchAccountsData = async () => {
    setLoading(true);
    const fetchedAccounts = await fetchAccounts();
    setAccounts(fetchedAccounts);
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

  const handleCreateAccount = () => {
    setModalVisible(true);
    setNewAccountName('');
  };

  const handleSaveNewAccount = async () => {
    await saveNewAccount(
      newAccountName,
      newAccountCurrency,
      setAccounts,
      setModalVisible,
    );
  };

  const handleSaveEditedAccount = async () => {
    if (editAccountId !== null) {
      await saveEditedAccount(
        editAccountId,
        editedAccountName,
        editedAccountCurrency,
        setAccounts,
        setEditModalVisible,
        fetchAccountsData,
      );
    }
  };

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

              const responseBody = await response.text();
              if (response.ok) {
                const updatedAccounts = accounts.filter(
                  acc => acc.id !== account.id,
                );
                setAccounts(updatedAccounts);
                console.log('Account deleted');
              } else {
                console.error(
                  'Failed to delete account:',
                  response.status,
                  responseBody,
                );
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
            length={accounts.length}
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
        saveEditedAccount={handleSaveEditedAccount}
      />

      <NewAccountModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newAccountName={newAccountName}
        setNewAccountName={setNewAccountName}
        newAccountCurrency={newAccountCurrency}
        setNewAccountCurrency={setNewAccountCurrency}
        saveNewAccount={handleSaveNewAccount}
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
    textTransform: 'capitalize',
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
