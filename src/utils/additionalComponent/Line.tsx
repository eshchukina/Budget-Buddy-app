import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

interface LineProps {
  color: string;
}

const Line: React.FC<LineProps> = ({color}) => {
  return <View style={[styles.line, {backgroundColor: color}]} />;
};

const styles = StyleSheet.create({
  line: {
    height: 2,
    width: '100%',
    marginVertical: 10,
  } as ViewStyle,
});

export default Line;
