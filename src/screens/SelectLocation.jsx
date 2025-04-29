/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
    FlatList,
    Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import BackBtn from '../components/BackBtn';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import {isIOS} from '../utils/global';
import {api, errHandler, note} from '../utils/api';
import axios from 'axios';
import {DataContext} from '../utils/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';

const SelectLocation = ({navigation, route}) => {
  const {context, setContext} = useContext(DataContext);
  const [baseLocation, setBaseLocation] = useState();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState();
  const [places, setPlaces] = useState([]);
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);

    console.log('from select location',context?.token)
  

  useEffect(() => {
    getLocation();
  }, []);


  // console.log('token ===>',context?.token)

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
  

//   useEffect(() => {
//     if (
//       !route?.params?.change &&
//       context?.user &&
//       context?.user?.user_info?.address
//     ) {
//       navigation.replace('Home');
//     }
//   }, [context?.user]);
  async function getLocation() {
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
        const data = response?.data;
        const locationName = data?.results[0]?.formatted_address;

        console.log(data)

        setLocation({
          latitude: crd?.latitude,
          longitude: crd?.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
          locationName: locationName,
        });
      },
      err => {
        console.log(err);
      },
    );
  }

  const onSaveLocation = async () => {
    try {
      // const token = await AsyncStorage.getItem('token2')
      setLoading(true);
      const obj = {
        latitude: baseLocation?.latitude?.toString(),
        longitude: baseLocation?.longitude?.toString(),
      };
      const res = await api.post('/user/user-location', obj, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
      console.log('response',res.data)
      note('Base Location Saved', res?.data?.message);

      const user = await AsyncStorage.getItem('user');
      if (user) {     
           const objj = JSON.parse(user);
        const data = {
          ...objj,
          ...obj,
          user_info: {
            ...objj?.user_info,
            address: res.data?.address,
          },
        };
        await AsyncStorage.setItem('user', JSON.stringify(data));
        setContext({
          ...context,
          user: data,
        });

        if (route?.params?.change || !route?.params?.change) {
          // alert('hello')
          setTimeout(() => {
            navigation.replace('Home');
          }, 1000);
        }
      }
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };
  const onSelectLocation = async (item) => {
    try {
      // const token = await AsyncStorage.getItem('token2')
      // return alert(token)
      setLoading(true);
      const obj = {
        latitude: item?.geometry?.location?.lat?.toString(),
        longitude: item?.geometry?.location?.lng?.toString(),
      };
      // console.log("obj..................", obj)
      const res = await api.post('/user/user-location', obj, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
      console.log('api =====>',res.data)
      note('Base Location Saved', res?.data?.message);

      const user = await AsyncStorage.getItem('user');
      if (user) {
        const objj = JSON.parse(user);
        const data = {
          ...objj,
          ...obj,
          user_info: {
            ...objj?.user_info,
            address: res.data?.address,
          },
        };
        await AsyncStorage.setItem('user', JSON.stringify(data));
        setContext({
          ...context,
          user: data,
        });
        setPlaces([]);
        // alert(route?.params?.change)
        if (route?.params?.change || !route?.params?.change) {
          setTimeout(() => {
            navigation.replace('Home');
          }, 2000);
        }
      }
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async query => {
    const endpoint =
      'https://maps.googleapis.com/maps/api/place/textsearch/json';

    // Define your search parameters
    const params = {
      query: query, // Replace with your search term
      location: `${location?.latitude}, ${location?.longitude}`, // Latitude,Longitude (San Francisco in this example)
      radius: 5000, // Search within 5km
      key: API_KEY,
    };

    axios
      .get(endpoint, {params})
      .then(response => {
        const add = response.data.results;
        setPlaces(add);
      })
      .catch(error => {
        console.error('Error fetching places:', error.message);
      });
  };

  if (!location) {
    return <></>;
  }

  return (
    <>
      <View style={{zIndex: 1}}>
        <BackBtn navigation={navigation} translucent />
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MapView
        initialRegion={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          // latitude: 40.730610,
          // longitude: -73.935242,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{...StyleSheet.absoluteFillObject, flex: 1}}
        zoomLevel={12}
        mapType="standard"
        onPress={e => {
          console.log(e.nativeEvent.coordinate);
          setBaseLocation(e.nativeEvent.coordinate);
        }}>
        {baseLocation && (
          <Marker
            coordinate={{
              latitude: parseFloat(baseLocation?.latitude),
              longitude: parseFloat(baseLocation?.longitude),
            }}
          />
        )}
      </MapView>
      <View
        style={{
          position: 'absolute',
          top: hp('12%'),
          zIndex: 1,
          left: widthPercentageToDP('5%'),
        }}>
        <TextInput
          onChangeText={searchPlaces}
          placeholder="Search Places..."
          style={{
            paddingLeft: widthPercentageToDP('5%'),
            width: widthPercentageToDP('90%'),
            height: hp('5%'),
            paddingVertical: 0,
            backgroundColor: Color('text'),
            borderRadius: hp('1%'),
          }}
        />
        <View
          style={{
            backgroundColor: Color('text'),
            marginTop: hp('1%'),
            borderRadius: hp('1%'),
            maxHeight: hp('50%'),
            overflow: 'scroll',
          }}>
          {loading ? (
            <Small
              style={{padding: hp('1%'), textAlign: 'center'}}
              heading
              font="regular"
              color={Color('homeBg')}>
              Please Wait...
            </Small>
          ) : (
            <FlatList
              data={places}
              renderItem={({item}) => {
                return (
                  <Pressable onPress={() => onSelectLocation(item)}>
                    <Small
                      style={{padding: hp('1%')}}
                      heading
                      font="regular"
                      color={Color('homeBg')}>
                      {item?.name}
                    </Small>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </View>
      {baseLocation && (
        <TouchableOpacity
          disabled={loading}
          onPress={onSaveLocation}
          style={{
            zIndex: 1,
            position: 'absolute',
            bottom: isIOS ? hp('5%') : hp('2%'),
            left: widthPercentageToDP('7.5%'),
            width: widthPercentageToDP('85%'),
            padding: hp('2%'),
            borderRadius: hp('2%'),
            backgroundColor: Color('btnColor'),
          }}>
          <Small style={{textAlign: 'center'}} heading font="regular">
            {loading ? 'Saving...' : 'Save Location'}
          </Small>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SelectLocation;
