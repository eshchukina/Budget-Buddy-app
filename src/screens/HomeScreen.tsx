import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import SideBar from '../SideBar/SideBar';
import AccountDetails from '../accounts/AccountDetails';
import TransactionTable from '../Tables/TransactionTable';
import SavingsGoal from '../accounts/SavingsGoal/SavingsGoal';
import Overlay from '../utils/Overlay';
const screenWidth = Dimensions.get('window').width;

const HomeScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(0);

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
  }, [isDrawerOpen]);

  useEffect(() => {
    let totalAmount = transactions.reduce((total, transaction) => {
      if (transaction.tag === 'moneyBox') {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    setSavingsGoalAmount(Math.abs(totalAmount));
  }, [transactions]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={isDrawerOpen ? closeDrawer : null}>
        <View style={{flex: 1, width: '100%'}}>
          <AccountDetails
            toggleSideBar={toggleDrawer}
            setAccountId={setAccountId}
            setTransactions={setTransactions}
          />
          <SavingsGoal
            accountId={accountId}
            initialAmount={savingsGoalAmount}
          />
          <TransactionTable
            accountId={accountId}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </View>
      </TouchableWithoutFeedback>
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
    paddingBottom: 50,
    paddingTop: 20,
  },
  drawer: {
    backgroundColor: '#f6f6f5',
    paddingTop: 20,
    zIndex: 200,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 240,
  },
});

export default HomeScreen;
