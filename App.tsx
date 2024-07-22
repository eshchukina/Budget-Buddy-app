import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import {BooleanProvider} from './src/context/ClobalProvider';
import {AppProvider} from './src/context/FunctionContext';
import SplashScreen from 'react-native-splash-screen';

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.container}>
      <BooleanProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </BooleanProvider>
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
