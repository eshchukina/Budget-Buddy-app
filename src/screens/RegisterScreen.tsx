import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import Header from '../text/Header';
import Back from 'react-native-vector-icons/Ionicons';
import Eye from 'react-native-vector-icons/Entypo';

import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';
import CustomButton from '../buttons/CustomButton';
import {useTranslation} from 'react-i18next';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen: React.FC<{navigation: RegisterScreenNavigationProp}> = ({
  navigation,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [errorText, setErrorText] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {t} = useTranslation();

  const handleRegistration = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setErrorText('');

    if (!validateName(name)) {
      setNameError(
        'Name should be at least 2 characters long and contain only letters',
      );
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 6 characters and contain at least one number and one letter.',
      );
      return;
    }

    const newUser = {name, email, password};

    try {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}user`,
        newUser,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.status === 200) {
        setPassword('');
        setEmail('');
        setName('');

        navigation.navigate('Login');
      } else {
        setErrorText('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorText(
        'Error occurred during registration. Please try again later.',
      );
      console.error('Error:', error);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
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
          <Header text={t('register')} color="#e5c5bd" size={24} />

          <TextInput
            style={styles.input}
            placeholder="name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#b4bfc5"
            autoCapitalize="none"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
              placeholderTextColor="#b4bfc5"
              onChangeText={setPassword}
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
            text={t('registerButton')}
            color="#b4bfc5"
            padding={10}
            onPress={handleRegistration}
          />
        </View>
        <View>
          <Text style={styles.text}>{t('alreadyHaveAccount')}</Text>
          <Button
            text={t('loginHere')}
            color="transparent"
            padding={10}
            onPress={goToLogin}
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
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    flex: 1,
  },
  text: {
    color: '#5e718b',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  errorText: {
    color: '#5e718b',
    fontSize: 9,
    textAlign: 'center',
    bottom: 10,
    fontFamily: 'Montserrat-Medium',
  },
});

export default RegisterScreen;
