import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageProps,
} from 'react-native';

interface ButtonProps {
  imageSource?: ImageProps['source'];
  icon?: React.ReactElement;
  onPress: () => void;
  backgroundColor?: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  imageSource,
  icon,
  onPress,
  backgroundColor = '#fff',
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {backgroundColor}]}
      onPress={onPress}>
      {imageSource ? (
        <Image source={imageSource} style={styles.buttonImage} />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
  },
  buttonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default CustomButton;
