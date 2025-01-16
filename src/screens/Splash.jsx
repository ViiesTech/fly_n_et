/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('screen');

const Splash = ({ navigation }) => {

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('GetStarted');
    }, 1000);
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark" />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/splash.png')}
          style={styles.container}
        />
      </View>
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
});
