import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface HeaderProps {
  text: string;
  color: string;
  size: number;
}

const Header: React.FC<HeaderProps> = ({text, color, size}) => {
  return (
    <Text style={[styles.header, {color: color, fontSize: size}]}>{text}</Text>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
});

export default Header;
