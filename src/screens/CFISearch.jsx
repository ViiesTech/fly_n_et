/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, {useContext, useEffect, useRef, useState} from 'react';
import Background from '../utils/Background';
import {Color} from '../utils/Colors';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BackBtn from '../components/BackBtn';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Pera, Small} from '../utils/Text';
import {
  ArrowLeft,
  Location,
  Notification,
  SearchNormal,
  Star1,
  TextalignLeft,
} from 'iconsax-react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Navigation from '../components/Navigation';
import Wrapper from '../components/Wrapper';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import {api, errHandler, storageUrl} from '../utils/api';
import {DataContext} from '../utils/Context';
import {calcCrow, capitalize} from '../utils/global';

const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';

const CFISearch = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const [location, setLocation] = useState();
  const [filter, setFilter] = useState('');
  const [nauticalLocation,setNauticalLocation] = useState({})
  const [distance, setDistance] = useState('');
  const [mode, setMode] = useState('cfi');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);

  console.log('conntexttt =====>',context?.pro_users)

  useEffect(() => { 
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      getCFI();
    }
  }, [location]);

  // useEffect(() => {
  //   if (filter || nauticalLocation?.lat || distance) {
  //     onSearchCFI(1); // Reset and fetch data on input changes
  //   }
  // }, [filter, nauticalLocation, distance]);

  const getCFI = async (page = 1) => {
    console.log('loadingn value',isLoading);
    if (isLoading) {
      // alert('kia horha hai')
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.get(`/user/pro-users?page=${page}`, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });

      // alert('is this even working ?')

      const newUsers = res?.data?.users?.data || [];
      
      setContext(prevContext => ({
        ...prevContext,
        pro_users:
          page === 1 ? newUsers : [...prevContext.pro_users, ...newUsers],
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
    Geolocation.setRNConfiguration({
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000,
    });
    Geolocation.getCurrentPosition(
      async pos => {
        const crd = pos.coords;
        

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`,
        );
        const data = response.data;
        const locationName = data?.results[0]?.formatted_address;
        setLocation({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
          locationName: locationName,
        });
      },
      err => {
        console.log(err);
      },
    );
  };

  const searchPlaces = async searchKey => {
    setFilter(searchKey);
    if (searchKey.trim().length === 0) {
      getCFI(1); // Reset to default list when input is cleared
      setPredictions([])
      return;
  }
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: searchKey,
          key: API_KEY,
          components: 'country:us',
        },
      },
    );
    // console.log('hh',response?.data)
    setPredictions(response?.data?.predictions);
   
  };

  const getPlaceLocation = async (place_id) => {
    const BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry`;
        const response = await axios.get(BASE_URL);
        console.log('hhhhh ====>',response.data?.result?.geometry?.location)
        setNauticalLocation(response?.data?.result?.geometry?.location)
  }

  const onSearchCFI = async (page = 1) => {
    if (isLoading || !hasMore) {
        return;
      }
      setIsLoading(true);
      try {
        const data = new FormData()
        data.append('starting_from',`${nauticalLocation?.lat},${nauticalLocation?.lng}`)
        data.append('max_distance',distance)
        data.append('page',page)
        data.append('per_page',10)
        // const obj = {
        //         starting_from: `${nauticalLocation?.lat},${nauticalLocation?.lng}`,
        //         max_distance: distance,
        //         page: page,
        //         per_page: 4,
        // }
        const res = await api.post('/user/search-cfii', data, {
          headers: {Authorization: `Bearer ${context?.token}`},
        });

        console.log('responnse of cfgii',res.data?.users?.last_page);
  
        const newUsers = res?.data?.users?.data || [];
        setContext(prevContext => ({
          ...prevContext,
          pro_users:
            page === 1 ? newUsers : [...prevContext.pro_users, ...newUsers],
        }));
        setCurrentPage(page);
        setHasMore(page < res?.data?.users?.last_page || false);
      } catch (err) {
        await errHandler(err, null, navigation);
      } finally {
        // alert('loader false')
        setIsLoading(false);
      }
  };

  const TopBar = () => {
    return (
      <View style={styles.topbar}>
        <View style={{width: wp('20%'), alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color('btnColor'),
              width: hp('5%'),
              height: hp('5%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: hp('50%'),
            }}
            onPress={() => navigation.goBack()}>
            <ArrowLeft size={hp('2.5%')} color={Color('text')} />
          </TouchableOpacity>
        </View>
        {/* <View style={{ width: wp('60%'), alignItems: 'center' }}>
                        <Small heading font="medium">Current Location</Small>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('.5%') }}>
                            <Location size={hp('2%')} color={Color('text')} />
                            <Small heading font="bold" numberOfLines={1}>{context?.user?.user_info?.address}</Small>
                        </View>
                    </View> */}
        <View style={{width: wp('140%'), alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color('btnColor'),
              width: hp('5%'),
              height: hp('5%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: hp('50%'),
            }}
            onPress={() => navigation.navigate('Notifications')}>
            <Notification size={hp('2.5%')} color={Color('text')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Background
        translucent={false}
        statusBarColor={Color('homeBg')}
        noBackground
        detectScrollEnd
        onScrollEnd={() => {
          if (!isLoading && hasMore) {
            getCFI(currentPage + 1);
            onSearchCFI(currentPage + 1);
          }
        }}>
        <TopBar />
        {/* <BackBtn navigation={navigation} /> */}
        <Wrapper>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: hp('8%') }}> */}
          {/* <View style={{ flexDirection: 'row', gap: heightPercentageToDP('1%'), alignItems: 'center', width: widthPercentageToDP('75%') }}>
                            <Location size={heightPercentageToDP('2.5%')} color={Color('btnColor')} />
                            <View>
                                <Small heading font="medium" color={Color('shadow')}>Current Location</Small>
                                <Small color={Color('shadow')} heading font="bold" numberOfLines={1}>{context?.user?.user_info?.address}</Small>
                            </View>
                        </View> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                            <Notification
                                size={hp('3%')}
                                color={Color('shadow')}
                            />
                        </TouchableOpacity> */}
          {/* </View> */}
          {/* <Br space={1.5} /> */}
          <View style={{position: 'relative',overflow: 'visible',zIndex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: hp('1%'),
              alignItems: 'center',
              gap: hp('1%'),
              padding: hp('1%'),
              backgroundColor: Color('inputSearch'),
              marginTop: hp(6),
            }}>
            <SearchNormal size={hp('3%')} color={Color('modelDark')} />
            <TextInput
            //   value={filter?.toUpperCase()}
              ref={inputRef}
              value={filter}
              onChangeText={searchPlaces}
              placeholder="Enter address or city name"
              placeholderTextColor={Color('modelDark')}
              style={{
                padding: 0,
                height: hp('3%'),
                width: wp('75%'),
                color: Color('shadow'),
              }}
            />
            {predictions && predictions?.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: hp(5),
                  width: wp('90%'),
                  backgroundColor: Color('inputSearch'),
                  shadowColor: Color('shadow'),
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  borderRadius: hp('1%'),
                  elevation: 5,
                  zIndex: 3,
                //   maxHeight: hp('30%'),
                  height: hp('10%'),
                }}>
                <ScrollView>
                  {predictions?.map((val, index) => {
                    return (
                      <Pressable
                        onPress={() => {
                            // if (inputRef.current) {
                            //     inputRef.current.setNativeProps({ text: val?.structured_formatting?.main_text?.toUpperCase() });
                            // }
                          setFilter(val?.structured_formatting?.main_text);
                          getPlaceLocation(val?.place_id);
                          setPredictions([]);
                        }}>
                        <Small
                          numberOfLines={1}
                          key={index}
                          color={Color('homeBg')}
                          size={hp(2.6)}
                          style={{padding: hp('0.5%')}}>
                          {val?.structured_formatting?.main_text?.toUpperCase()}
                        </Small>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
          </View>
         <View> 
         <View style={{flexDirection: 'row',alignItems: 'center',gap: 20}}> 
          <View
            style={{
            //   flexDirection: 'row',
              borderRadius: hp('1%'),
              alignItems: 'center',
            //   gap: hp('1%'),
              padding: hp('1%'),
              width: hp(25),
              backgroundColor: Color('inputSearch'),
              marginTop: predictions?.length < 1 ? hp(2) : hp(12),
            }}>
            {/* <SearchNormal size={hp('3%')} color={Color('modelDark')} /> */}
            <TextInput
              keyboardType="numeric"
              onChangeText={text => {
               setDistance(text)
               if (text.trim().length === 0) {
                // alert('why')
                getCFI(1);
              }
            }}
              value={distance}
              placeholder="Distance (NM)"
              placeholderTextColor={Color('modelDark')}
              style={{
                padding: 0,
                height: hp('3%'),
                width: wp('45%'),
                color: Color('shadow'),
              }}
            />
          </View>
          <Btn
              onPress={() => onSearchCFI()}
              loading={false}
              label="Search"
              textStyle={{fontSize: hp('1.5%')}}
              btnStyle={{
                backgroundColor: Color('homeBg'),
                marginTop: predictions?.length < 1 ? hp(2) : hp(12),
                paddingHorizontal: hp('5%'),
              }}
            />
            </View>
            </View>
          <Br space={3} />
          <View
            style={{
              flexDirection: 'row',
              borderRadius: hp('1%'),
              alignItems: 'center',
              justifyContent: 'center',
              gap: hp('1%'),
            }}>
            <Btn
              onPress={() => setMode('cfi')}
              loading={false}
              label="CFI"
              textStyle={{fontSize: hp('1.5%')}}
              btnStyle={{
                backgroundColor: Color(mode !== 'cfi' ? 'homeBg' : 'btnColor'),
                paddingHorizontal: hp('4%'),
              }}
            />
            <Btn
              onPress={() => setMode('cfii')}
              loading={false}
              label="CFII"
              textStyle={{fontSize: hp('1.5%')}}
              btnStyle={{
                backgroundColor: Color(mode !== 'cfii' ? 'homeBg' : 'btnColor'),
                paddingHorizontal: hp('4%'),
              }}
            />
          </View>
          <Br space={3} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Pera color={Color('shadow')}>Nearby Service Providers</Pera>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: heightPercentageToDP('0.5%') }}>
                            <Location size={heightPercentageToDP('2%')} color={Color('btnColor')} />
                            <Small heading font="bold" color={Color('btnColor')} style={{ fontSize: heightPercentageToDP('1.1%') }}>Current Location</Small>
                        </View> */}
          </View>
          <Br space={2} />
          {!context?.pro_users && (
            <View style={{alignItems: 'center'}}>
              <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
            </View>
          )}
          {
                        context?.pro_users
                        ?.filter((val) => val?.user_type?.toLowerCase() === mode?.toLowerCase())
                        ?.map((val, index) => {                
                          // console.log('i am just checking is that true or not',context?.pro_users)
                            // const distance = calcCrow(parseFloat(context?.user?.latitude), parseFloat(context?.user?.longitude), parseFloat(val?.latitude), parseFloat(val?.longitude));
                            return (
                                <View key={index}>
                                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1%'), shadowColor: Color('lightGray'), marginBottom: hp('2%') }} onPress={() => navigation.navigate('CFIDetail', { id: val?.id })}>
                                        <Image
                                            source={{ uri: `${storageUrl}${val?.user_info?.profile_image}` }}
                                            style={{ width: wp('25%'), height: wp('25%'), borderRadius: hp('2%') }}
                                        />
                                        <View style={{ width: wp('50%') }}>
                                            <Pera color={Color('shadow')}>
                                                {capitalize(val?.name)}
                                            </Pera>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('0.5%') }}>
                                                <Location size={hp('2%')} color={Color('modelDark')} />
                                                <Small color={Color('modelDark')} numberOfLines={1}>
                                                    {val?.user_info?.address || 'No Location Found'}
                                                </Small>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('0.5%') }}>
                                                <Star1
                                                    size={hp('2.5%')}
                                                    color={'#FFC000'}
                                                    variant="Bold"
                                                />
                                                <Small color={Color('shadow')}>{!val?.avg_rating ? 0 : parseFloat(val?.avg_rating).toFixed(1)}</Small>
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
                    {/* {
  context?.pro_users?.map((val, index) => (
    <View key={index}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: hp('1%'),
          shadowColor: Color('lightGray'),
          marginBottom: hp('2%'),
        }}
        onPress={() => navigation.navigate('CFIDetail', {id: val?.id})}>
        <Image
          source={{uri: `${storageUrl}${val?.user_info?.profile_image}`}}
          style={{
            width: wp('25%'),
            height: wp('25%'),
            borderRadius: hp('2%'),
          }}
        />
        <View style={{width: wp('50%')}}>
          <Pera color={Color('shadow')}>{capitalize(val?.name)}</Pera>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('0.5%'),
            }}>
            <Location size={hp('2%')} color={Color('modelDark')} />
            <Small color={Color('modelDark')} numberOfLines={1}>
              {val?.user_info?.address || 'No Location Found'}
            </Small>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('0.5%'),
            }}>
            <Star1 size={hp('2.5%')} color={'#FFC000'} variant="Bold" />
            <Small color={Color('shadow')}>
              {parseFloat(val?.avg_rating).toFixed(1) || 0}
            </Small>
            <Small color={Color('modelDark')}>
              ({val?.rating_count || 0})
            </Small>
          </View>
        </View>
        <Small color={Color('modelDark')}>
          {isNaN(distance) ? 0 : Math.round(calcCrow(
            parseFloat(context?.user?.latitude),
            parseFloat(context?.user?.longitude),
            parseFloat(val?.latitude),
            parseFloat(val?.longitude),
          ))} km
        </Small>
      </Pressable>
    </View>
  ))
} */}

          <Br space={10} />
        </Wrapper>
      </Background>
      <Navigation navigation={navigation} />
    </>
  );
};

export default CFISearch;

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: Color('homeBg'),
    paddingVertical: hp('2%'),
    width: wp('100%'),
    flexDirection: 'row',
    borderBottomLeftRadius: hp('4%'),
    borderBottomRightRadius: hp('4%'),
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

