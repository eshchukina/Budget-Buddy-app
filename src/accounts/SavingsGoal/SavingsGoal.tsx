import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import CustomButton from '../../buttons/CustomButton';
import Edit from 'react-native-vector-icons/Entypo';
import Coin from 'react-native-vector-icons/FontAwesome5';
import GoalModal from './GoalModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Usd from 'react-native-vector-icons/FontAwesome';
import EUR from 'react-native-vector-icons/FontAwesome';
import GBP from 'react-native-vector-icons/FontAwesome';
import GEL from 'react-native-vector-icons/FontAwesome6';
import TRY from 'react-native-vector-icons/FontAwesome';
import RUB from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';


interface SavingsGoalProps {
  initialAmount: number;
  accountId: string;
  currency: string;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({
  initialAmount,
  accountId,
  currency,
}) => {
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    const loadGoalAmount = async () => {
      try {
        let storedGoalAmount = await AsyncStorage.getItem(
          `goalAmount_${accountId}`,
        );
        if (storedGoalAmount !== null) {
          setGoalAmount(storedGoalAmount);
        } else {
          setGoalAmount('1000');
          await AsyncStorage.setItem(`goalAmount_${accountId}`, '1000');
        }
      } catch (error) {
        console.error('Error loading goal amount:', error);
      }
    };

    loadGoalAmount();
  }, [accountId]);

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD':
        return <Usd name="usd" size={15} color="#5e718b" />;
      case 'EUR':
        return <EUR name="eur" size={15} color="#5e718b" />;
      case 'GBP':
        return <GBP name="gbp" size={15} color="#5e718b" />;
      case 'GEL':
        return <GEL name="lari-sign" size={15} color="#5e718b" />;
      case 'TRY':
        return <TRY name="try" size={15} color="#5e718b" />;
      case 'RUB':
        return <RUB name="rub" size={15} color="#5e718b" />;
      default:
        return null;
    }
  };

  const saveGoalAmount = async (amount: string) => {
    try {
      await AsyncStorage.setItem(`goalAmount_${accountId}`, amount);
    } catch (error) {
      console.error('Error saving goal amount:', error);
    }
  };

  const handleSave = () => {
    const parsedGoal = parseFloat(goalAmount);
    if (!isNaN(parsedGoal) && parsedGoal >= 0) {
      saveGoalAmount(goalAmount);
      setIsModalVisible(false);
    }
  };

  const remainingAmount =
    goalAmount !== '' ? parseFloat(goalAmount) - initialAmount : 0;
  const screenWidth = Dimensions.get('window').width;
  const halfScreenWidth = screenWidth / 2;

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>{t('moneBox')}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.progressNumber}>
          <Text style={styles.summaryText}>{t('saved')} {initialAmount} {getCurrencyIcon(currency)}</Text>
          <Coin name="coins" size={25} color="#e2a55e" />
          <Text style={styles.summaryText}>
          {t('remaining')} {remainingAmount.toFixed(0) } {getCurrencyIcon(currency)}
          </Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={goalAmount ? initialAmount / parseFloat(goalAmount) : 0}
          width={halfScreenWidth}
          animated={true}
          color={'#e5c5bd'}
          height={10}
          borderRadius={10}
        />
        {goalAmount && <Text style={styles.summaryText}>{goalAmount} {getCurrencyIcon(currency)}</Text>}
        <CustomButton
          icon={<Edit name="edit" size={25} color="#96aa9a" />}
          onPress={() => setIsModalVisible(true)}
        />
      </View>
      <GoalModal
        visible={isModalVisible}
        goalAmount={goalAmount}
        setGoalAmount={setGoalAmount}
        onSave={handleSave}
        onClose={() => setIsModalVisible(false)}
      />
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  summaryContainer: {
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    color: '#5e718b',
    fontFamily: "Montserrat-Bold"
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '100%',
  },
  summaryText: {
    fontSize: 15,
    color:"#5e718b",
    fontFamily: "Montserrat-Medium"
  },
  progressNumber: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  currencyIcon: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default SavingsGoal;
