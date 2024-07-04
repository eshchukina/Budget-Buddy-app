import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import AccountCard from './AccountCard';
import Menu from 'react-native-vector-icons/Feather';
import User from 'react-native-vector-icons/Feather';
import New from 'react-native-vector-icons/Ionicons';
import Cahrt from 'react-native-vector-icons/Fontisto';
import CustomButton from '../buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';

interface AccountDetailsProps {
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const AccountDetails: React.FC<AccountDetailsProps> = ({
  setTransactions,
  toggleSideBar,
  setAccountId,
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountCurrency, setNewAccountCurrency] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAccountId, setEditAccountId] = useState<number | null>(null);
  const [editedAccountName, setEditedAccountName] = useState('');
  const [editedAccountCurrency, setEditedAccountCurrency] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);
  const fetchAccounts = async () => {
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
        Alert.alert('Success', 'New account created successfully.');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to create new account.');
      }
    } catch (error) {
      console.log('Error creating account:', error);
      Alert.alert('Error', 'Failed to create new account.');
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
      'Confirm Deletion',
      'Are you sure you want to delete this account?',
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
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomButton
          icon={<Menu name="align-left" size={30} color="#96aa9a" />}
          onPress={toggleSideBar}
        />

        <View style={styles.headerWrappper}>
          <CustomButton
            icon={<Cahrt name="pie-chart-2" size={30} color="#96aa9a" />}
            onPress={() => navigation.navigate('Details')}
          />
          <CustomButton
            icon={<User name="user" size={30} color="#96aa9a" />}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>Hello, John!</Text>

        <CustomButton
          icon={<New name="add" size={30} color="#cf7041" />}
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
            }}
            handleDelete={handleDelete}
            setAccountId={setAccountId}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Edit Account Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account name"
              value={editedAccountName}
              onChangeText={setEditedAccountName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter currency"
              value={editedAccountCurrency}
              onChangeText={setEditedAccountCurrency}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={saveEditedAccount} />
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>New Account Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account name"
              value={newAccountName}
              onChangeText={setNewAccountName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter currency"
              value={newAccountCurrency}
              onChangeText={setNewAccountCurrency}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={saveNewAccount} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f5',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heading: {
    fontSize: 24,
    color: '#5e718b',
    marginBottom: 20,
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
    width: '30%',
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
