import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
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
  const [showSpinner, setShowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);

  const {width} = Dimensions.get('window');
  const tableHead = ['', '', 'Amount', 'Balance', ' '];
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

  const deleteTransaction = async (transactionId: string) => {
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
      setShowSpinner(true);
      setTimeout(() => setShowSpinner(false), 3000);
    }
  };

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
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => handleEditTransaction(item)}>
      <View style={styles.transactionRow}>
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
          onPress={() => deleteTransaction(item.id)}
          backgroundColor={'#f6f6f5'}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>Transaction</Text>

        <CustomButton
          icon={<New name="add" size={30} color="#cf7041" />}
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

      <View>
        <View>
          <FlatList
            data={tableHead}
            horizontal
            renderItem={({item}) => (
              <Text
                style={[
                  styles.headerText,
                  {width: width / tableHead.length + 10},
                ]}>
                {item}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.dataWrapper}
          />
        </View>

        {showSpinner ? (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            color="#0000ff"
          />
        ) : (
          <View>
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.dataWrapper}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flex: 1,
    width: '100%',
  },
  heading: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5e718b',
  },
  headerTitle: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    paddingHorizontal: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f6f6f5',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cf7041',
    textAlign: 'center',
  },
  dataWrapper: {
    paddingHorizontal: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e5c5bd',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionText: {
    fontSize: 16,
    color: '#000',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  transactionBalance: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default TransactionTable;
