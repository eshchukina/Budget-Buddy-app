import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import {useTranslation} from 'react-i18next';

interface TransactionModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  accountId: string;
  context: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTransactions: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  modalVisible,
  setModalVisible,
  accountId,
  setLoading,
  fetchTransactions,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [tag, setTag] = useState('food');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {t} = useTranslation();

  const createNewTransaction = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const headersWithToken = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const isNegative = tag !== 'salary';

      const newTransactionData = {
        account_id: accountId,
        description,
        tag,
        amount: isNegative ? -parseFloat(amount) : parseFloat(amount),
        date: moment(date).toISOString(),
      };

      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}transactions`,
        newTransactionData,
        {
          headers: headersWithToken,
        },
      );

      if (response.status === 201) {
        console.log('Success', 'New transaction created successfully.');
        setModalVisible(false);
      } else {
        console.log('Error', 'Failed to create new transaction.');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      console.log('Error', 'Failed to create new transaction.');
    }
    setLoading(false);
    fetchTransactions();
    setDescription('');
    setAmount('');
  };

  const handleCreateTransaction = () => {
    setLoading(true);
    createNewTransaction();
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
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.headerCurrency}>{t('newTransaction')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChangeText={text => setDescription(text)}
            maxLength={30}
          />
          <TextInput
            style={styles.input}
            placeholder={t('amountPlaceholder')}
            value={amount}
            onChangeText={text => setAmount(text)}
            keyboardType="numeric"
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
          <View style={styles.selectContainer}>
            <Text style={styles.text}>{t('selectTag')}</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tag}
              style={styles.picker}
              onValueChange={itemValue => setTag(itemValue)}>
              <Picker.Item
                label="Food"
                value="food"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Transport"
                value="transport"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Salary"
                value="salary"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Health"
                value="health"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Pets"
                value="pets"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Gifts"
                value="gifts"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Hobby"
                value="hobby"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Entertainment"
                value="entertainment"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Cloth"
                value="cloth"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="MoneyBox"
                value="moneyBox"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Trips"
                value="trips"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Credit"
                value="credit"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Shop"
                value="shop"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Other"
                value="other"
                style={styles.pickerItem}
              />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              text={t('create')}
              color="#b4bfc5"
              padding={10}
              onPress={handleCreateTransaction}
            />
            <Button
              text={t('close')}
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
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    marginBottom: 10,
    width: 300,
    borderColor: '#e5c5bd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  pickerItem: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: 300,
  },
  text: {
    color: '#5e718b',
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
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
  headerCurrency: {
    fontSize: 20,
    color: '#5e718b',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
});

export default TransactionModal;
