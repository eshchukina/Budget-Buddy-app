import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../buttons/Buttons';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';

interface NewAccountModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  newAccountName: string;
  setNewAccountName: (name: string) => void;
  newAccountCurrency: string;
  setNewAccountCurrency: (currency: string) => void;
  saveNewAccount: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({
  modalVisible,
  setModalVisible,
  newAccountName,
  setNewAccountName,
  newAccountCurrency,
  setNewAccountCurrency,
  saveNewAccount,
}) => {
  const currencies = ['USD', 'EUR', 'GBP', 'GEL', 'TRY', 'RUB'];
  const {t} = useTranslation();

  useEffect(() => {
    if (!newAccountCurrency) {
      setNewAccountCurrency('USD');
    }
  }, [newAccountCurrency, setNewAccountCurrency]);
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t('newAccount')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('enterAccountName')}
              value={newAccountName}
              onChangeText={setNewAccountName}
              maxLength={10}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newAccountCurrency}
                onValueChange={itemValue =>
                  setNewAccountCurrency(itemValue as string)
                }>
                {currencies.map(currency => (
                  <Picker.Item
                    style={styles.pickerItem}
                    key={currency}
                    label={currency}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                text={t('save')}
                color="#b4bfc5"
                padding={10}
                onPress={saveNewAccount}
              />
              <Button
                text={t('close')}
                color="#b4bfc5"
                padding={10}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5e718b90',
  },
  modalContent: {
    backgroundColor: '#f6f6f5',
    padding: 20,
    width: '80%',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#5e718b',
    fontFamily: 'Montserrat-Bold',
  },
  input: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    height: 40,
    width: '100%',
    borderColor: '#e5c5bd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    width: '100%',
  },
  pickerItem: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
  },
});

export default NewAccountModal;
