/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Image, PermissionsAndroid, Platform, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { H5, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { drawerInner, drawerStyle } from '../utils/global';
import Input from '../components/Input';
import * as Yup from 'yup';
import { useIsFocused } from '@react-navigation/native';
import { DataContext } from '../utils/Context';
import { api, errHandler, note } from '../utils/api';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter your full name to register.')
        .min(2, 'Name must contains atleast 2 charactes')
        .max(100, 'Name must be at most 100 characters'),
    email: Yup.string()
        .required('Please enter your valid email address to register.')
        .email('Please enter a valid email address.')
        .max(100, 'Email must be at most 100 characters'),
    password: Yup.string()
        .required('Please enter password.')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[0-9]/, 'Password must contain at least one number.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
    confirmPassword: Yup.string()
        .required('Confirm password is required.')
        .oneOf([Yup.ref('password'), null], 'Confirm password must match with the entered password.'),
});

const Signup = ({ navigation }) => {
    const {context, setContext} = useContext(DataContext);
    const IsFocused = useIsFocused();
    const [slideAnimation] = useState(new Animated.Value(hp('100%')));
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState();

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: hp('1%'),
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [IsFocused]);

    useEffect(() => {
        if (context?.token && !context?.isVerified) {
            nextScreen(() => navigation.replace('Verify'));
        }
    }, [context?.token]);

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

    const nextScreen = (nav) => {
        Animated.timing(slideAnimation, {
            toValue: hp('100%'),
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            nav();
        });
    };

    const onUserSignup = async () => {
        try {
            if (!location) {
                note('Location is Required', 'You need to allow the app to get your location in order to use fly n eat!', [{ text: 'Request Again', onPress: async () => await requestLocationPermission() }]);
                return;
            }
            setLoading(true);
            const obj = {
                name,
                email,
                password,
                confirmPassword,
                ...location,
            };
            await validationSchema.validate(obj, { abortEarly: false });
            const res = await api.post('/user/register', obj);
            note('Account Created', res?.data?.message);
            setContext({
                ...context,
                token: res?.data?.token,
                user: res?.data?.user,
            });
        }catch(err) {
            await errHandler(err, null, navigation);
        }finally {
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
                            <H5 style={{ textAlign: 'center' }} heading font="bold">Create App account!</H5>
                            <Br space={0.5} />
                            <Small style={{ textAlign: 'center' }} font="light">Create your amazing app account with us!</Small>
                            <Br space={1.5} />
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{ width: hp('20%'), height: hp('20%'), alignSelf: 'center' }}
                            />
                            <Br space={1.5} />
                            <Input label="Full Name" onChangeText={(text) => setName(text)} />
                            <Br space={1.5} />
                            <Input label="Email Address" onChangeText={(text) => setEmail(text)} />
                            <Br space={1.5} />
                            <Input label="Password" onChangeText={(text) => setPassword(text)} secureTextEntry />
                            <Br space={1.5} />
                            <Input label="Re-Enter Password" onChangeText={(text) => setConfirmPassword(text)} secureTextEntry />
                            <Br space={2.5} />
                            <Btn loading={loading} label="Signup" onPress={onUserSignup} />
                            <Br space={3} />
                            <TouchableOpacity onPress={() => nextScreen(() => navigation.navigate('Login'))}>
                                <Small style={{textAlign: 'center'}} heading font="regular">Already have an account ? Login</Small>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Background>
        </>
    );
};

export default Signup;
