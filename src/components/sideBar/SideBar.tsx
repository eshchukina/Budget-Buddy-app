import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, Linking} from 'react-native';
import CustomButton from '../buttons/CustomButton';
import Feedback from 'react-native-vector-icons/MaterialIcons';
import Mail from 'react-native-vector-icons/Entypo';
import TextD from 'react-native-vector-icons/Ionicons';
import Info from 'react-native-vector-icons/FontAwesome6';
import Share from 'react-native-vector-icons/FontAwesome5';
import Exit from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import i18n from '../../translation/i18n';
import ToggleSwitch from 'toggle-switch-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shareApp from '../../utils/shareApp';
import reviewPage from '../../utils/reviewApp';
import sendEmail from '../../utils/sendEmail';
import ModalInfo from '../modal/ModalInfo';
import {useAuth} from '../../provider/AuthProvider';

interface SideBarProps {
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({}) => {
  const {t} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const {logout} = useAuth();
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const loadSwitchState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('languageSwitch');
        if (storedState !== null) {
          const newState = JSON.parse(storedState);
          setIsEnabled(newState);
          const newLang = newState ? 'en' : 'ru';
          i18n.changeLanguage(newLang);
        } else {
          i18n.changeLanguage('en');
        }
      } catch (error) {
        console.error('Failed to load switch state', error);
      }
    };

    loadSwitchState();
  }, []);

  const toggleSwitch = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    const newLang = newState ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
    try {
      await AsyncStorage.setItem('languageSwitch', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save switch state', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleButtonPress = () => {
    const url =
      'https://www.freeprivacypolicy.com/live/0e98da1d-0096-4437-b41a-9f3a8500c03d';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo/splash_screen.png')}
          style={{width: 160, height: 170}}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.text}>ru</Text>
        <ToggleSwitch
          isOn={isEnabled}
          onColor="#b4bfc5"
          offColor="#b4bfc5"
          thumbOnStyle={styles.thumbOnStyle}
          thumbOffStyle={styles.thumbOffStyle}
          size="medium"
          onToggle={toggleSwitch}
        />

        <Text style={styles.text}>en</Text>
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<Feedback name="feedback" size={30} color="#e2a55e" />}
          onPress={reviewPage}
          backgroundColor="#5e718b"
          text={t('feedback')}
        />
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<Mail name="mail" size={30} color="#e2a55e" />}
          onPress={sendEmail}
          backgroundColor="#5e718b"
          text={t('sendUs')}
        />
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<Share name="share-alt" size={30} color="#e2a55e" />}
          onPress={shareApp}
          backgroundColor="#5e718b"
          text={t('share')}
        />
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<TextD name="document-text" size={30} color="#e2a55e" />}
          onPress={handleButtonPress}
          backgroundColor="#5e718b"
          text="politic privacy"
        />
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<Info name="circle-info" size={30} color="#e2a55e" />}
          onPress={openModal}
          backgroundColor="#5e718b"
          text={t('info')}
        />
      </View>
      <View style={styles.wrapper}>
        <CustomButton
          icon={<Exit name="exit" size={40} color="#e2a55e" />}
          onPress={handleLogout}
          backgroundColor="#5e718b"
          text={t('exit')}
        />
      </View>
      <ModalInfo visible={modalVisible} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  wrapper: {
    paddingLeft: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textTitle: {
    fontSize: 25,
    color: '#e5c5bd',
    textAlign: 'center',
    fontFamily: 'muller',
  },
  text: {
    fontSize: 15,
    color: '#f6f6f5',
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  button: {
    padding: 20,
  },
  switchContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  thumbOnStyle: {
    backgroundColor: '#5e718b',
  },
  thumbOffStyle: {
    backgroundColor: '#5e718b',
  },
});

export default SideBar;
