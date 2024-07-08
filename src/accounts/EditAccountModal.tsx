import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../buttons/Buttons';
import {Picker} from '@react-native-picker/picker';

interface EditAccountModalProps {
  editModalVisible: boolean;
  setEditModalVisible: (visible: boolean) => void;
  editedAccountName: string;
  setEditedAccountName: (name: string) => void;
  editedAccountCurrency: string;
  setEditedAccountCurrency: (currency: string) => void;
  saveEditedAccount: () => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  editModalVisible,
  setEditModalVisible,
  editedAccountName,
  setEditedAccountName,
  editedAccountCurrency,
  setEditedAccountCurrency,
  saveEditedAccount,
}) => {
  const currencies = ['USD', 'EUR', 'GBP', 'GEL', 'TRY', 'RUB'];

  return (
    <Modal
      visible={editModalVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setEditModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Edit Account Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account name"
              value={editedAccountName}
              onChangeText={setEditedAccountName}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedAccountCurrency}
                onValueChange={itemValue =>
                  setEditedAccountCurrency(itemValue as string)
                }>
                {currencies.map(currency => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                text="Save"
                color="#b4bfc5"
                padding={10}
                onPress={saveEditedAccount}
              />
              <Button
                text="Close"
                color="#b4bfc5"
                padding={10}
                onPress={() => setEditModalVisible(false)}
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
  },
  input: {
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
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    width: '100%',
  },
});

export default EditAccountModal;
