/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import { Animated, Image, Keyboard, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { H5, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { drawerInner, drawerStyle, trackCompleteRegisterationEvent } from '../utils/global';
import Input from '../components/Input';
import { api, errHandler, note } from '../utils/api';
import * as Yup from 'yup';
import { DataContext } from '../utils/Context';
import { useIsFocused } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required('Please enter valid OTP.')
    .min(4, 'OTP must contains 4 digits.')
    .max(4, 'OTP must contains 4 digits.'),
});
const Verify = ({ navigation }) => {
  const { context, setContext } = useContext(DataContext);
  const IsFocused = useIsFocused();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  // const [slideAnimation] = useState(new Animated.Value(hp('100%')));

  // useEffect(() => {
  //   Animated.timing(slideAnimation, {
  //     toValue: hp('1%'),
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [IsFocused]);

  useEffect(() => {
    // alert('hello')
    if (context?.token && context?.isVerified) {
      // alert('user info does not exist')
      if (context?.user?.user_info) {
        // alert('user info exist')
        nextScreen(() => navigation.replace('Home'));
      } else {
        nextScreen(() => navigation.replace('UserType'));
      }
    }
  }, [context?.token, context?.isVerified]);

  const nextScreen = nav => {
    // Animated.timing(slideAnimation, {
    //   toValue: hp('100%'),
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start(() => {
      nav();
    // });
  };
  const onOtpVerify = async () => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const obj = {
        code,
      };
      await validationSchema.validate(obj, { abortEarly: false });
      const res = await api.post('/user/verify-user', obj, {
        headers: { Authorization: `Bearer ${context?.token}` },
      });
      note('User Verified Successfully', res?.data?.message);
      setContext({
        ...context,
        isVerified: res?.data?.verified ? true : false,
        user: res?.data?.user,
      });
      trackCompleteRegisterationEvent()
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Background>
        <View style={{ height: hp('100%'), justifyContent: 'space-between' }}>
          <View />
          <View style={drawerStyle}>
          {/* <Animated.View
            style={[{ transform: [{ translateY: slideAnimation }] }, drawerStyle]}> */}
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
              <Input
                label="Enter OTP"
                onChangeText={(text) => setCode(text)}
                keyboardType="numeric"
                secureTextEntry
              />
              <Br space={2} />
              <Btn loading={loading} onPress={onOtpVerify} label="Continue" />
            </View>
            </View>
          {/* </Animated.View> */}
        </View>
      </Background>
    </>
  );
};

export default Verify;
