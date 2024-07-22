import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import moment from 'moment';
import IconMapper from '../IconsMapper/IconMapper';
import CustomButton from '../buttons/CustomButton';
import New from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import {BooleanContext} from '../context/ClobalProvider';
import TransactionModal from './TransactionModal';
import Delete from 'react-native-vector-icons/AntDesign';
import TransactionModalUpdate from './TransactionModalUpdate';
import {useTranslation} from 'react-i18next';

interface TransactionTableProps {
  transactions: any[];
  accountId: string;
  setTransactions: any;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  accountId,
  transactions,
  setTransactions,
}) => {
  const context = useContext(BooleanContext);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const {t} = useTranslation();
  const {width} = Dimensions.get('window');
  const tableHead = ['', '', t('amount'), t('balance'), ' '];
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const formatDate = (date: string) => {
    return moment(date).format('YY-MM-DD');
  };

  const handleCreateTransaction = () => {
    setTransactionToEdit(null);
    setModalVisible(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setTransactionToEdit(transaction);
    setModalVisibleUpdate(true);
  };
  const confirmDeleteTransaction = (transactionId: string) => {
    Alert.alert('', t('alert'), [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteTransaction(transactionId),
        style: 'destructive',
      },
    ]);
  };
  const deleteTransaction = async (transactionId: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const headersWithToken = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${REACT_APP_API_URL_PRODUCTION}transactions/${transactionId}`,
        {
          headers: headersWithToken,
        },
      );

      if (response.status === 200) {
        console.log('Success', 'Transaction deleted successfully.');
        fetchTransactions();
      } else {
        console.log('Error', 'Failed to delete transaction.');
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      console.log('Error', 'Failed to delete transaction.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
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

  const renderItem = ({item}: {item: any}) => {
    const isFutureDate = moment(item.date).isAfter(moment());

    return (
      <TouchableOpacity onPress={() => handleEditTransaction(item)}>
        <View
          style={[
            styles.transactionRow,
            isFutureDate ? null : styles.pastTransaction,
          ]}>
          <IconMapper tag={item.tag} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionText}>{item.description}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
          <Text style={[styles.transactionAmount, {width: width / 4}]}>
            {item.amount}
          </Text>
          <Text style={[styles.transactionBalance, {width: width / 4}]}>
            {item.balance}
          </Text>

          <CustomButton
            icon={<Delete name="delete" size={20} color="#cf7041" />}
            onPress={() => confirmDeleteTransaction(item.id)}
            backgroundColor={isFutureDate ? '#f6f6f5' : '#e5c5bd0'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.containerSpinner}>
        <ActivityIndicator
          color={'#e2a55e'}
          style={{transform: [{scale: 2}]}}
        />
      </View>
    );
  }

  const renderHeader = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {tableHead.map((item, index) => (
        <Text
          key={index}
          style={[styles.headerText, {width: width / tableHead.length + 10}]}>
          {item}
        </Text>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>{t('transaction')}</Text>

        <CustomButton
          icon={<New name="add" size={30} color="#e2a55e" />}
          onPress={handleCreateTransaction}
          backgroundColor="#f6f6f5"
        />
      </View>

      <TransactionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        accountId={accountId}
        context={context}
        setLoading={setLoading}
        fetchTransactions={fetchTransactions}
      />

      <TransactionModalUpdate
        modalVisible={modalVisibleUpdate}
        setModalVisible={setModalVisibleUpdate}
        accountId={accountId}
        context={context}
        setLoading={setLoading}
        fetchTransactions={fetchTransactions}
        transactionToEdit={transactionToEdit}
      />

      <FlatList
        ListHeaderComponent={renderHeader}
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.wrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    width: '100%',
    bottom: 5,
  },
  wrapper: {},
  containerSpinner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    color: '#5e718b',
    fontFamily: 'Montserrat-Bold',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    paddingHorizontal: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f5',
  },
  headerText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: '#cf7041',
    textAlign: 'center',
  },
  dataWrapper: {},
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#e5c5bd',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionText: {
    textTransform: 'lowercase',
    fontSize: 15,
    color: '#000',
    fontFamily: 'Montserrat-Medium',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat-Medium',
  },
  transactionAmount: {
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    fontFamily: 'Montserrat-Medium',
  },
  transactionBalance: {
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    marginLeft: 10,
    fontFamily: 'Montserrat-Medium',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#cf7041',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  pastTransaction: {
    backgroundColor: '#e5c5bd50',
  },
});

export default TransactionTable;
