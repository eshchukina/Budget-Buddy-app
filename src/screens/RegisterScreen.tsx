import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import Header from '../text/Header';
import Back from 'react-native-vector-icons/Ionicons';

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

  const handleRegistration = async () => {
    const newUser = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}user`,
        newUser,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('response', response);
      if (response.status === 200) {
        console.log('Registration successful');
        setPassword('');
        setEmail('');
        setName('');
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#b4bfc5"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          placeholderTextColor="#b4bfc5"
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button
          text="регистарция"
          color="#b4bfc5"
          padding={10}
          onPress={handleRegistration}
        />
      </View>
      <View>
        <Text style={styles.text}>У вас уже есть аккаунт?</Text>
        <Button
          text=" Авторизоваться здесь"
          color="transparent"
          padding={10}
          onPress={goToLogin}
        />
      </View>
    </View>
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
});

export default RegisterScreen;
