import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface ButtonProps {
  text: string;
  color: string;
  padding: number;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({text, color, padding, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: color, padding: padding}]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 100,
    minHeight: 40,
  },
  buttonText: {
    color: '#5e718b',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
});

export default Button;
