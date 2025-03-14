/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Image, Keyboard, PermissionsAndroid, Platform, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Color } from '../utils/Colors';
import { H5, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { drawerInner, drawerStyle } from '../utils/global';
import Input from '../components/Input';
import RadioBtn from '../components/RadioBtn';
import { useIsFocused } from '@react-navigation/native';
import * as Yup from 'yup';
import { api, errHandler, note } from '../utils/api';
import { DataContext } from '../utils/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Purchases from 'react-native-purchases';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter your valid email address to login.')
        .email('Please enter a valid email address.')
        .max(100, 'Email must be at most 100 characters'),
    password: Yup.string()
        .required('Please enter your exact password.'),
});

const Login = ({ navigation }) => {
    const { context, setContext } = useContext(DataContext);
    const IsFocused = useIsFocused();
    const [slideAnimation] = useState(new Animated.Value(hp('100%')));
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState();

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: hp('1%'),
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [IsFocused]);

    useEffect(() => {
        if (context?.token && context?.isVerified) {
            Toast.show('Login Successfully', Toast.SHORT);
            console.log('atleast wrk',context?.user?.expired_at)
            handlingNavigations()
        } else if (context?.token && !context?.isVerified) {
            nextScreen(() => navigation.replace('Verify'));
        } 
    }, [context?.token, context?.isVerified]);
    

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const handlingNavigations = async () => {
      await getSubscriptionInfo()
        const expiryDate = context?.user?.expired_at ? new Date(context.user.expired_at) : null;
        const currentDate = new Date();
            if (!expiryDate  || expiryDate && currentDate > expiryDate) {
                nextScreen(() => navigation.navigate('Packages'));
            } else if (context?.user?.user_info) {
                if (context?.user?.user_info?.address) {
                    nextScreen(() => navigation.navigate('Home'));
                } else {
                    nextScreen(() => navigation.replace('SelectLocation'));
                }
            } else {
                nextScreen(() => navigation.replace('UserType'));
            }
    };

    const getSubscriptionInfo = async () => {
        if (context?.subscribed_details) {
        try {
            // console.log('Purchaser Info:', purchaserInfo);

                const obj = {
                    sub_type: context?.subscribed_details?.sub_type,
                    purchase_date: context?.subscribed_details?.purchased_date,
                }
                // console.log('hh')
                      const response = await api.post('user/subscribe', obj, {
                        headers: {
                          Authorization: `Bearer ${context?.token}`,
                        },
                      });
                      console.log('hh',response?.data)
                      if (response?.data?.status === 'success' && response?.data?.user?.expired_at) {
                        setContext(prevContext => ({
                            ...prevContext,
                            subscribed_details: null,
                            user: { ...prevContext.user, expired_at: response.data.user.expired_at },
                          }));
                      }
        } catch (error) {
            console.error('Error fetching subscription info:', error);
        }
    }

        // return { subscriptionType: "none", purchaseDate: null };
    };

    async function requestLocationPermission() {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Fly n Eat',
                        message: 'Fly n Eat App access to your location',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                } else {
                    console.log('location permission denied');
                }
            } else if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization();
                getLocation();
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async function getLocation() {
        Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 });
        Geolocation.getCurrentPosition(async (pos) => {
            const crd = pos.coords;

            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`);
            const data = response?.data;
            const locationName = data?.results[0]?.formatted_address;

            setLocation({
                latitude: crd?.latitude,
                longitude: crd?.longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
                locationName: locationName,
            });
        }, (err) => {
            console.log(err);
        });
    }

    const onUserLogin = async () => {
        try {
            // if (!location) {
            //     note('Location is Required', 'You need to allow the app to get your location in order to use fly n eat!', [{ text: 'Request Again', onPress: async () => await requestLocationPermission() }]);
            //     return;
            // }
            setLoading(true);
            Keyboard.dismiss();
            const obj = {
                email,
                password,
                remember: true,
                // latitude: 0,
                // longitude: 0,
                ...location,
            };

            await validationSchema.validate(obj, { abortEarly: false });
            const res = await api.post('/user/login', obj);
            console.log('login responsne',res?.data)
            if (true) {
                await AsyncStorage.setItem('token', res?.data?.token);
                await AsyncStorage.setItem('isVerified', res?.data?.verified);
                await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user));
            }
            setContext({
                ...context,
                token: res?.data?.token,
                isVerified: res?.data?.verified ? true : false,
                user: res?.data?.user,
            });
        } catch (err) {
            await errHandler(err, null, navigation);
        } finally {
            setLoading(false);
        }
    };

    const nextScreen = (nav) => {
        Animated.timing(slideAnimation, {
            toValue: hp('100%'),
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            nav();
        });
    };

    return (
        <>
            <Background translucent={true}>
                <View style={{ height: hp('100%'), justifyContent: 'space-between' }}>
                    <View />
                    <Animated.View style={[{ transform: [{ translateY: slideAnimation }] }, drawerStyle]}>
                        <View
                            style={drawerInner}>
                            <H5 style={{ textAlign: 'center' }} heading font="bold">Login Account</H5>
                            <Br space={0.5} />
                            <Small style={{ textAlign: 'center' }} font="light">Discover your social & Try to Login</Small>
                            <Br space={1.5} />
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{ width: hp('20%'), height: hp('20%'), alignSelf: 'center' }}
                            />
                            <Br space={1.5} />
                            <Input label="Email Address" onChangeText={(text) => setEmail(text)} />
                            <Br space={1.5} />
                            <Input label="Password" onChangeText={(text) => setPassword(text)} secureTextEntry />
                            <View style={{ marginTop: hp('2%'), marginBottom: hp('3%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', gap: wp('2%'), alignItems: 'center' }}>
                                    <RadioBtn isChecked={rememberMe} radioClr={Color('text')} onPress={() => setRememberMe(!rememberMe)} />
                                    <Small heading font="regular">Remember Me</Small>
                                </View>
                                <TouchableOpacity onPress={() => nextScreen(() => navigation.navigate('ForgotPassword'))}>
                                    <Small heading font="regular">Forgot Password?</Small>
                                </TouchableOpacity>
                            </View>
                            <Btn loading={loading} label="Login" onPress={onUserLogin} />
                            <Br space={3} />
                            <TouchableOpacity onPress={() => nextScreen(() => navigation.navigate('Signup'))}>
                                <Small style={{ textAlign: 'center' }} heading font="regular">Don’t have an account? Signup</Small>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Background>
        </>
    );
};

export default Login;
