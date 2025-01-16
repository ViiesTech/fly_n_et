/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Animated, Image, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { H5, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { drawerInner, drawerStyle } from '../utils/global';
import Input from '../components/Input';
import * as Yup from 'yup';

import { api, errHandler, note } from '../utils/api';

import { useIsFocused } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    user_id: Yup.string()
        .required('User not defined.'),
    code: Yup.string()
        .required('Please enter valid OTP.')
        .min(4, 'OTP must contains 4 digits.')
        .max(4, 'OTP must contains 4 digits.'),
});

const OTP = ({ navigation, route }) => {
    const user_id = route.params?.user_id;
    const IsFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');

    const [slideAnimation] = useState(new Animated.Value(hp('100%')));

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: hp('1%'),
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [IsFocused]);

    const nextScreen = (nav) => {
        Animated.timing(slideAnimation, {
            toValue: hp('100%'),
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            nav();
        });
    };

    const onotpVerify = async () => {
        try {
            setLoading(true);
            const obj = {
                user_id,
                code,
            };
            await validationSchema.validate(obj, { abortEarly: false });
            const res = await api.post('/user/forget-verify', obj);
            note('Otp Verified Successfully', res?.data?.message);

            nextScreen(() => navigation.replace('ResetPassword', { 'user_id': res?.data?.user_id }));
        } catch (err) {
            await errHandler(err, null, navigation);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Background translucent={true}>
                <View style={{ height: hp('100%'), justifyContent: 'space-between' }}>
                    <View />
                    <Animated.View style={[{ transform: [{ translateY: slideAnimation }] }, drawerStyle]}>
                        <View
                            style={drawerInner}>
                            <H5 style={{ textAlign: 'center' }} heading font="bold">Enter Verification Code</H5>
                            <Br space={0.5} />
                            <Small style={{ textAlign: 'center' }} font="light">We can help to recover your account</Small>
                            <Br space={1.5} />
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{ width: hp('20%'), height: hp('20%'), alignSelf: 'center' }}
                            />
                            <Br space={1.5} />
                            <Input keyboardType="numeric" label="Enter OTP" onChangeText={(text) => setCode(text)} secureTextEntry />
                            <Br space={2} />
                            <Btn loading={loading} onPress={onotpVerify} label="Continue" />
                        </View>
                    </Animated.View>
                </View>
            </Background>
        </>
    );
};

export default OTP;
