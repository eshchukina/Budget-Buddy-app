import React from 'react';
import {Modal, View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Button from '../buttons/Buttons';
import {useTranslation} from 'react-i18next';
import Line from '../../utils/additionalComponent/Line';

interface ModalInfoProps {
  visible: boolean;
  onClose: () => void;
}

const ModalInfo: React.FC<ModalInfoProps> = ({visible, onClose}) => {
  const {t} = useTranslation();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.titleHeader}>{t('infoTitle')}</Text>
            <Text style={styles.content}>{t('infoText1')}</Text>

            <Text style={styles.title}>{t('infoTitle2')}</Text>
            <Text style={styles.content}>{t('infoText2')}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/image/11.png')}
                style={styles.image}
              />
            </View>
            <Line color={'#e5c5bd'} />
            <Text style={styles.title}>{t('infoTitle3')}</Text>
            <Text style={styles.content}>{t('infoText3')}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/image/22.png')}
                style={styles.imageTable}
              />
            </View>
            <Line color={'#e5c5bd'} />
            <Text style={styles.title}>{t('infoTitle4')}</Text>
            <Text style={styles.content}>{t('infoText4')}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/image/33.png')}
                style={styles.imageChart}
              />
            </View>
            <Line color={'#e5c5bd'} />
            <Text style={styles.title}>{t('infoTitle5')}</Text>
            <Text style={styles.content}>{t('infoText5')}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/image/44.png')}
                style={styles.imageMoney}
              />
            </View>
            <Line color={'#e5c5bd'} />
            <Text style={styles.title}>{t('infoTitle6')}</Text>
            <Text style={styles.content}>{t('infoText6')}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/image/55.png')}
                style={styles.imageCurrency}
              />
            </View>
            <Line color={'#e5c5bd'} />
            <Text style={styles.content}>{t('infoText7')}</Text>
          </ScrollView>
          <Button
            text={t('close')}
            color="#b4bfc5"
            padding={10}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5e718b90',
  },
  modal: {
    backgroundColor: '#f6f6f5',
    padding: 20,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
    color: '#5e718b',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  titleHeader: {
    textAlign: 'center',
    fontSize: 20,
    color: '#5e718b',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
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
    height: 170,
  },
  imageTable: {
    width: '90%',
    height: 310,
  },
  imageChart: {
    width: '90%',
    height: 440,
  },
  imageMoney: {
    width: '90%',
    height: 100,
  },
  imageCurrency:
  {
    width: '90%',
    height: 170,
  }
});

export default ModalInfo;
