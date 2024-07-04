import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({isOpen, onClose}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <View style={styles.sideBar}>
        <Text>Side Menu Content</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text>Close Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    flexDirection: 'row',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideBar: {
    width: 250,
    backgroundColor: '#f6f6f5',
    paddingTop: 20,
    paddingLeft: 10,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
});

export default SideBar;
