import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import Header from '../text/Header';
import CustomButton from '../buttons/CustomButton';
import Back from 'react-native-vector-icons/Ionicons';
import {validateEmail, validatePassword} from '../utils/validation';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC<{navigation: LoginScreenNavigationProp}> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const requestNewTokenIfNeeded = async () => {
      try {
        const expiresIn = await AsyncStorage.getItem('expiresIn');

        if (expiresIn) {
          const expirationTime = parseInt(expiresIn, 10);

          if (Date.now() >= expirationTime) {
            await refreshToken();
          }
        }
      } catch (error) {
        console.error('Error handling token expiration:', error);
      }
    };
    console.log('refresh');
    requestNewTokenIfNeeded();
  }, []);

  const refreshToken = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedRefreshToken) {
        const response = await axios.post(
          `${REACT_APP_API_URL_PRODUCTION}refresh`,
          {
            refreshToken: storedRefreshToken,
          },
        );

        if (response.status === 200) {
          const {accessToken, refreshToken, expires_in} = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          await AsyncStorage.setItem('expiresIn', expires_in.toString());
        } else {
          console.log('Token refresh failed');
        }
      } else {
        console.log('Refresh token is missing');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 6 characters long and include at least one number and one letter',
      );
      return;
    } else {
      setPasswordError('');
    }

    try {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}authorization`,
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('accountId', response.data.id.toString());
        await AsyncStorage.setItem(
          'expiresIn',
          response.data.expires_in.toString(),
        );
        await AsyncStorage.setItem('name', response.data.name);
        await AsyncStorage.setItem('email', response.data.email);

        navigation.navigate('Home');
      } else {
        console.log('Login failed');
        setErrorText('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorText('Error occurred during login. Please try again later.');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <CustomButton
            icon={<Back name="chevron-back" size={30} color="#96aa9a" />}
            onPress={() => navigation.navigate('Home')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Header text="Login Screen" color="#e5c5bd" size={24} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#b4bfc5"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#b4bfc5"
            secureTextEntry
            autoCapitalize="none"
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          <Button
            text="Login"
            color="#b4bfc5"
            padding={10}
            onPress={handleLogin}
          />
        </View>

        <View>
          <Text style={styles.text}>Don't have an account? </Text>
          <Button
            text="Register here"
            color="transparent"
            padding={10}
            onPress={goToRegister}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6f6f5',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  input: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#cf7041',
  },
  text: {
    color: '#5e718b',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#5e718b',
    fontSize: 9,
    textAlign: 'center',
    bottom: 10,
  },
});

export default LoginScreen;
