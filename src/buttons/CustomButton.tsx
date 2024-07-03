import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ImageProps } from 'react-native';

interface ButtonProps {
    imageSource: ImageProps['source'];
  onPress: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Image source={imageSource} style={styles.buttonImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',


  },
  buttonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default CustomButton;
