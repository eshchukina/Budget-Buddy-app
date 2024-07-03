import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import moment from 'moment';

interface TransactionTableProps {
  transactions: any[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({transactions}) => {
  const formatDate = (date: string) => {
    return moment(date).format('YYYY-MM-DD');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{formatDate(item.date)}</Text>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
            <Text style={styles.cell}>{item.balance}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Description</Text>
            <Text style={styles.headerText}>Amount</Text>
            <Text style={styles.headerText}>Balance</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: 200,
    flex:1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  cell: {
    fontSize: 12,
    color: '#333333',
  },
});

export default TransactionTable;
