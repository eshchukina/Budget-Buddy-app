import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface SideBarProps {
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({onClose}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textTitle}>Menu</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text>Close Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 25,
    color: '#221712',
    textAlign: 'center',
  },
  button: {
    padding: 20,
  },
});

export default SideBar;
