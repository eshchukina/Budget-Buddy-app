import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface IconButtonProps {
  iconComponent: JSX.Element;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ iconComponent, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {iconComponent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});

export default IconButton;
