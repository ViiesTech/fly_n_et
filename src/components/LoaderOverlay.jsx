import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {Color} from '../utils/Colors';
import { Pera } from '../utils/Text';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Br from './Br';

const LoaderOverlay = ({visible,text}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Color('sidebarBg')} />
        <Br space={4} />
       {text && 
          <Pera size={hp(2.2)} color={Color('sideBarBg')} heading>
                      {'Fetching Nearby Airport...'}
                  </Pera>
                  }
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)', // darkens the background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderOverlay