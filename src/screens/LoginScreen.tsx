import React, {useState, useEffect, useCallback} from 'react';
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
import Button from '../components/buttons/Buttons';
import Header from '../components/header/Header';
import {validateEmail, validatePassword} from '../utils/validation';
import Eye from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../provider/AuthProvider';
import ModalInfo from '../components/modal/ModalInfo';

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
  const {login} = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const showWelcomeModal = async () => {
      const hasShownWelcome = await AsyncStorage.getItem('hasShownWelcome');
      if (!hasShownWelcome) {
        setIsModalVisible(true);
        await AsyncStorage.setItem('hasShownWelcome', 'true');
      }
    };

    showWelcomeModal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setPasswordError('');
      setErrorText('');
    }, []),
  );

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
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

      if (response.status === 200 || response.status === 201) {
        const {accessToken, refreshToken, expires_in, id, name} = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('expiresIn', expires_in.toString());
        await AsyncStorage.setItem('accountId', id.toString());
        await AsyncStorage.setItem('name', name);

        login(accessToken);
        console.log(response.status)
   
      } else {
        setErrorText('Invalid email or password. Please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorText('Error occurred during login. Please try again later');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
        <ModalInfo
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
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
    color: '#000',
    marginBottom: 10,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
});

export default LoginScreen;
