import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import CustomButton from '../../buttons/CustomButton';
import Edit from 'react-native-vector-icons/Entypo';
import Coin from 'react-native-vector-icons/FontAwesome5';
import GoalModal from './GoalModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyIcon from '../../utils/CurrencyIcon';
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
  const [goalReached, setGoalReached] = useState<boolean>(false);

  useEffect(() => {
    const parsedGoal = parseFloat(goalAmount);
    if (!isNaN(parsedGoal) && initialAmount >= parsedGoal) {
      setGoalReached(true);
    } else {
      setGoalReached(false);
    }
  }, [goalAmount, initialAmount]);

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
          <Text style={styles.summaryText}>
            {t('saved')} {initialAmount}{' '}
            <CurrencyIcon currency={currency} size={15} />{' '}
          </Text>
          <Coin name="coins" size={25} color="#e2a55e" />
          <Text style={styles.summaryText}>
            {t('remaining')} {remainingAmount.toFixed(0)}{' '}
            <CurrencyIcon currency={currency} size={15} />
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
        {goalAmount && (
          <Text style={styles.summaryText}>
            {goalAmount} <CurrencyIcon currency={currency} size={15} />
          </Text>
        )}
        <CustomButton
          icon={<Edit name="edit" size={25} color="#96aa9a" />}
          onPress={() => setIsModalVisible(true)}
        />
      </View>
      {goalReached && (
        <View style={styles.congratulationContainer}>
          <Text style={styles.congratulationText}>{t('goalReached')}</Text>
        </View>
      )}
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
    fontFamily: 'Montserrat-Bold',
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
    color: '#5e718b',
    fontFamily: 'Montserrat-Medium',
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
  congratulationContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  congratulationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e2a55e',
    fontFamily: 'Montserrat-Bold',
  },
});

export default SavingsGoal;
