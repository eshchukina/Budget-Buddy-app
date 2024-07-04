import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import SideBar from '../SideBar/SideBar';
import AccountDetails from '../accounts/AccountDetails';
import TransactionTable from '../Tables/TransactionTable';

const HomeScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
    console.log('saef');
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <AccountDetails
          toggleSideBar={toggleSideBar}
          setAccountId={setAccountId}
          setTransactions={setTransactions}
        />
        <TransactionTable accountId={accountId} transactions={transactions} />
        <SideBar isOpen={isSideBarOpen} onClose={toggleSideBar} />
      </View>
    </ScrollView>
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
