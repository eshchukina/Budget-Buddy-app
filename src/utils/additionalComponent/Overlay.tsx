import React, {useEffect, useRef, useCallback} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Animated} from 'react-native';

interface OverlayProps {
  onPress: () => void;
}

const Overlay: React.FC<OverlayProps> = ({onPress}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    fadeIn();
  }, [fadeIn]);

  const fade = () => {
    fadeOut();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPress={fade}>
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5e718b90',
  },
});

export default Overlay;
