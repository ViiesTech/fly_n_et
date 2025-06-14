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
import { useIsFocused } from '@react-navigation/native';

const UserType = ({ navigation, route }) => {
    const IsFocused = useIsFocused();

    // const [slideAnimation] = useState(new Animated.Value(hp('100%')));

    // useEffect(() => {
    //     Animated.timing(slideAnimation, {
    //         toValue: hp('1%'),
    //         duration: 1000,
    //         useNativeDriver: true,
    //     }).start();
    // }, [IsFocused]);

    useEffect(() => {
        return () => {
            Keyboard.dismiss();
        };
    }, []);

    return (
        <>
            <Background translucent={true}>
                <View style={{ height: hp('100%'), justifyContent: 'space-between' }}>
                    <View />
                    <View style={drawerStyle}>
                    {/* <Animated.View style={[{ transform: [{ translateY: slideAnimation }] }, drawerStyle]}> */}
                        <View
                            style={drawerInner}>
                            <H5 style={{ textAlign: 'center' }} heading font="bold">Signup</H5>
                            <Br space={0.5} />
                            {/* <Small style={{ textAlign: 'center' }} font="light">We can help to recover your account</Small> */}
                            <Br space={1.5} />
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{ width: hp('20%'), height: hp('20%'), alignSelf: 'center' }}
                            />
                            <Br space={5} />
                            <Btn onPress={() => navigation.navigate('CreateProfile')} label="User" />
                            <Br space={2} />
                            <Btn onPress={() => navigation.navigate('CreateProProfile')} label="CFI/CFII" />
                        </View>
                        </View>
                    {/* </Animated.View> */}
                </View>
            </Background>
        </>
    );
};

export default UserType;
