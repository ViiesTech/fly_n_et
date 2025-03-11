/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Background from '../utils/Background';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import Btn from '../utils/Btn';
import { Location as Loc, Notification, TextalignLeft } from 'iconsax-react-native';
import Navigation from '../components/Navigation';
import Geolocation from '@react-native-community/geolocation';
import { DataContext } from '../utils/Context';
import { api, errHandler, note } from '../utils/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';

const Home = ({ navigation }) => {
    const { context,setContext } = useContext(DataContext);
    const [location, setLocation] = useState();

    // console.log('hh',context?.user.expired_at)

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const getLocation = async (place_id) => {
        const BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry`;
        const response = await axios.get(BASE_URL);
        await AsyncStorage.setItem('locationDetails', JSON.stringify(response.data?.result?.geometry?.location));
    };
    const onSelectLocation = async (value) => {
        await AsyncStorage.setItem('selectLocation', JSON.stringify(value));
        getLocation(value?.place_id);
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
                    getLocations();
                } else {
                    console.log('location permission denied');
                }
            } else if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization();
                getLocations();
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async function getLocations() {
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
    const TopBar = () => {
        return (
            <View style={styles.topbar}>
                <View style={{ width: wp('20%'), alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        backgroundColor: Color('btnColor'),
                        width: hp('5%'),
                        height: hp('5%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: hp('50%'),
                    }} onPress={() => navigation.navigate('SideMenu')}>
                        <TextalignLeft
                            size={hp('2.5%')}
                            color={Color('text')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ width: wp('60%'), alignItems: 'center' }}>
                    <Small heading font="medium">Current Location</Small>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('.5%') }}>
                        <Loc size={hp('2%')} color={Color('text')} />
                        <Small heading font="bold" numberOfLines={1}>{context?.user?.user_info?.address}</Small>
                    </View>
                </View>
                <View style={{ width: wp('20%'), alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        backgroundColor: Color('btnColor'),
                        width: hp('5%'),
                        height: hp('5%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: hp('50%'),
                    }} onPress={() => navigation.navigate('Notifications')}>
                        <Notification
                            size={hp('2.5%')}
                            color={Color('text')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const HomeInput1 = ({ placeholder }) => {
        const inputRef = useRef(null);
        const [predictions, setPredictions] = useState();
        const [selection, setSelection] = useState('');
        const searchAirports = async (searchKey) => {
            const BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk&types=airport&components=country:us`;
            const response = await axios.get(BASE_URL, {
              params: {
                key: API_KEY,
                input: 'Restaurants',
                inputtype: 'textquery',
                radius: 5000,
              },
            });
            setPredictions(response?.data?.predictions);
        };

        const onClick = (val) => {
            onSelectLocation(val);
            setPredictions();
            setSelection(val?.structured_formatting?.main_text);
            if (inputRef.current) {
                inputRef.current.setNativeProps({ text: val?.structured_formatting?.main_text?.toUpperCase() });
            }
        };

        return (
            <>
                <View style={{position: 'relative', overflow: 'visible', zIndex: 1}}>
                    <View style={styles.input}>
                        <TextInput autoCapitalize='characters' ref={inputRef} onChangeText={searchAirports} style={styles.inputField} placeholderTextColor={Color('lightText')} placeholder={placeholder} autoCorrect={false} />
                    </View>
                    {
                        predictions && predictions?.length > 0 && (
                            <View
                                style={{
                                    position: 'absolute', top: '100%', width: wp('70%'), backgroundColor: Color('text'),
                                    shadowColor: Color('shadow'),
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    borderRadius: hp('0.5%'),
                                    elevation: 5,
                                    zIndex: 3,
                                    height: hp('10%'),
                                }}
                            >
                                <ScrollView>
                                    {predictions?.map((val, index) => {
                                        return (
                                            <Pressable onPress={() => onClick(val)}>
                                                <Small numberOfLines={1} key={index} color={Color('homeBg')} size={hp(2.6)} style={{ padding: hp('0.5%') }}>{val?.structured_formatting?.main_text?.toUpperCase()}</Small>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )
                    }
                </View>
            </>
        );
    };
    const HomeInput = ({ placeholder }) => {
        const setDistance = async (text) => {
            await AsyncStorage.setItem('distance', text);
        };
        return (
            <View style={styles.input}>
                <TextInput autoCapitalize='characters' onChangeText={(text) => setDistance(text.toUpperCase())} keyboardType="numeric" style={[styles.inputField]} placeholderTextColor={Color('lightText')} placeholder={placeholder} />
            </View>
        );
    };
    const Button = () => {
        const [loading, setLoading] = useState(false);
        const onSearch = async () => {
            if(!context.isHome) {  
            try {
                setLoading(true);
                const locationDetails = await AsyncStorage.getItem('locationDetails');
                const distance = await AsyncStorage.getItem('distance');
                const selectLocation = await AsyncStorage.getItem('selectLocation');

                if (!locationDetails || !distance) {
                    note('Validation Error', 'Location and max distance is required');
                    return false;
                }

                const json = JSON.parse(locationDetails);
                console.log("json..........", json)
                const res = await api.post('/restaurant/search', {
                    starting_from: `${json?.lat},${json?.lng}`,
                    max_distance: distance,
                }, {
                    headers: { Authorization: `Bearer ${context?.token}` },
                });
                console.log('restauratns responsne',res.data?.restaurant)
                if (res.data?.restaurant?.length > 0) {
                    setContext({
                        ...context,
                        isHome: true
                    })
                    navigation.navigate('Map', { distance: distance, restaurants: res.data?.restaurant, location: location, airport: JSON.parse(locationDetails), airportDetails: JSON.parse(selectLocation) });
                }else {
                    note('No Result Found', "Couldn't find any restaurant according to the given parameters");
                }
            } catch (err) {
                await errHandler(err, null, navigation);
            } finally {
                setLoading(false);
            }
        } else {
            navigation.navigate('Packages')
        }

        };
        return <Btn loading={loading} onPress={onSearch} label="Fly-n-Eat Search" btnStyle={{ backgroundColor: Color('homeBg'), width: wp('70%') }} />;
    };
    return (
        <>
            <Background translucent={false} statusBarColor={Color('homeBg')} noBackground>
                <TopBar />
                <View style={{ height: hp('70%'), alignItems: 'center', justifyContent: 'center' }}>
                    <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">Starting From</Pera>
                    <Br space={2} />
                    <HomeInput1 placeholder="Type Here" />
                    <Br space={5} />
                    <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">Max Distance (NM)</Pera>
                    <Br space={2} />
                    <HomeInput placeholder="Type Here" />
                    <Br space={5} />
                    <Button />
                </View>
            </Background>
            <Navigation navigation={navigation} />
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: Color('homeBg'),
        paddingVertical: hp('2%'),
        width: wp('100%'),
        flexDirection: 'row',
        borderBottomLeftRadius: hp('4%'),
        borderBottomRightRadius: hp('4%'),
    },
    input: {
        borderWidth: 1,
        borderColor: Color('lightText'),
        borderRadius: hp('50%'),
        width: wp('70%'),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('5%'),
    },
    inputField: {
        borderRadius: hp('50%'),
        paddingHorizontal: wp('5%'),
        // paddingVertical: 0,
        color: Color('homeBg'),
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        fontSize: hp(2),
        fontWeight: '600',
    },
});
