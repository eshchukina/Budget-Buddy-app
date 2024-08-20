import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomButton from '../buttons/CustomButton';
import Delete from 'react-native-vector-icons/AntDesign';
import Edit from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import CurrencyIcon from '../../utils/additionalComponent/CurrencyIcon';
import {fetchTransactions} from '../../api/accountService.';

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
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  onEdit: (id: number) => void;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  selectedAccountId: number | null;
  setSelectedAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  length: number;
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
  length,
}) => {
  const {t} = useTranslation();

  const fetchAndSetTransactions = async () => {
    await fetchTransactions({
      accountId: account.id,
      setAccountId,
      setSelectedAccountId,
      setTransactions,
    });
    setCurrency(account.currency);
  };

  const cardStyle = length === 1 ? styles.singleCard : styles.card;
  const cardWrapper =
    selectedAccountId === account.id ? styles.selectedCard : styles.cardTitle;

  return (
    <TouchableOpacity style={cardStyle} onPress={fetchAndSetTransactions}>
      <View style={styles.wrapper}>
        <View style={styles.wrapperBalance}>
          <View style={styles.wrapperHeader}>
            <Text style={cardWrapper}>
              {account.name} {account.currency}
            </Text>
          </View>
          <View style={styles.wrapperTitle}>
            <Text style={styles.cardText}>{t('cbalance')}</Text>
            <Text style={styles.cardTitle}> {account.currentBalance}</Text>
          </View>
          <View style={styles.wrapperTitle}>
            <Text style={styles.cardText}>{t('fbalance')}</Text>
            <Text style={styles.cardTitle}> {account.futureBalance}</Text>
          </View>
        </View>
        <View style={styles.wrapperCurency}>
          <CurrencyIcon currency={account.currency} />
        </View>
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
    width: 260,
    height: 150,
    shadowColor: '#5e718b',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.21,
    shadowRadius: 6.65,
    elevation: 9,
  },
  singleCard: {
    backgroundColor: '#b4bfc5',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    width: 300,
    height: 160,
    shadowColor: '#5e718b',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.21,
    shadowRadius: 6.65,
    elevation: 9,
  },
  cardText: {
    color: '#5e718b',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
  },
  cardTitle: {
    color: '#5e718b',
    fontSize: 15,
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
    paddingBottom: 5,
    paddingTop: 5,
    alignItems: 'center',
  },
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedCard: {
    color: '#cf7041',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    textAlign: 'center',
  },
  wrapperCurency: {
    alignItems: 'center',
    width: '20%',
  },
  wrapperBalance: {
    width: '80%',
  },
});

export default AccountCard;
