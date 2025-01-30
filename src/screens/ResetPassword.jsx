/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Animated, Image, Keyboard, View } from 'react-native';
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
    new_password: Yup.string()
        .required('Please enter password.')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[0-9]/, 'Password must contain at least one number.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
    repeat_password: Yup.string()
        .required('Confirm password is required.')
        .oneOf([Yup.ref('new_password'), null], 'Confirm password must match with the entered password.'),
});

const ResetPassword = ({ navigation, route }) => {
    const IsFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const user_id = route.params?.user_id;

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


    const onResetPassword = async () => {
        try {
            setLoading(true);
            Keyboard.dismiss();
            const obj = {
                user_id,
                new_password: password,
                repeat_password: confirmPassword,
            };
            await validationSchema.validate(obj, { abortEarly: false });
            const res = await api.post('/user/reset-password', obj);
            note('Password Changed Successfully', res?.data?.message);
            nextScreen(() => navigation.replace('Login'));
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
                    <Animated.View style={[{ transform: [{ translateY: slideAnimation }] }, drawerStyle]}>
                        <View
                            style={drawerInner}>
                            <H5 style={{ textAlign: 'center' }} heading font="bold">Enter New Password</H5>
                            <Br space={0.5} />
                            <Small style={{ textAlign: 'center' }} font="light">Your account is ready to recover!</Small>
                            <Br space={1.5} />
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{ width: hp('20%'), height: hp('20%'), alignSelf: 'center' }}
                            />
                            <Br space={1.5} />
                            <Input label="Password" onChangeText={text => setPassword(text)} secureTextEntry />
                            <Br space={1.5} />
                            <Input label="Re-enter Password" onChangeText={text => setConfirmPassword(text)} secureTextEntry />
                            <Br space={2} />
                            <Btn loading={loading} onPress={onResetPassword} label="Continue" />
                        </View>
                    </Animated.View>
                </View>
            </Background>
        </>
    );
};

export default ResetPassword;
