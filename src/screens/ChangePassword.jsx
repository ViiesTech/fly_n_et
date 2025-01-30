/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import { Keyboard, View } from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import { Pera } from '../utils/Text';
import { Color } from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import Input from '../components/Input';
import Btn from '../utils/Btn';
import { isIOS } from '../utils/global';
import * as Yup from 'yup';
import { api, errHandler, note } from '../utils/api';
import { DataContext } from '../utils/Context';

const validationSchema = Yup.object().shape({
    old_password: Yup.string()
        .required('Old password is required.'),
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

const ChangePassword = ({ navigation }) => {
    const {context} = useContext(DataContext);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangePassword = async () => {
        try {
            setLoading(true);
            Keyboard.dismiss();
            const obj = {
                old_password: password,
                new_password: newPassword,
                repeat_password: confirmPassword,
            };
            await validationSchema.validate(obj, { abortEarly: false });
            const res = await api.post('/user/change-password', obj, {
                headers: {Authorization: `Bearer ${context?.token}`},
            });
            note('Password Changed Successfully', res?.data?.message);
            navigation.replace('Login');
        } catch (err) {
            await errHandler(err, null, navigation);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BackBtn navigation={navigation} />
            <Background translucent={false} bgColor={Color('sidebarBg')} statusBarColor={Color('sidebarBg')} barStyle="dark-content" noBackground>
                <View>
                    <Br space={isIOS ? 0.5 : 2.5} />
                    <Pera style={{ textAlign: 'center' }} color={Color('homeBg')} heading font="bold">Change Password</Pera>
                    <Br space={5} />
                    <Wrapper>
                        <Input mode="light" onChangeText={text => setPassword(text)} label="Enter Your Old Password" secureTextEntry />
                        <Br space={2} />
                        <Pera style={{ textAlign: 'center' }} color={Color('homeBg')} heading font="bold">Enter Your New Password Information</Pera>
                        <Br space={1.2} />
                        <Input mode="light" onChangeText={text => setNewPassword(text)} label="New Password" secureTextEntry />
                        <Br space={1.2} />
                        <Input mode="light" onChangeText={text => setConfirmPassword(text)} label="Confirm New Password" secureTextEntry />
                    </Wrapper>
                </View>
            </Background>
            <Wrapper>
                <Btn onPress={onChangePassword} loading={loading} btnStyle={{backgroundColor: Color('homeBg')}} label="Change Password" />
            </Wrapper>
            <Br space={2} />
        </>
    );
};

export default ChangePassword;
