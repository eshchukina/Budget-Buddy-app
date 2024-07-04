import React from 'react';
import {StyleSheet, View, Text, Dimensions, FlatList} from 'react-native';
import moment from 'moment';
import IconMapper from '../IconsMapper/IconMapper';
import SavingsGoal from '../accounts/SavingsGoal/SavingsGoal';
import CustomButton from '../buttons/CustomButton';
import New from 'react-native-vector-icons/Ionicons';

interface TransactionTableProps {
  transactions: any[];
  accountId: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  accountId,
  transactions,
}) => {
  const {width} = Dimensions.get('window');
  const tableHead = ['', '', 'Amount', 'Balance'];

  const formatDate = (date: string) => {
    return moment(date).format('YY-MM-DD');
  };

  const moneyBoxTransaction = transactions.find(
    transaction => transaction.tag === 'moneyBox',
  );

  const initialAmount = moneyBoxTransaction
    ? Math.abs(moneyBoxTransaction.amount)
    : 0;

  const renderItem = ({item}: {item: any}) => (
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
    </View>
  );

  return (
    <View style={styles.container}>
      <SavingsGoal accountId={accountId} initialAmount={initialAmount} />

      <View style={styles.headerTitle}>
        <Text style={styles.heading}>Transaction</Text>

        <CustomButton
          icon={<New name="add" size={30} color="#cf7041" />}
          onPress={() => console.log('click')}
          backgroundColor="#f6f6f5"
        />
      </View>

      <View>
        <View style={styles.tableHeader}>
          {tableHead.map((title, index) => (
            <Text
              key={index}
              style={[styles.headerText, {width: width / tableHead.length}]}>
              {title}
            </Text>
          ))}
        </View>
        <View style={styles.container}>
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.dataWrapper}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f5',
    marginBottom: 10,
    flex: 1,
    width: '100%',
  },
  heading: {
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
  icon: {
    width: 30,
  },
});

export default TransactionTable;
