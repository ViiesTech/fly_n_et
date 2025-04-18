import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {Color} from '../utils/Colors';

const LoaderOverlay = ({visible}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Color('sidebarBg')} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)', // darkens the background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderOverlay