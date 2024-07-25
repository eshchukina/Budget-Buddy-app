import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import {AuthProvider} from './src/provider/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken} from './src/api/tokenService';

const App: React.FC = () => {
  const [refreshIntervalId, setRefreshIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        await refreshToken(setRefreshIntervalId);
      }
    };

    checkTokenAndRefresh();

    return () => {
      if (refreshIntervalId) {
        clearTimeout(refreshIntervalId);
      }
    };
  }, [refreshIntervalId]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={styles.container}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
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
