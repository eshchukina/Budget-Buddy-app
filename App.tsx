import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import { AuthProvider } from './src/provider/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshTokenGet } from './src/api/tokenService';


const App: React.FC = () => {
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null);


  const setupRefreshInterval = async (refreshTime: number) => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }
 
    const intervalId = setInterval(async () => {
      const refreshSuccess = await refreshTokenGet();
      if (refreshSuccess) {
        const newExpires = await AsyncStorage.getItem('expiresIn');
        if (newExpires) {
          const newExpiresInMilliseconds = parseInt(newExpires, 10);
          const newCurrentTime = Date.now();
          let newRefreshTime = newExpiresInMilliseconds - newCurrentTime - 5 * 60 * 1000;
          newRefreshTime = Math.max(newRefreshTime, 60000);
 
          console.log('Updated timeLeft:', newRefreshTime);
    
          clearInterval(intervalId);
          setupRefreshInterval(newRefreshTime);
        }
      } else {
        console.error('Token refresh failed');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('expiresIn');
      }
    }, refreshTime);
 
    setRefreshIntervalId(intervalId);
  };
 


  useEffect(() => {
    const initializeTokenRefresh = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const expires = await AsyncStorage.getItem('expiresIn');


        if (expires) {
          const expiresInMilliseconds = parseInt(expires, 10);
          const currentTime = Date.now();


          let refreshTime = expiresInMilliseconds - currentTime - 5 * 60 * 1000;
          refreshTime = Math.max(refreshTime, 60000);
          console.log('Initial timeLeft:', refreshTime);
          setupRefreshInterval(refreshTime);
        } else {
          console.error('Expiration time is missing');
        }
      }
    };


    initializeTokenRefresh();


    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, []);


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