import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import Button from '../buttons/Buttons';
import Line from '../utils/Line';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  navigation,
  onFinish,
}) => {
  const {t} = useTranslation();

  const handlePress = () => {
    onFinish();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.titleHeader}>{t('infoTitle')}</Text>
        <Text style={styles.content}>{t('infoText1')}</Text>

        <Text style={styles.title}>{t('infoTitle2')}</Text>
        <Text style={styles.content}>{t('infoText2')}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/image/11.png')}
            style={styles.image}
          />
        </View>
        <Line color={'#e5c5bd'} />
        <Text style={styles.title}>{t('infoTitle3')}</Text>
        <Text style={styles.content}>{t('infoText3')}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/image/22.png')}
            style={styles.imageTable}
          />
        </View>
        <Line color={'#e5c5bd'} />
        <Text style={styles.title}>{t('infoTitle4')}</Text>
        <Text style={styles.content}>{t('infoText4')}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/image/33.png')}
            style={styles.imageChart}
          />
        </View>
        <Line color={'#e5c5bd'} />
        <Text style={styles.title}>{t('infoTitle5')}</Text>
        <Text style={styles.content}>{t('infoText5')}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/logo/logo4.png')}
            style={{width: 120, height: 130}}
          />
        </View>
        <Line color={'#e5c5bd'} />
        <Text style={styles.title}>{t('infoTitle6')}</Text>
        <Text style={styles.content}>{t('infoText6')}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/image/44.png')}
            style={styles.imageMoney}
          />
        </View>
        <Line color={'#e5c5bd'} />
        <Text style={styles.content}>{t('infoText7')}</Text>
      </ScrollView>
      <Button
        text={t('registerButton')}
        color="#b4bfc5"
        padding={10}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#f6f6f5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleHeader: {
    textAlign: 'center',
    fontSize: 20,
    color: '#5e718b',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: '#cf7041',
    fontFamily: 'Montserrat-Medium',
  },
  content: {
    color: '#5e718b',
    fontSize: 13,
    textAlign: 'justify',
    fontFamily: 'Montserrat-Medium',
    paddingBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  image: {
    width: '90%',
    height: 190,
  },
  imageTable: {
    width: '90%',
    height: 330,
  },
  imageChart: {
    width: '90%',
    height: 440,
  },
  imageMoney: {
    width: '90%',
    height: 100,
  },
});

export default WelcomeScreen;
