import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageProps,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  imageSource?: ImageProps['source'];
  icon?: React.ReactElement;
  onPress: () => void;
  backgroundColor?: string;
  hasShadow?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  imageSource,
  icon,
  onPress,
  backgroundColor = '#fff',
  hasShadow = false,
}) => {
  const buttonContainerStyle: ViewStyle = {
    backgroundColor,
    ...styles.buttonContainer,
    ...(hasShadow
      ? {
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.21,
          shadowRadius: 8.19,
          elevation: 11,
        }
      : {}),
  };

  return (
    <TouchableOpacity style={buttonContainerStyle} onPress={onPress}>
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
