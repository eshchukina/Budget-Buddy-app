import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import Button from '../buttons/Buttons';
import Header from '../text/Header';
import CustomButton from '../buttons/CustomButton';
import Back from 'react-native-vector-icons/Ionicons';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC<{navigation: LoginScreenNavigationProp}> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL_PRODUCTION}authorization`,
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        console.log(response.data.id);
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('accountId', response.data.id.toString());
        console.log('Login successful');
        console.log(response.data);
        setPassword('');
        setEmail('');
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
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
        <Header text="Login Screen" color="#e5c5bd" size={24} />
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
          text="авторизация"
          color="#b4bfc5"
          padding={10}
          onPress={handleLogin}
        />
      </View>

      <View>
        <Text style={styles.text}>У вас нет учетной записи? </Text>
        <Button
          text=" Зарегистрируйтесь здесь"
          color="transparent"
          padding={10}
          onPress={goToRegister}
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
});

export default LoginScreen;
