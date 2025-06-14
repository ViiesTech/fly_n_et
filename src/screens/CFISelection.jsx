/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Image, View, Animated } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { H5, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { drawerInner } from '../utils/global';
const CFISelection = ({ navigation }) => {
  // const [slideAnimation] = useState(new Animated.Value(hp('100%')));
  const nextScreen = nav => {
    // Animated.timing(slideAnimation, {
    //   toValue: hp('100%'),
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start(() => {
      nav();
    // });
  };
  return (
    <>
      <Background>
        <View style={{ height: hp('100%'), justifyContent: 'space-between' }}>
          <View />
          <View style={drawerInner}>
            <H5 style={{ textAlign: 'center' }} heading font="bold">
              Enter Verification Code
            </H5>
            <Br space={0.5} />
            <Small style={{ textAlign: 'center' }} font="light">
              We can help to recover your account
            </Small>
            <Br space={1.5} />
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: hp('20%'),
                height: hp('20%'),
                alignSelf: 'center',
              }}
            />
            <Br space={1.5} />
            <Btn onPress={() => nextScreen(() => navigation.navigate('CFIScreen'))} textStyle={{ fontWeight: 900 }} label="C F I" />
            <Br space={2} />
            <Btn onPress={() => nextScreen(() => navigation.navigate('CFiIScreen'))} textStyle={{ fontWeight: 900 }} label="C F i I" />
          </View>
        </View>
      </Background>
    </>
  );
};

export default CFISelection;
