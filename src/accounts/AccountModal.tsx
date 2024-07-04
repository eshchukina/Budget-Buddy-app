import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';

interface AccountModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  newAccountName: string;
  setNewAccountName: React.Dispatch<React.SetStateAction<string>>;
  newAccountCurrency: string;
  setNewAccountCurrency: React.Dispatch<React.SetStateAction<string>>;
  editAccountId: number | null;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  accounts: any[];
}

const AccountModal: React.FC<AccountModalProps> = ({
  modalVisible,
  setModalVisible,
  newAccountName,
  setNewAccountName,
  newAccountCurrency,
  setNewAccountCurrency,
  editAccountId,
  setAccounts,
  accounts,
}) => {
  const handleSave = async () => {
    if (editAccountId === null) {
      saveNewAccount();
    } else {
      updateAccount();
    }
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

  const updateAccount = async () => {
    if (editAccountId === null) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const headersWithToken = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.put(
        `${REACT_APP_API_URL_PRODUCTION}accounts/${editAccountId}`,
        {
          name: newAccountName,
          currency: newAccountCurrency,
        },
        {
          headers: headersWithToken,
        },
      );

      if (response.status === 200) {
        const updatedAccount = response.data;
        const updatedAccounts = accounts.map(account =>
          account.id === editAccountId ? updatedAccount : account,
        );
        setAccounts(updatedAccounts);
        Alert.alert('Success', 'Account updated successfully.');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update account.');
      }
    } catch (error) {
      console.log('Error updating account:', error);
      Alert.alert('Error', 'Failed to update account.');
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Account Details:</Text>
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
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default AccountModal;
