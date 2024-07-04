import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import CustomButton from '../../buttons/CustomButton';
import Edit from 'react-native-vector-icons/Entypo';
import Coin from 'react-native-vector-icons/FontAwesome5';
import GoalModal from './GoalModal';

interface SavingsGoalProps {
  initialAmount: number;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({
  initialAmount,
  accountId,
}) => {
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [savedAmount, setSavedAmount] = useState<number>(initialAmount);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSave = () => {
    const parsedGoal = parseFloat(goalAmount);
    if (!isNaN(parsedGoal) && parsedGoal >= 0) {
      setSavedAmount(parsedGoal);
      setIsModalVisible(false);
    }
    console.log(savedAmount);
  };

  const remainingAmount =
    goalAmount !== '' ? parseFloat(goalAmount) - initialAmount : 0;
  const screenWidth = Dimensions.get('window').width;
  const halfScreenWidth = screenWidth / 2;
  console.log(goalAmount);
  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.heading}>Money Box</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.progressNumber}>
          <Text style={styles.summaryText}>Saved: ${initialAmount}</Text>

          <Coin name="coins" size={20} color="#e2a55e" />
          <Text style={styles.summaryText}>
            Remaining to save: ${remainingAmount.toFixed(0)}
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
        {goalAmount && <Text style={styles.summaryText}>{goalAmount}$</Text>}
        <CustomButton
          icon={<Edit name="edit" size={30} color="#96aa9a" />}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  summaryContainer: {
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5e718b',
  },
  headerTitle: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryText: {
    fontSize: 16,
  },
  progressNumber: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
});

export default SavingsGoal;
