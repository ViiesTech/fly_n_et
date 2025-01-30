/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useContext, useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Color } from '../utils/Colors';
import { ActivityIndicator, Image, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import BackBtn from '../components/BackBtn';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { Pera, Small } from '../utils/Text';
import { Location, Notification, SearchNormal, Star1 } from 'iconsax-react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Navigation from '../components/Navigation';
import Wrapper from '../components/Wrapper';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import { api, errHandler, storageUrl } from '../utils/api';
import { DataContext } from '../utils/Context';
import { calcCrow, capitalize } from '../utils/global';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';

const CFISearch = ({ navigation }) => {
  const { context, setContext } = useContext(DataContext);
    const [location, setLocation] = useState();
    const [filter, setFilter] = useState('');
    const [mode, setMode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (location) {
            getCFI();
        }
    }, [location]);

    const getCFI = async (page = 1) => {
        if (isLoading || !hasMore) {return;}
        setIsLoading(true);
        try {
            const res = await api.get(`/user/pro-users?page=${page}`, {
                headers: { Authorization: `Bearer ${context?.token}` },
            });

            const newUsers = res?.data?.users?.data || [];
            setContext((prevContext) => ({
                ...prevContext,
                pro_users: page === 1
                ? newUsers
                : [...prevContext.pro_users, ...newUsers],
            }));
            setCurrentPage(page);
            setHasMore(page < res?.data?.users?.last_page);
        } catch (err) {
            await errHandler(err, null, navigation);
        } finally {
            setIsLoading(false);
        }
    };
    const getLocation = () => {
        Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 });
        Geolocation.getCurrentPosition(async (pos) => {
            const crd = pos.coords;

            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`);
            const data = response.data;
            const locationName = data.results[0].formatted_address;
            setLocation({
                latitude: crd.latitude,
                longitude: crd.longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
                locationName: locationName,
            });
        }, (err) => {
            console.log(err);
        });
    };
    return (
        <>
            <BackBtn navigation={navigation} />
            <Background translucent={false} statusBarColor={Color('homeBg')} noBackground
                detectScrollEnd
                onScrollEnd={() => {
                    if (!isLoading && hasMore) {
                        getCFI(currentPage + 1);
                    }
                }}
            >
                <Wrapper>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: heightPercentageToDP('8%') }}>
                        <View style={{ flexDirection: 'row', gap: heightPercentageToDP('1%'), alignItems: 'center', width: widthPercentageToDP('75%') }}>
                            <Location size={heightPercentageToDP('2.5%')} color={Color('btnColor')} />
                            <View>
                                <Small heading font="medium" color={Color('shadow')}>Current Location</Small>
                                <Small color={Color('shadow')} heading font="bold" numberOfLines={1}>{context?.user?.user_info?.address}</Small>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                            <Notification
                                size={heightPercentageToDP('3%')}
                                color={Color('shadow')}
                            />
                        </TouchableOpacity>
                    </View>
                    <Br space={1.5} />
                    <View style={{ flexDirection: 'row', borderRadius: heightPercentageToDP('1%'), alignItems: 'center', gap: heightPercentageToDP('1%'), padding: heightPercentageToDP('1%'), backgroundColor: Color('inputSearch') }}>
                        <SearchNormal
                            size={heightPercentageToDP('3%')}
                            color={Color('modelDark')}
                        />
                        <TextInput onChangeText={((text) => setFilter(text))} value={filter} placeholder="Enter address or city name" placeholderTextColor={Color('modelDark')} style={{ padding: 0, height: heightPercentageToDP('3%'), width: widthPercentageToDP('75%'), color: Color('shadow') }} />
                    </View>
                    <Br space={3} />
                    <View style={{ flexDirection: 'row', borderRadius: heightPercentageToDP('1%'), alignItems: 'center', justifyContent: 'center', gap: heightPercentageToDP('1%') }}>
                        <Btn onPress={() => setMode('cfi')} loading={false} label="CFI" textStyle={{ fontSize: heightPercentageToDP('1.5%') }} btnStyle={{ backgroundColor: Color(mode !== 'cfi' ? 'homeBg' : 'btnColor'), paddingHorizontal: heightPercentageToDP('4%') }} />
                        <Btn onPress={() => setMode('cfii')} loading={false} label="CFII" textStyle={{ fontSize: heightPercentageToDP('1.5%') }} btnStyle={{ backgroundColor: Color(mode !== 'cfii' ? 'homeBg' : 'btnColor'), paddingHorizontal: heightPercentageToDP('4%') }} />
                    </View>
                    <Br space={3} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Pera color={Color('shadow')}>
                            Nearby Service Providers
                        </Pera>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: heightPercentageToDP('0.5%') }}>
                            <Location size={heightPercentageToDP('2%')} color={Color('btnColor')} />
                            <Small heading font="bold" color={Color('btnColor')} style={{ fontSize: heightPercentageToDP('1.1%') }}>Current Location</Small>
                        </View> */}
                    </View>
                    <Br space={2} />
                    {
                        !context?.pro_users && (
                            <View style={{ alignItems: 'center' }}>
                                <ActivityIndicator size={heightPercentageToDP('5%')} color={Color('shadow')} />
                            </View>
                        )
                    }
                    {
                        context?.pro_users?.filter((val) => val?.user_info?.address?.toLowerCase()?.includes(filter?.toLowerCase()) && val?.user_type?.includes(mode))?.map((val, index) => {
                            const distance = calcCrow(parseFloat(context?.user?.latitude), parseFloat(context?.user?.longitude), parseFloat(val?.latitude), parseFloat(val?.longitude));
                            return (
                                <View key={index}>
                                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: heightPercentageToDP('1%'), shadowColor: Color('lightGray'), marginBottom: heightPercentageToDP('2%') }} onPress={() => navigation.navigate('CFIDetail', { id: val?.id })}>
                                        <Image
                                            source={{ uri: `${storageUrl}${val?.user_info?.profile_image}` }}
                                            style={{ width: widthPercentageToDP('25%'), height: widthPercentageToDP('25%'), borderRadius: heightPercentageToDP('2%') }}
                                        />
                                        <View style={{ width: widthPercentageToDP('50%') }}>
                                            <Pera color={Color('shadow')}>
                                                {capitalize(val?.name)}
                                            </Pera>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: heightPercentageToDP('0.5%') }}>
                                                <Location size={heightPercentageToDP('2%')} color={Color('modelDark')} />
                                                <Small color={Color('modelDark')} numberOfLines={1}>
                                                    {val?.user_info?.address || 'No Location Found'}
                                                </Small>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: heightPercentageToDP('0.5%') }}>
                                                <Star1
                                                    size={heightPercentageToDP('2.5%')}
                                                    color={'#FFC000'}
                                                    variant="Bold"
                                                />
                                                <Small color={Color('shadow')}>{parseFloat(val?.avg_rating).toFixed(1) || 0}</Small>
                                                <Small color={Color('modelDark')}>({val?.rating_count || 0})</Small>
                                            </View>
                                        </View>
                                        <Small color={Color('modelDark')}>
                                            {isNaN(distance) ? 0 : Math.round(distance)} km
                                        </Small>
                                    </Pressable>
                                </View>
                            );
                        })
                    }
                    <Br space={10} />
                </Wrapper>
            </Background>
            <Navigation navigation={navigation} />
        </>
    );
};

export default CFISearch;
