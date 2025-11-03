/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Background from '../utils/Background';
import { heightPercentageToDP as hp, widthPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Br from '../components/Br';
import { H6, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import Btn from '../utils/Btn';
import { TickCircle } from 'iconsax-react-native';
import BackBtn from '../components/BackBtn';
import { isIOS } from '../utils/global';
import { api, note } from '../utils/api';
import { DataContext } from '../utils/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Message = ({ navigation, route }) => {
    const theme = route?.params?.theme;
    const title = route?.params?.title;
    const message = route?.params?.message;
    const screen = route?.params?.screen;
    const isLightTheme = theme && theme === 'light';
    // const [popUpAnimation] = useState(new Animated.Value(0.8));
    const {context,setContext} = useContext(DataContext)
    const [loading,setLoading] = useState(false)

    console.log('screen',screen)

    // useEffect(() => {
    //     Animated.timing(popUpAnimation, {
    //         toValue: 1,
    //         duration: 1000,
    //         useNativeDriver: true,
    //     }).start();
    // }, []);

    const onContinue = async () => {
        // Animated.timing(popUpAnimation, {
        //     toValue: 0.8,
        //     duration: 1000,
        //     useNativeDriver: true,
        // }).start(async () => {
           if(title === 'Account Deletion') { 
            setLoading(true)
            const res = await api.post('/user/delete-account',{},{
                headers: {
                    'Authorization': `Bearer ${context?.token}`
                }
            }); 
            if(res.data.status === 'success') {
                note('Account Delete',res.data.message);
                setLoading(false)
                setContext({
                    ...context,
                    token: false,
                    isVerified: false,
                    user: null,
                    notifications: null,
                    restuarents: null,
                    savedRestuarents: null,
                    restuarent: null,
                    about: null,
                    terms: null,
                    serviceImages: null,
                    returnFromDetail: false,
                })
                await AsyncStorage.clear()
                navigation.navigate(screen);
            } else {
                note('Account Delete',res.data.message);
                setLoading(false)
            }
        }  else if (title === 'Logout') {
            setContext({
                ...context,
                token: false,
                isVerified: false,
                user: null,
                notifications: null,
                restuarents: null,
                savedRestuarents: null,
                restuarent: null,
                about: null,
                terms: null,
                serviceImages: null,
                returnFromDetail: false,
            })
            await AsyncStorage.clear()
            navigation.navigate(screen);
        } else {
            navigation.navigate(screen || 'BottomStack');
        }
        // });
    };

    return (
        <>
            {isLightTheme && <BackBtn navigation={navigation} translucent />}
            <Background translucent={true} noBackground={isLightTheme} barStyle={isLightTheme ? 'dark-content' : 'light-content'}>
                <View style={{ height: isIOS ? hp('90%') : hp('95%'), alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                    {/* <Animated.View style={{ transform: [{ scale: popUpAnimation }] }}> */}
                        <View style={[styles.card, { backgroundColor: isLightTheme ? Color('homeBg') : Color('drawerBg') }]}>
                            <TickCircle
                                size={hp('8%')}
                                color={Color('text')}
                                variant={isLightTheme ? 'Bold' : 'Outline'}
                            />
                            <Br space={2} />
                            <H6 style={{textAlign: 'center'}} heading font="bold">{title || 'All Done'}</H6>
                            <Small style={message && {width: widthPercentageToDP('70%'),textAlign: 'center'}} color={Color('lightText')}>{message || 'You’re all set and ready to start!'}</Small>
                            <Br space={2} />
                            <Btn loadingColor={Color('drawerBg')} loading={loading} textStyle={{color: Color(isLightTheme ? 'homeBg' : 'text')}} onPress={onContinue} label="Continue" btnStyle={{paddingHorizontal: wp('15%'), backgroundColor: Color(isLightTheme ? 'text' : 'btnColor')}} />
                        </View>
                        </View>
                    {/* </Animated.View> */}
                </View>
            </Background>
        </>
    );
};

export default Message;

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        paddingVertical: hp('3%'),
        width: wp('90%'),
        borderRadius: hp('3%'),
        borderWidth: 1,
        borderColor: Color('text'),
        shadowColor: Color('shadow'),
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,

        elevation: 17,
    },
});
