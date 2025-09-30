/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Background from '../utils/Background';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import Btn from '../utils/Btn';
import { Location as Loc, Notification, TextalignLeft } from 'iconsax-react-native';
import Navigation from '../components/Navigation';
// import Geolocation from '@react-native-community/geolocation';
import { DataContext } from '../utils/Context';
import { api, errHandler, note } from '../utils/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDistance, nauticalMilesToMeters } from '../utils/global';
import Orientation from 'react-native-orientation-locker';
import LoaderOverlay from '../components/LoaderOverlay';
import Geolocation from 'react-native-geolocation-service';


const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';

const PointToPoint = ({ navigation }) => {
    const { context,setContext } = useContext(DataContext);
    const [location, setLocation] = useState();
    const [premium,setPremium] = useState(null)
    const [width, setScreenWidth] = useState(Dimensions.get('window').width);
    const [height, setScreenHeight] = useState(Dimensions.get('window').height);
    // const [locationLoader,setLocationLoader] = useState(false)


    useEffect(() => {
        const updateDimensions = () => {
          const { width, height } = Dimensions.get('window');
          setScreenWidth(width);
          setScreenHeight(height);
        };
    
        // Listen for orientation changes
        Orientation.addOrientationListener(updateDimensions);
    
        // Listen for dimension changes (e.g. on rotation)
        const dimensionSubscription = Dimensions.addEventListener('change', updateDimensions);
    
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

    // console.log('user',context?.isPoint)

    useEffect(() => {
      if(context?.token && context?.user.location.geometry_location) {  
        getLocations()
        // requestLocationPermission();
        }
    }, []);

    const getLocation = async (place_id) => {
        const BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry`;
        const response = await axios.get(BASE_URL);
        await AsyncStorage.setItem('p2p_locationDetails', JSON.stringify(response.data?.result?.geometry?.location));
    };
    const getLocation2 = async (place_id) => {
        const BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry`;
        const response = await axios.get(BASE_URL);
        await AsyncStorage.setItem('p2p_locationDetails2', JSON.stringify(response.data?.result?.geometry?.location));
    };
    const onSelectLocation = async (value) => {
        await AsyncStorage.setItem('typedLocation2',value?.structured_formatting?.main_text)
        await AsyncStorage.setItem('p2p_selectLocation', JSON.stringify(value));
        getLocation(value?.place_id);
    };
    const onSelectLocation2 = async (value) => {
        await AsyncStorage.setItem('p2p_selectLocation2', JSON.stringify(value));
        getLocation2(value?.place_id);
    };
    // async function requestLocationPermission() {
    //     try {
    //         if (Platform.OS === 'android') {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                 {
    //                     title: 'Fly n Eat',
    //                     message: 'Fly n Eat App access to your location',
    //                 }
    //             );

    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 getLocations();
    //             } else {
    //                 console.log('location permission denied');
    //             }
    //         } else if (Platform.OS === 'ios') {
    //             Geolocation.requestAuthorization();
    //             getLocations();
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // }

//  async function getNearestAirport(lat, lng) {
//       // await AsyncStorage.removeItem('locationDetails')
//       // await AsyncStorage.removeItem('selectLocation')

//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
//       {
//         params: {
//           location: `${lat},${lng}`,
//           radius: 50000, 
//           type: 'airport',
//           key: API_KEY,
//         },
//       },
//     );

//     const nearest = response?.data?.results?.[0];
//     if (nearest) {
//       console.log("Nearest Airport:", nearest.name);

//       await AsyncStorage.setItem(
//         'p2p_locationDetails',
//         JSON.stringify(nearest.geometry.location),
//       );

//       await AsyncStorage.setItem(
//         'p2p_selectLocation',
//         JSON.stringify({
//           description: nearest.name,
//           place_id: nearest.place_id,
//           structured_formatting: { main_text: nearest.name },
//         }),
//       );
      
//     }
//   } catch (err) {
//     console.log("Error fetching nearest airport:", err);
//   }
// }


    async function getLocations() {
        // Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 });
        // Geolocation.getCurrentPosition(async (pos) => {
        //     const crd = pos.coords;

        //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`);
        //     const data = response?.data;
        //     const locationName = data?.results[0]?.formatted_address;

        //     setLocation({
        //         latitude: crd?.latitude,
        //         longitude: crd?.longitude,
        //         latitudeDelta: 0.0421,
        //         longitudeDelta: 0.0421,
        //         locationName: locationName,
        //     });
        //          await getNearestAirport(crd.latitude,crd.longitude)
        // }, (err) => {
        //     console.log(err);
        // });
        // setLocationLoader(true)
    //      Geolocation.getCurrentPosition(
    //   async pos => {
    //     console.log('Position received: ', pos);
    //     const crd = pos.coords;

    //     const response = await axios.get(
    //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`,
    //     );
    //     const data = response?.data;
    //     const locationName = data?.results[0]?.formatted_address;

    //     console.log('Location Name: ', locationName);
    //       setLocation({
    //         latitude: crd?.latitude,
    //         longitude: crd?.longitude,
    //         latitudeDelta: 0.0421,
    //         longitudeDelta: 0.0421,
    //         locationName,
    //       });
    //     //  await getNearestAirport(crd.latitude,crd.longitude)
      
    //     //   console.log('Could not get address from lat/lng');
    //     // setLocationLoader(false)
    //   },
    //   err => {
    //     console.log('Geolocation error: ', err);
    //     // setLocationLoader(false)
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 15000,
    //     maximumAge: 10000,
    //     forceRequestLocation: true,
    //     showLocationDialog: true,
    //   },
    // );
    await AsyncStorage.setItem('p2p_locationDetails',JSON.stringify(context?.user.location.geometry_location))
    }
    const TopBar = () => {
        return (
            <View style={[styles.topbar,{width: width}]}>
                <View style={{ width: width * 0.2, alignItems: 'center' }}>
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
                <View style={{ width: width * 0.6, alignItems: 'center' }}>
                     {context?.token &&
                                       <>
                                        <Small heading font="medium">Home Airport</Small>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('.5%') }}>
                                            <Loc size={hp('2%')} color={Color('text')} />
                                            <Small heading font="bold" numberOfLines={1}>{context?.user?.location?.address}</Small>
                                        </View>
                                        </>
                                        }
                </View>
                <View style={{ width: wp('20%'), alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        backgroundColor: Color('btnColor'),
                        width: hp('5%'),
                        height: hp('5%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: hp('50%'),
                    }} onPress={() => {
                        if(!context?.token) {
                            navigation.navigate('Message',{theme: 'light', title: 'Login Required', message: 'Please log in to continue', screen: 'Login'})
                        } else {
                            navigation.navigate('Notifications')
                        }
                }}>
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

//          useEffect(() => { 
//     const setNearestAirport = async () => {
//       try {
//         // const storedAirport = await AsyncStorage.getItem('p2p_selectLocation');
//         // if (storedAirport) {
//         //   const parsed = JSON.parse(storedAirport);
//           if (inputRef.current) {
//             inputRef.current.setNativeProps({
//             //   text: parsed?.structured_formatting?.main_text?.toUpperCase(),
//             text: context?.user.user_info.nearest_airport?.toUpperCase()
//             });
//           }
//         // }
//       } catch (err) {
//         console.log("Error setting airport:", err);
//       }
//     };

//    if(context.token && context?.user.user_info.nearest_airport) { 
//     setNearestAirport();
//     }
//   }, []);


    useEffect(() => {
      const restoreSelection = async () => {
        try {
          const savedSelection = await AsyncStorage.getItem('typedLocation2');

          const defaultAirport = context?.user?.location?.nearest_airport;

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

      if (context?.token) {
        restoreSelection();
      }
    }, [context?.token]);

        const searchAirports = async (searchKey) => {
            setSelection(searchKey)
            await AsyncStorage.setItem('typedLocation2',searchKey)
            const BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk&types=airport&components=country:us`;
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
                inputRef.current.setNativeProps({ text: val?.structured_formatting?.main_text.toUpperCase() });
            }
        };

        return (
            <>
                <View style={{position: 'relative', overflow: 'visible', zIndex: 1}}>
                    <View style={styles.input}>
                        <TextInput autoCapitalize='characters' numberOfLines={1} ref={inputRef} onChangeText={searchAirports} style={styles.inputField} placeholderTextColor={Color('lightText')} placeholder={placeholder} />
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
                                                <Small size={hp(2.6)} numberOfLines={1} key={index} color={Color('homeBg')} style={{ padding: hp('0.5%') }}>{val?.structured_formatting?.main_text.toUpperCase()}</Small>
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
    const HomeInput2 = ({ placeholder }) => {
        const inputRef = useRef(null);
        const [predictions, setPredictions] = useState();
        const [selection, setSelection] = useState('');
        const searchAirports = async (searchKey) => {
            const BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk&types=airport&components=country:us`;
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
            onSelectLocation2(val);
            setPredictions();
            setSelection(val?.structured_formatting?.main_text);
            if (inputRef.current) {
                inputRef.current.setNativeProps({ text: val?.structured_formatting?.main_text.toUpperCase() });
            }
        };

        return (
            <>
                <View style={{position: 'relative', overflow: 'visible', zIndex: 1}}>
                    <View style={styles.input}>
                        <TextInput autoCapitalize='characters' numberOfLines={1} ref={inputRef} onChangeText={searchAirports} style={styles.inputField} placeholderTextColor={Color('lightText')} placeholder={placeholder} />
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
                                                <Small size={hp(2.6)} numberOfLines={1} key={index} color={Color('homeBg')} style={{ padding: hp('0.5%') }}>{val?.structured_formatting?.main_text.toUpperCase()}</Small>
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
            await AsyncStorage.setItem('p2p_distance', text);
        };
        return (
            <View style={styles.input}>
                <TextInput autoCapitalize='characters' numberOfLines={1} onChangeText={(text) => setDistance(text.toUpperCase())} keyboardType="numeric" style={[styles.inputField]} placeholderTextColor={Color('lightText')} placeholder={placeholder} />
            </View>
        );
    };

    const Button = () => {
        const [loading, setLoading] = useState(false);
        const onSearch = async () => {
            await AsyncStorage.removeItem('search')
              const firstSearch = await AsyncStorage.getItem('search')
            if(!context?.user?.expired_at && !firstSearch || context?.user?.expired_at && new Date(context?.user?.expired_at) > new Date() || premium) {
                // alert('why is hapenning')
            try {
                setLoading(true);
                const locationDetails = await AsyncStorage.getItem('p2p_locationDetails');
                const locationDetails2 = await AsyncStorage.getItem('p2p_locationDetails2');
                const distance = await AsyncStorage.getItem('p2p_distance');
                const selectLocation = await AsyncStorage.getItem('p2p_selectLocation');
                const selectLocation2 = await AsyncStorage.getItem('p2p_selectLocation2');

                if (!locationDetails || !locationDetails2 || !distance) {
                    note('Validation Error', 'Location and max distance is required');
                    return false;
                }

                // const calculateNewCircle = (circle1, circle2, radius1, radius2) => {
                //     // return console.log('value from function',circle1,circle2,radius1,radius2)
                //     const distanceBetweenCenters = calculateDistance(circle1, circle2);
                
                //     // The new radius should cover both circles fully
                //     const newRadius = distanceBetweenCenters / 2 + Math.max(radius1, radius2);
                //     // console.log('new radius from function',distanceBetweenCenters)
                
                //     // Calculate the center point of the new circle
                //     const newCircleCenter = {
                //       latitude: (circle1.lat + circle2.lat) / 2,
                //       longitude: (circle1.lng + circle2.lng) / 2,
                //     };
                
                //     return {newCircleCenter, newRadius};
                //   };

                  
                //   const userRadiusMeters = nauticalMilesToMeters(distance);
                  
                // //   console.log('distance',userRadiusMeters)
                //     // console.log(JSON.parse(locationDetails))
                
                // // Define the centers of the two existing circles
                const circle1Center = JSON.parse(locationDetails)
                const circle2Center = JSON.parse(locationDetails2)

                const getPolylineCoordinates = (origin, destination, steps = 100) => {
                    // console.log('result from functionn,',origin,destination)
                  
                    const lat1 = origin.lat;
                    const lon1 = origin.lng;
                    const lat2 = destination.lat;
                    const lon2 = destination.lng;
                    const latDiff = lat2 - lat1;
                    const lonDiff = lon2 - lon1;
                    const coordinates = [];
                    for (let i = 0; i <= steps; i++) {
                      const lat = lat1 + (latDiff * i) / steps;
                      const lon = lon1 + (lonDiff * i) / steps;
                      coordinates.push({ lat: lat, lng: lon });
                    }
                    return coordinates;
                  };
                  
                  const coords = getPolylineCoordinates(circle1Center, circle2Center);
                //   return console.log('hhh',coords)

              
                // // Get the new circle details
                // const {newCircleCenter, newRadius} = calculateNewCircle(
                //   circle1Center,
                //   circle2Center,
                //   userRadiusMeters,
                //   userRadiusMeters,
                // );

                // return console.log('new data',newCircleCenter,newRadius) 

                const json = JSON.parse(locationDetails);
                const json2 = JSON.parse(locationDetails2);
                // return console.log(`${json2?.lat},${json2?.lng}`)
                const res = await api.post('/restaurant/pintopin', {
                    // starting_from : `${31.6732571152},${-81.82698821}`,
                    // destination: `${3.14961209},${-8.43934117}`,
                    starting_from: `${json?.lat},${json?.lng}`,
                    destination: `${json2?.lat},${json2?.lng}`,
                    max_distance: distance,
                    latlng_array: coords
                    // radius: 1490758.868626875,
                }, {
                    headers: { Authorization: `Bearer ${context?.token}` },
                });
                console.log('api response',res?.data?.restaurant);
                if (res.data?.restaurant?.length > 0) {
                    await AsyncStorage.setItem('search','done')
                    // setContext({
                    //     ...context,
                    //     isPoint: true
                    // })
                    navigation.navigate('Map', {
                        distance: distance,
                        restaurants: res.data?.restaurant,
                        location: location,
                        airport: JSON.parse(locationDetails),
                        airportDetails: JSON.parse(selectLocation),
                        airport2: JSON.parse(locationDetails2),
                        airportDetails2: JSON.parse(selectLocation2),
                        p2p: true,
                    });
                }else {
                    note('No Result Found', "Couldn't find any restaurant according to the given parameters");
                }
            } catch (err) {
                console.log('error',err)
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
                    <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">Starting Airport</Pera>
                    <Br space={2} />
                    <HomeInput1 placeholder="Type Here" />
                    <Br space={5} />
                    <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">Destination</Pera>
                    <Br space={2} />
                    <HomeInput2 placeholder="Type Here" />
                    <Br space={5} />
                    <Pera size={hp(2.2)} color={Color('homeBg')} heading font="bold">Max Distance (NM)</Pera>
                    <Br space={2} />
                    <HomeInput placeholder="Type Here" />
                    <Br space={5} />
                    <Button />
                </View>
            </Background>
            <Navigation navigation={navigation} />
            {/* <LoaderOverlay text={true} visible={locationLoader} /> */}
        </>
    );
};

export default PointToPoint;

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
        alignItems:'center',
        justifyContent:'center',
        height: hp('5%'),
    },
    inputField: {
        borderRadius: hp('50%'),
        width: '100%',
        paddingHorizontal: wp('5%'),
        color: Color('homeBg'),
        paddingVertical: Platform.OS === 'android' && 0,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: hp(2)
    },
});
