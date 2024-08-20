import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import moment from 'moment';
import CustomButton from '../buttons/CustomButton';
import New from 'react-native-vector-icons/Ionicons';
import TransactionModal from './TransactionModal';
import TransactionModalUpdate from './TransactionModalUpdate';
import {useTranslation} from 'react-i18next';
import TransactionItem from '../tables/TransactionItem';
import {
  deleteTransaction,
  fetchTransactions,
} from '../../api/transactionService';

interface TransactionTableProps {
  transactions: any[];
  accountId: number | null;
  setTransactions: any;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  accountId,
  transactions,
  setTransactions,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
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
        onPress: () => deleteTransaction(transactionId, loadTransactions),
        style: 'destructive',
      },
    ]);
  };

  const loadTransactions = () => {
    fetchTransactions(accountId, setTransactions);
  };

  const renderItem = ({item}: {item: any}) => (
    <TransactionItem
      item={item}
      handleEditTransaction={handleEditTransaction}
      confirmDeleteTransaction={confirmDeleteTransaction}
      formatDate={formatDate}
    />
  );
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
        setLoading={setLoading}
        fetchTransactions={loadTransactions}
      />

      <TransactionModalUpdate
        modalVisible={modalVisibleUpdate}
        setModalVisible={setModalVisibleUpdate}
        accountId={accountId}
        setLoading={setLoading}
        fetchTransactions={loadTransactions}
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
  headerText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: '#cf7041',
    textAlign: 'center',
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
