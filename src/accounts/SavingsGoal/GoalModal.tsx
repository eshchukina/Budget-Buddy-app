import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../../buttons/Buttons';
import {useTranslation} from 'react-i18next';

interface GoalModalProps {
  visible: boolean;
  goalAmount: string;
  setGoalAmount: (amount: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  goalAmount,
  setGoalAmount,
  onSave,
  onClose,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{t('enterGoal')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goalAmount}
              onChangeText={setGoalAmount}
            />
            <View style={styles.buttonContainer}>
              <Button
                text={t('save')}
                color="#b4bfc5"
                padding={10}
                onPress={onSave}
              />
              <Button
                text={t('close')}
                color="#b4bfc5"
                padding={10}
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#5e718b90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
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
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
  input: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b', // цвет текста
    height: 40,
    width: '100%',
    borderColor: '#ccc',
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
});

export default GoalModal;
