import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import {Picker} from '@react-native-picker/picker';
import Button from '../buttons/Buttons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

interface TransactionModalUpdate {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  accountId: string;
  context: any;
  setLoading: (loading: boolean) => void;
  fetchTransactions: () => void;
  transactionToEdit?: any;
}

const TransactionModalUpdate: React.FC<TransactionModalUpdate> = ({
  modalVisible,
  setModalVisible,
  accountId,
  setLoading,
  fetchTransactions,
  transactionToEdit,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [tag, setTag] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString());
      setDate(new Date(transactionToEdit.date));
      setTag(transactionToEdit.tag);
    } else {
      setDescription('');
      setAmount('');
      setDate(new Date());
      setTag('');
    }
  }, [transactionToEdit]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const headersWithToken = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const transactionData = {
        account_id: accountId,
        description,
        tag,
        amount: parseFloat(amount),
        date: moment(date).toISOString(),
      };

      let response;
      if (transactionToEdit) {
        response = await axios.put(
          `${REACT_APP_API_URL_PRODUCTION}transactions/${transactionToEdit.id}`,
          transactionData,
          {headers: headersWithToken},
        );
      } else {
        response = await axios.post(
          `${REACT_APP_API_URL_PRODUCTION}transactions`,
          transactionData,
          {headers: headersWithToken},
        );
      }

      if (response.status === 200 || response.status === 201) {
        console.log('Transaction saved successfully.');
        fetchTransactions();
      } else {
        console.log('Failed to save transaction.');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      console.log('Failed to save transaction.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
    fetchTransactions();
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {transactionToEdit ? 'Edit Transaction' : 'Create Transaction'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            keyboardType="numeric"
            onChangeText={setAmount}
          />
          <TouchableOpacity
            style={styles.datePicker}
            onPress={toggleDatePicker}>
            <Text>{moment(date).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tag}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setTag(itemValue)}>
              <Picker.Item label="Food" value="food" />
              <Picker.Item label="Transport" value="transport" />
              <Picker.Item label="Salary" value="salary" />
              <Picker.Item label="Health" value="health" />
              <Picker.Item label="Pets" value="pets" />
              <Picker.Item label="Gifts" value="gifts" />
              <Picker.Item label="Hobby" value="hobby" />
              <Picker.Item label="Entertainment" value="entertainment" />
              <Picker.Item label="Cloth" value="cloth" />
              <Picker.Item label="MoneyBox" value="moneyBox" />
              <Picker.Item label="Trips" value="trips" />
              <Picker.Item label="Credit" value="credit" />
              <Picker.Item label="Shop" value="shop" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              text="Save"
              color="#b4bfc5"
              padding={10}
              onPress={handleSave}
            />
            <Button
              text="Close"
              color="#b4bfc5"
              padding={10}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5e718b90',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    width: 300,
    marginLeft: 5,
  },
  modalView: {
    backgroundColor: '#f6f6f5',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
    width: 300,
    borderColor: '#e5c5bd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: 300,
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalText: {
    fontSize: 24,
    color: '#5e718b',
    marginBottom: 20,
  },
});

export default TransactionModalUpdate;
