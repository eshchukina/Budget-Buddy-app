import React from 'react';
import { View, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <RootNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f5', 
  },
});

export default App;
