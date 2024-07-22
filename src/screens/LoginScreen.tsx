import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
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
import Eye from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';

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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    const requestNewTokenIfNeeded = async () => {
      const expiresIn = await AsyncStorage.getItem('expiresIn');
      if (expiresIn) {
        const expirationTime = parseInt(expiresIn, 10);
        if (Date.now() >= expirationTime) {
          await refreshToken();
        }
        const timeUntilExpiration = expirationTime - Date.now();
        const timerId = setTimeout(refreshToken, timeUntilExpiration - 60000);
        return () => clearTimeout(timerId);
      }
    };

    requestNewTokenIfNeeded();
  }, []);

  const refreshToken = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        const response = await axios.post(
          `${REACT_APP_API_URL_PRODUCTION}refresh`,
          {refreshToken: storedRefreshToken},
        );

        if (response.status === 200) {
          const {accessToken, refreshToken, expires_in} = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          await AsyncStorage.setItem(
            'expiresIn',
            (Date.now() + expires_in * 1000).toString(),
          );
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
        {email, password},
      );

      if (response.status === 200) {
        const {accessToken, refreshToken, expires_in, id, name} = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem(
          'expiresIn',
          (Date.now() + expires_in * 1000).toString(),
        );
        await AsyncStorage.setItem('accountId', id.toString());
        await AsyncStorage.setItem('name', name);

        navigation.navigate('Home');
      } else {
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
          <Header text={t('login')} color="#e5c5bd" size={24} />
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#b4bfc5"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#b4bfc5"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Eye
                name={passwordVisible ? 'eye-with-line' : 'eye'}
                size={30}
                color="#e5c5bd"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          <Button
            text={t('loginButton')}
            color="#b4bfc5"
            padding={10}
            onPress={handleLogin}
          />
        </View>

        <View>
          <Text style={styles.text}>{t('haveAccount')}</Text>
          <Button
            text={t('registerHere')}
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
    paddingBottom: 30,
    paddingTop: 20,
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
    paddingLeft: 20,
  },
  input: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#cf7041',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#cf7041',
    width: '80%',
    marginVertical: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
  },
  text: {
    textAlign: 'center',
    color: '#5e718b',
    fontFamily: 'Montserrat-Medium',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat-Medium',
  },
});

export default LoginScreen;
