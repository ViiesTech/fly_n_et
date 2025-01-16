/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Animated, Image, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {H5, Small} from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import {drawerInner, drawerStyle} from '../utils/global';
import Input from '../components/Input';
import {useIsFocused} from '@react-navigation/native';
import {api, errHandler, note} from '../utils/api';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter your valid email address.')
    .email('Please enter a valid email address.')
    .max(100, 'Email must be at most 100 characters'),
});

const ForgotPassword = ({navigation}) => {
  const IsFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [slideAnimation] = useState(new Animated.Value(hp('100%')));

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: hp('1%'),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [IsFocused]);

  const nextScreen = nav => {
    Animated.timing(slideAnimation, {
      toValue: hp('100%'),
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      nav();
    });
  };

  const onForgetPassword = async () => {
    try {
      setLoading(true);
      const obj = {
        email,
      };
      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/forget-password', obj);
      note('Otp Sent', res?.data?.message);
      nextScreen(() =>
        navigation.replace('OTP', {user_id: res?.data?.user_id}),
      );
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background translucent={true}>
        <View style={{height: hp('100%'), justifyContent: 'space-between'}}>
          <View />
          <Animated.View
            style={[{transform: [{translateY: slideAnimation}]}, drawerStyle]}>
            <View style={drawerInner}>
              <H5 style={{textAlign: 'center'}} heading font="bold">
                Forgot Password
              </H5>
              <Br space={0.5} />
              <Small style={{textAlign: 'center'}} font="light">
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
                label="Email Address"
                onChangeText={text => setEmail(text)}
              />
              <Br space={2} />
              <Btn
                loading={loading}
                onPress={onForgetPassword}
                label="Continue"
              />
            </View>
          </Animated.View>
        </View>
      </Background>
    </>
  );
};

export default ForgotPassword;
