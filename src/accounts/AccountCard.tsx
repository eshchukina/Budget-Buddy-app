import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import CustomButton from '../buttons/CustomButton';
import Delete from 'react-native-vector-icons/AntDesign';
import Edit from 'react-native-vector-icons/FontAwesome';
import Active from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';

interface AccountCardProps {
  account: {
    id: number;
    name: string;
    currency: string;
    currentBalance: number;
    futureBalance: number;
  };
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  handleDelete: (id: number) => void;
  setAccountId: React.Dispatch<React.SetStateAction<string>>;
  onEdit: (id: number) => void;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  selectedAccountId: any;
  setSelectedAccountId: any;
}

const AccountCard: React.FC<AccountCardProps> = ({
  handleDelete,
  setAccountId,
  onEdit,
  account,
  setTransactions,
  setCurrency,
  selectedAccountId,
  setSelectedAccountId,
}) => {
  const {t} = useTranslation();

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
        `${REACT_APP_API_URL_PRODUCTION}transactions/accounts/${account.id}/statement`,
        {
          headers: headersWithToken,
        },
      );

      setAccountId(account.id);
      setCurrency(account.currency);
      setSelectedAccountId(account.id);

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

  return (
    <TouchableOpacity style={styles.card} onPress={fetchTransactions}>
      <View style={styles.wrapperHeader}>
        <Text style={styles.cardTitle}>
          {' '}
          {account.name} {account.currency}
        </Text>
        {selectedAccountId === account.id && (
          <Active name="radio-btn-active" size={15} color="#f6f6f5" />
        )}
      </View>
      <View style={styles.wrapperTitle}>
        <Text style={styles.cardText}>{t('cbalance')}</Text>
        <Text style={styles.cardTitle}> {account.currentBalance}</Text>
      </View>

      <View style={styles.wrapperTitle}>
        <Text style={styles.cardText}>{t('fbalance')}</Text>
        <Text style={styles.cardTitle}> {account.futureBalance}</Text>
      </View>
      <View style={styles.buttons}>
        <CustomButton
          icon={<Edit name="edit" size={23} color={'#cf7041'} />}
          onPress={() => onEdit(account.id)}
          backgroundColor={'#b4bfc5'}
        />
        <CustomButton
          icon={<Delete name="delete" size={23} color="#cf7041" />}
          onPress={() => handleDelete(account)}
          backgroundColor={'#b4bfc5'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b4bfc5',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    width: 170,
    height: 150,
  },
  cardText: {
    color: '#5e718b',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  cardTitle: {
    color: '#5e718b',
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  wrapperTitle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: '#5e718b',
  },
});

export default AccountCard;
