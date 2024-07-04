import React from 'react';
import {Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../../buttons/Buttons';
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
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Enter Goal Amount:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />
          <View style={styles.buttonContainer}>
            <Button text="Save" color="#b4bfc5" padding={10} onPress={onSave} />
            <Button
              text="Close"
              color="#b4bfc5"
              padding={10}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
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
