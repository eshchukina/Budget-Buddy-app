import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import moment from 'moment';
import IconMapper from '../IconsMapper/IconMapper';
import CustomButton from '../buttons/CustomButton';
import Delete from 'react-native-vector-icons/AntDesign';


interface TransactionItemProps {
  item: any;
  handleEditTransaction: (transaction: any) => void;
  confirmDeleteTransaction: (transactionId: string) => void;
  formatDate: (date: string) => string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  item,
  handleEditTransaction,
  confirmDeleteTransaction,
  formatDate,
}) => {
  const {width} = Dimensions.get('window');
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
          backgroundColor={isFutureDate ? '#f6f6f5' : '#e5c5bd00'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

    pastTransaction: {
      backgroundColor: '#e5c5bd50',
    },
  });
  
export default TransactionItem;
