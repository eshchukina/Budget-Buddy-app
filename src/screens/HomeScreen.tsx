import React, {useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import AccountDetails from '../accounts/AccountDetails';
import TransactionTable from '../Tables/TransactionTable';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [transactions, setTransactions] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <AccountDetails setTransactions={setTransactions} />
      <TransactionTable transactions={transactions} />

      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f5',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default HomeScreen;
