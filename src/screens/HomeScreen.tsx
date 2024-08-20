import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import SideBar from '../components/sideBar/SideBar';
import AccountDetails from '../components/account/AccountDetails';

import TransactionTable from '../components/modal/TransactionTable';
import SavingsGoal from '../components/savingsGoal/SavingsGoal';
import Overlay from '../utils/additionalComponent/Overlay';
import DetailsScreen from './DetailsScreen';
import CustomButton from '../components/buttons/CustomButton';
import Menu from 'react-native-vector-icons/Feather';
import Home from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import Change from 'react-native-vector-icons/MaterialIcons';
import Cahrt from 'react-native-vector-icons/Fontisto';
const screenWidth = Dimensions.get('window').width;

const HomeScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [currency, setCurrency] = useState('');
  const [amounts, setAmounts] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [monthlyAmounts, setMonthlyAmounts] = useState<
    {month: string; amount: number}[]
  >([]);
  const {t} = useTranslation();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showNotInfo, setShowNotInfo] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      const timer = setTimeout(() => {
        setShowNotInfo(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowNotInfo(false);
    }
  }, [transactions]);

  useEffect(() => {
    const monthAbbreviations: {[key: string]: string} = {
      '01': 'j',
      '02': 'f',
      '03': 'm',
      '04': 'a',
      '05': 'm',
      '06': 'j',
      '07': 'j',
      '08': 'a',
      '09': 's',
      '10': 'o',
      '11': 'n',
      '12': 'd',
    };

    const allMonths = Array.from({length: 12}, (_, index) =>
      moment().startOf('year').add(index, 'month').format('YYYY-MM'),
    );

    const monthlyTotals: {[key: string]: number} = {};

    const filteredTransactions = transactions.filter(
      transaction => transaction.tag !== 'salary',
    );

    filteredTransactions.forEach(transaction => {
      const month = moment(transaction.date).format('YYYY-MM');
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += Math.abs(transaction.amount);
    });

    const updatedMonthlyAmounts = allMonths.map(month => {
      const monthNumber = moment(month, 'YYYY-MM').format('MM');
      return {
        month: monthAbbreviations[monthNumber] || '',
        amount: monthlyTotals[month] || 0,
      };
    });

    setMonthlyAmounts(updatedMonthlyAmounts);
  }, [transactions]);

  const drawerTranslateX = useRef(new Animated.Value(-screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const toggleDrawerRight = () => {
    setTimeout(() => {
      setIsDrawerOpen(!isDrawerOpen);
    }, 0);
  };

  useEffect(() => {
    Animated.timing(drawerTranslateX, {
      toValue: isDrawerOpen ? 0 : -screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [drawerTranslateX, fadeAnim, isDrawerOpen]);

  useEffect(() => {
    let totalAmount = transactions.reduce((total, transaction) => {
      if (transaction.tag === 'moneyBox') {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    setSavingsGoalAmount(Math.abs(totalAmount));
  }, [transactions]);

  useEffect(() => {
    const filteredTransactions = transactions.filter(
      transaction => transaction.tag !== 'salary',
    );

    const amounts = filteredTransactions.map(transaction => {
      return transaction.amount < 0 ? -transaction.amount : transaction.amount;
    });
    const tags = filteredTransactions.map(transaction => transaction.tag);

    setAmounts(amounts);
    setTags(tags);
  }, [transactions, accountId]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomButton
          icon={<Menu name="align-left" size={30} color="#96aa9a" />}
          onPress={toggleDrawerRight}
        />

        <View style={styles.headerWrappper}>
          {showDetails ? (
            <CustomButton
              icon={<Home name="home" size={30} color="#96aa9a" />}
              onPress={toggleDetails}
            />
          ) : (
            <>
              <CustomButton
                icon={<Cahrt name="pie-chart-2" size={30} color="#96aa9a" />}
                onPress={toggleDetails}
              />
            </>
          )}

          <CustomButton
            icon={<Change name="currency-exchange" size={30} color="#96aa9a" />}
            onPress={() => setCurrencyModalVisible(true)}
          />
        </View>
      </View>
      <AccountDetails
        toggleSideBar={toggleDrawer}
        setAccountId={setAccountId}
        setTransactions={setTransactions}
        currencyModalVisible={currencyModalVisible}
        setCurrencyModalVisible={setCurrencyModalVisible}
        setCurrency={setCurrency}
        setAccounts={setAccounts}
        accounts={accounts}
        transactions={transactions}
      />

      {showDetails ? (
        <View style={styles.containerChart}>
          <ScrollView>
            {transactions.length !== 0 ? (
              <DetailsScreen
                amounts={amounts}
                tags={tags}
                accountId={accountId}
                monthlyAmounts={monthlyAmounts}
                currency={currency}
              />
            ) : (
              <View style={styles.textContainer}>
                {showNotInfo ? (
                  <Text style={styles.title}>{t('notInfo')}</Text>
                ) : (
                  <ActivityIndicator size="large" color="#96aa9a" />
                )}
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <>
          {Array.isArray(accounts) && accounts.length > 0 ? (
            <TransactionTable
              accountId={accountId}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          ) : (
            <View style={styles.imageContainer}>
              {showNotInfo ? (
                <>
                  <Text style={styles.title}>{t('main')}</Text>
                  <Image
                    source={require('../../assets/logo/logo4.png')}
                    style={{width: 250, height: 270}}
                  />
                </>
              ) : (
                <ActivityIndicator size="large" color="#96aa9a" />
              )}
            </View>
          )}

          {Array.isArray(transactions) && transactions.length !== 0 ? (
            <SavingsGoal
              currency={currency}
              accountId={accountId}
              initialAmount={savingsGoalAmount}
            />
          ) : (
            <View></View>
          )}
        </>
      )}

      <Animated.View
        style={[
          styles.drawer,
          {transform: [{translateX: drawerTranslateX}]},
          {opacity: fadeAnim},
        ]}>
        <SideBar onClose={closeDrawer} />
      </Animated.View>

      {isDrawerOpen && <Overlay onPress={toggleDrawerRight} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerChart: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#f6f6f5',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerWrappper: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
  },
  drawer: {
    backgroundColor: '#5e718b',
    zIndex: 2000,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 240,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#b4bfc5',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
  textContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageContainer: {
    alignItems: 'center',
    height: '70%',
  },
});

export default HomeScreen;
