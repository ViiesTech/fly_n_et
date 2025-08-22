import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Background from '../utils/Background';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Br from '../components/Br';
import {Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import Btn from '../utils/Btn';
import {
  Location as Loc,
  Notification,
  TextalignLeft,
} from 'iconsax-react-native';
import Navigation from '../components/Navigation';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {DataContext} from '../utils/Context';
import {api, errHandler, note} from '../utils/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {distance} from '@turf/turf';
import LoaderOverlay from '../components/LoaderOverlay';

// const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';
const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';

const Home = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const [location, setLocation] = useState();
  const [premium, setPremium] = useState(null);
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);
  const [locationLoader, setLocationLoader] = useState(false);

  console.log('context ===>', context?.user);

  useEffect(() => {
    const updateDimensions = () => {
      const {width, height} = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
    };

    // Listen for orientation changes
    Orientation.addOrientationListener(updateDimensions);

    // Listen for dimension changes (e.g. on rotation)
    const dimensionSubscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );

    // Cleanup both listeners
    return () => {
      Orientation.removeOrientationListener(updateDimensions);
      dimensionSubscription?.remove(); // modern API
    };
  }, []);

  useEffect(() => {
    const checkPremium = async () => {
      const result = await AsyncStorage.getItem('isPremium');
      setPremium(result);
    };

    checkPremium();
  }, []);

  const Latitude = context?.user?.latitude;
  const longitude = context?.user?.longitude;

  // console.log('helo3r', context?.user?.user_info.nearest_airport);
  // console.log('first',context?.token)

  useEffect(() => {
    if (context?.token && !context?.user.user_info?.address) {
      // alert('hello')
      // clearLocationDetails()
      // alert('sis')
      requestLocationPermission();
      // getSubscriptionInfo();
      //   convertLatLngToAddr();
    }
  }, [context?.token]);

  const convertLatLngToAddr = async () => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Latitude},${longitude}&key=${API_KEY}`,
    );
    const data = response?.data;
    const locationName = data?.results[0]?.formatted_address;

    console.log(locationName);

    setLocation({
      latitude: Latitude,
      longitude: longitude,
      latitudeDelta: 0.0421,
      longitudeDelta: 0.0421,
      locationName: locationName,
    });
  };

  // const clearLocationDetails = async () => {
  // }

  const getLocation = async place_id => {
    const BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry`;
    const response = await axios.get(BASE_URL);
    await AsyncStorage.setItem(
      'locationDetails',
      JSON.stringify(response.data?.result?.geometry?.location),
    );
  };

  const onSelectLocation = async value => {
    await AsyncStorage.setItem('typedLocation', value?.structured_formatting?.main_text);
    await AsyncStorage.setItem('selectLocation', JSON.stringify(value));
    getLocation(value?.place_id);
  };
  async function requestLocationPermission() {
    // alert('why')
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Fly n Eat',
            message: 'Fly n Eat App access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocations();
          // alert('helo')
        } else {
          console.log('location permission denied');
        }
      } else if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
        getLocations();
      }
    } catch (err) {
      console.warn('what happened', err);
    }
  }

  async function getNearestAirport(lat, lng, locationName) {
    // await AsyncStorage.removeItem('locationDetails')
    // await AsyncStorage.removeItem('selectLocation')

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${lat},${lng}`,
            radius: 50000,
            type: 'airport',
            key: API_KEY,
          },
        },
      );

      const nearest = response?.data?.results?.[0];
      if (nearest) {
        console.log('Nearest Airport:', nearest.name);

        setContext(prev => {
          const updatedUser = {
            ...prev.user,
            latitude: lat,
            longitude: lng,
            user_info: {
              ...prev.user.user_info,
              address: locationName,
              nearest_airport: nearest.name,
              geometry_location: nearest.geometry.location,
            },
          };

          AsyncStorage.setItem('user', JSON.stringify(updatedUser));

          return {...prev, user: updatedUser};
        });

        await AsyncStorage.setItem(
          'locationDetails',
          JSON.stringify(nearest.geometry.location),
        );

        await AsyncStorage.setItem(
          'selectLocation',
          JSON.stringify({
            description: nearest.name,
            place_id: nearest.place_id,
            structured_formatting: {main_text: nearest.name},
          }),
        );
      }
    } catch (err) {
      console.log('Error fetching nearest airport:', err);
    }
  }

  async function getLocations() {
    // Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 });
    setLocationLoader(true);
    Geolocation.getCurrentPosition(
      async pos => {
        console.log('Position received: ', pos);
        const crd = pos.coords;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`,
        );
        const data = response?.data;
        const locationName = data?.results[0]?.formatted_address;

        // console.log('Location Name: ', locationName);
        if (locationName) {
          setLocation({
            latitude: crd?.latitude,
            longitude: crd?.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
            locationName,
          });
          await getNearestAirport(crd.latitude, crd.longitude, locationName);
        } else {
          convertLatLngToAddr();
          //   console.log('Could not get address from lat/lng');
        }
        setLocationLoader(false);
      },
      err => {
        console.log('Geolocation error: ', err);
        alert('failed to fetch location')
        setLocationLoader(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
    // Geolocation.getCurrentPosition(async (pos) => {
    //     const crd = pos.coords;

    //     console.log("crd",crd)

    //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`);
    //     const data = response?.data;
    //     const locationName = data?.results[0]?.formatted_address;

    //     console.log(locationName)
    //     if(locationName){
    //         setLocation({
    //             latitude: crd?.latitude,
    //             longitude: crd?.longitude,
    //             latitudeDelta: 0.0421,
    //             longitudeDelta: 0.0421,
    //             locationName: locationName,
    //         });
    //     }else{
    //         convertLatLngToAddr()
    //     }
    // }, (err) => {
    //     // alert('jello')
    //     console.log('error bro',err);
    // });
  }

  const TopBar = () => {
    return (
      <View style={[styles.topbar, {width: width}]}>
        <View style={{width: width * 0.2, alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color('btnColor'),
              width: hp('5%'),
              height: hp('5%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: hp('50%'),
            }}
            onPress={() => navigation.navigate('SideMenu')}>
            <TextalignLeft size={hp('2.5%')} color={Color('text')} />
          </TouchableOpacity>
        </View>
        <View style={{width: width * 0.6, alignItems: 'center'}}>
          {context?.token &&
            !locationLoader &&
            context?.user.user_info?.address && (
              <>
                <Small heading font="medium">
                  Home Airport
                </Small>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: hp('.5%'),
                  }}>
                  <Loc size={hp('2%')} color={Color('text')} />
                  <Small heading font="bold" numberOfLines={1}>
                    {context?.user?.user_info?.address}
                  </Small>
                </View>
              </>
            )}
        </View>
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
            onPress={() => {
              if (!context?.token) {
                navigation.navigate('Message', {
                  theme: 'light',
                  title: 'Login Required',
                  message: 'Please log in to continue',
                  screen: 'Login',
                });
              } else {
                navigation.navigate('Notifications');
              }
            }}>
            <Notification size={hp('2.5%')} color={Color('text')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const HomeInput1 = ({placeholder}) => {
    const inputRef = useRef(null);
    const [predictions, setPredictions] = useState();
    const [selection, setSelection] = useState('');

    //     useEffect(() => {
    //   const setNearestAirport = async () => {
    //     try {
    //       // const storedAirport = await AsyncStorage.getItem('selectLocation');
    //       // if (storedAirport) {
    //       //   const parsed = JSON.parse(storedAirport);
    //         if (inputRef.current) {
    //           inputRef.current.setNativeProps({
    //             // text: parsed?.structured_formatting?.main_text?.toUpperCase(),
    //             text: context?.user.user_info?.nearest_airport?.toUpperCase()
    //           });
    //         }
    //       // }
    //     } catch (err) {
    //       console.log("Error setting airport:", err);
    //     }
    //   };

    //  if(context.token && !locationLoader && context?.user?.user_info?.nearest_airport) {
    //   setNearestAirport();
    //   }
    // }, []);

    useEffect(() => {
      const restoreSelection = async () => {
        try {
          const savedSelection = await AsyncStorage.getItem('typedLocation');

          const defaultAirport = context?.user?.user_info?.nearest_airport;

          const valueToSet =
            savedSelection !== null ? savedSelection : defaultAirport;

          console.log(savedSelection);

          if (valueToSet && inputRef.current) {
            inputRef.current.setNativeProps({
              text: valueToSet.toUpperCase(),
            });
            setSelection(valueToSet);
          }
        } catch (err) {
          console.log('Error restoring location:', err);
        }
      };

      if (context?.token && !locationLoader) {
        restoreSelection();
      }
    }, [context?.token, locationLoader]);

    const searchAirports = async searchKey => {
      // alert('hello')
      setSelection(searchKey);
      await AsyncStorage.setItem('typedLocation', searchKey);
      // const BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk&types=airport&components=country:us`;
      const BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk&types=airport&components=country:us`;
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          input: 'Restaurants',
          inputtype: 'textquery',
          radius: 5000,
        },
      });
      console.log(response.data);
      setPredictions(response?.data?.predictions);
    };

    const onClick = val => {
      onSelectLocation(val);
      setPredictions();
      setSelection(val?.structured_formatting?.main_text);
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          text: val?.structured_formatting?.main_text?.toUpperCase(),
        });
      }
    };

    return (
      <>
        <View style={{position: 'relative', overflow: 'visible', zIndex: 1}}>
          <View style={styles.input}>
            <TextInput
              autoCapitalize="characters"
              ref={inputRef}
              onChangeText={searchAirports}
              style={styles.inputField}
              placeholderTextColor={Color('lightText')}
              placeholder={placeholder}
              autoCorrect={false}
            />
          </View>
          {predictions && predictions?.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                width: wp('70%'),
                backgroundColor: Color('text'),
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
              }}>
              <ScrollView>
                {predictions?.map((val, index) => {
                  return (
                    <Pressable onPress={() => onClick(val)}>
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
      </>
    );
  };
  // console.log('hello',distance)
  const HomeInput = ({placeholder}) => {
    const setDistance = async text => {
      await AsyncStorage.setItem('distance', text);
    };
    return (
      <View style={styles.input}>
        <TextInput
          autoCapitalize="characters"
          onChangeText={text => setDistance(text.toUpperCase())}
          keyboardType="numeric"
          style={[styles.inputField]}
          placeholderTextColor={Color('lightText')}
          placeholder={placeholder}
        />
      </View>
    );
  };
  const Button = () => {
    const [loading, setLoading] = useState(false);
    const onSearch = async () => {
      const firstsearch = await AsyncStorage.getItem('firstSearch');
      if (
        (!context?.user?.expired_at && !firstsearch) ||
        (context?.user?.expired_at &&
          new Date(context?.user?.expired_at) > new Date()) ||
        premium
      ) {
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
          console.log('json..........', json);
          const res = await api.post(
            '/restaurant/search',
            {
              starting_from: `${json?.lat},${json?.lng}`,
              max_distance: distance,
            },
            {
              headers: {Authorization: `Bearer ${context?.token}`},
            },
          );
          console.log('restauratns responsne', res.data?.restaurant);
          if (res.data?.restaurant?.length > 0) {
            await AsyncStorage.setItem('firstSearch', 'done');
            // setContext({
            //     ...context,
            //     isHome: true
            // })
            navigation.navigate('Map', {
              distance: distance,
              restaurants: res.data?.restaurant,
              location: location,
              airport: JSON.parse(locationDetails),
              airportDetails: JSON.parse(selectLocation),
            });
          } else {
            note(
              'No Result Found',
              "Couldn't find any restaurant according to the given parameters",
            );
          }
        } catch (err) {
          await errHandler(err, null, navigation);
        } finally {
          setLoading(false);
        }
      } else {
        navigation.navigate('Packages');
      }
    };
    return (
      <Btn
        loading={loading}
        onPress={onSearch}
        label="Fly-n-Eat Search"
        btnStyle={{backgroundColor: Color('homeBg'), width: wp('70%')}}
      />
    );
  };
  return (
    <>
      <Background
        translucent={false}
        statusBarColor={Color('homeBg')}
        noBackground>
        <TopBar />
        <View
          style={{
            height: hp('70%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">
            Starting From
          </Pera>
          <Br space={2} />
          <HomeInput1 placeholder="Type Here" />
          <Br space={5} />
          <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">
            Max Distance (NM)
          </Pera>
          <Br space={2} />
          <HomeInput placeholder="Type Here" />
          <Br space={5} />
          <Button />
        </View>
      </Background>
      <Navigation navigation={navigation} />
      <LoaderOverlay text={true} visible={locationLoader} />
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
    width: '100%',
    paddingHorizontal: wp('5%'),
    paddingVertical: Platform.OS === 'android' && 0,
    color: Color('homeBg'),
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    fontSize: hp(2),
    fontWeight: '600',
  },
});
