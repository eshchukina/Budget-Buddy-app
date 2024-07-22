import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAppFirstOpened, setIsAppFirstOpened] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const checkFirstOpen = async () => {
      try {
        const value = await AsyncStorage.getItem('isAppFirstOpened');
        setIsAppFirstOpened(value !== 'false');
      } catch (error) {
        console.error('Error fetching from AsyncStorage:', error);
        setIsAppFirstOpened(true);
      }
    };

    checkFirstOpen();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };

    if (isAppFirstOpened === false) {
      checkAuth();
    }
  }, [isAppFirstOpened]);

  const finishWelcomeScreen = () => {
    AsyncStorage.setItem('isAppFirstOpened', 'false');
    setIsAppFirstOpened(false);
  };

  if (isAppFirstOpened === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}></View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        initialRouteName={
          isAppFirstOpened ? 'Welcome' : isAuthenticated ? 'Home' : 'Login'
        }>
        <Stack.Screen name="Welcome">
          {props => <WelcomeScreen {...props} onFinish={finishWelcomeScreen} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
