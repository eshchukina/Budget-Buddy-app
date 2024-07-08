import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import Header from '../text/Header';
import Back from 'react-native-vector-icons/Ionicons';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';

import CustomButton from '../buttons/CustomButton';

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

  const handleRegistration = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setErrorText('');

    if (!validateName(name)) {
      setNameError(
        'Invalid name. Name should be at least 2 characters long and contain only letters',
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
          <Header text="Register Screen" color="#e5c5bd" size={24} />

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#b4bfc5"
            autoCapitalize="none"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
            placeholderTextColor="#b4bfc5"
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

          <Button
            text="Register"
            color="#b4bfc5"
            padding={10}
            onPress={handleRegistration}
          />
        </View>
        <View>
          <Text style={styles.text}>Already have an account?</Text>
          <Button
            text="Login here"
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
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

export default RegisterScreen;
