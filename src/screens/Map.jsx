/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import BackBtn from '../components/BackBtn';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {Callout, Circle, Marker, Polyline} from 'react-native-maps';
import {isIOS, nauticalMilesToMeters} from '../utils/global';
import {Color} from '../utils/Colors';
import {Small} from '../utils/Text';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {DataContext} from '../utils/Context';
import {useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';

const Map = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {context} = useContext(DataContext);
  const [pointToPoint, setPointToPoint] = useState(false);
  const [visitBtn, setVisitBtn] = useState();
  const [airPorts, setAirPorts] = useState([]);
  const [waypoint, setWaypoint] = useState([]);
  const origin = {
    latitude: parseFloat(context?.user?.latitude),
    longitude: parseFloat(context?.user?.longitude),
  };
  const destination = {
    latitude: parseFloat(route?.params?.airport?.lat),
    longitude: parseFloat(route?.params?.airport?.lng),
  };
  const distance = route?.params?.distance || 0;

  console.log('poinnt to point ==>', route?.params?.restaurants);

  useEffect(() => {
    setVisitBtn(false);
  }, [isFocused]);

  useEffect(() => {
    if (pointToPoint) {
      getLocation();
      Toast.show('Point To Point Mode Activated!', Toast.SHORT);
    } else if (waypoint?.length > 0) {
      setWaypoint([]);
    }
  }, [pointToPoint]);

  // Create a refs object for each marker
  const markerRefs = useRef({});

  useEffect(() => {
    // Show callouts for all markers after the map is rendered
    Object.values(markerRefs.current).forEach(marker => {
      if (marker) {
        marker.showCallout();
      }
    });
  }, []);

  async function getCityName(lat, lng, apiKey) {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    try {
      const response = await axios.get(geocodeUrl);
      const results = response.data.results;

      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        const city = addressComponents.find(component =>
          component.types.includes('locality'),
        );
        return city ? city.long_name : null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
      return null;
    }
  }

  async function getAirportsInCity(cityName, apiKey) {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=airports+in+${encodeURIComponent(
      cityName,
    )}&key=${apiKey}`;
    try {
      const response = await axios.get(placesUrl);
      const airports = response.data.results.map(airport => ({
        name: airport.name,
        address: airport.formatted_address,
        location: airport.geometry.location,
      }));
      return airports;
    } catch (error) {
      console.error('Error fetching airports:', error);
      return [];
    }
  }

  async function getLocation() {
    const city = await getCityName(
      route?.params?.airport?.lat,
      route?.params?.airport?.lng,
      API_KEY,
    );
    const airports = await getAirportsInCity(city, API_KEY);
    setAirPorts(airports);
  }

  return (
    <>
      <View style={{zIndex: 1}}>
        <BackBtn navigation={navigation} translucent />
      </View>
      <TouchableOpacity
        onPress={() => setPointToPoint(!pointToPoint)}
        style={{
          zIndex: 1,
          position: 'absolute',
          top: hp('6%'),
          right: widthPercentageToDP('7.5%'),
          paddingVertical: hp('1%'),
          paddingHorizontal: hp('2%'),
          borderRadius: hp('2%'),
          backgroundColor: Color(pointToPoint ? 'drawerBg' : 'btnColor'),
        }}>
        <Small style={{textAlign: 'center'}} heading font="regular">
          Point To Point
        </Small>
      </TouchableOpacity>
      {visitBtn && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RestuarantDetails', {id: visitBtn})
          }
          style={{
            zIndex: 1,
            position: 'absolute',
            bottom: hp('6%'),
            width: widthPercentageToDP('80%'),
            alignSelf: 'center',
            paddingVertical: hp('1.5%'),
            paddingHorizontal: hp('2%'),
            borderRadius: hp('2%'),
            backgroundColor: Color(pointToPoint ? 'drawerBg' : 'btnColor'),
          }}>
          <Small style={{textAlign: 'center'}} heading font="regular">
            Visit Restaurant
          </Small>
        </TouchableOpacity>
      )}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MapView
        initialRegion={{
          latitude: parseFloat(route?.params?.airport?.lat),
          longitude: parseFloat(route?.params?.airport?.lng),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{...StyleSheet.absoluteFillObject, flex: 1}}
        zoomLevel={12}
        mapType="standard"
        onPress={() => setVisitBtn(false)}>
          {
            pointToPoint && waypoint?.length > 0 ?
            <Polyline
            coordinates={[
              origin,
              destination,
              {
                latitude: waypoint[0]?.latitude,
                longitude: waypoint[0]?.longitude,
              }
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
          :
          <Polyline
            coordinates={[
              origin,
              destination
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
          }
        {/* {pointToPoint && waypoint?.length > 0 ? (
          <MapViewDirections
            origin={origin}
            destination={{
              latitude: waypoint[0]?.latitude,
              longitude: waypoint[0]?.longitude,
            }}
            apikey={API_KEY}
            strokeWidth={hp('0.5%')}
            strokeColor="#051638"
            waypoints={[destination]}
          />
        ) : (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={API_KEY}
            strokeWidth={hp('0.5%')}
            strokeColor="#051638"
            waypoints={waypoint}
          />
        )} */}
        {route?.params?.airport && (
          <>
            <Marker
              coordinate={{
                latitude: parseFloat(route?.params?.airport?.lat),
                longitude: parseFloat(route?.params?.airport?.lng),
              }}
              title={
                route?.params?.airportDetails?.structured_formatting?.main_text
              }
              description={route?.params?.airportDetails?.description}>
              <View>
              <Image
                source={require('../assets/images/airport.png')}
                style={{
                  transform: [
                    {translateY: isIOS ? -40 : 0},
                    {translateX: isIOS ? -10 : 40},
                  ],
                  width: hp('4%'),
                  height: hp('4%'),
                }}
                resizeMode="contain"
              />
              <View
                style={{
                  padding: hp('1%'),
                  borderRadius: hp('1%'),
                  backgroundColor: Color('text'),
                  transform: [
                    {translateY: isIOS ? -hp('5%') : 0},
                    {
                      translateX: isIOS
                        ? `-${
                            route?.params?.airportDetails?.structured_formatting
                              ?.main_text?.length * 2.1
                          }%`
                        : 0,
                    },
                  ],
                }}>
                <Small
                  style={{fontSize: hp('1%')}}
                  color={Color('homeBg')}
                  heading
                  font="regular">
                  {
                    route?.params?.airportDetails?.structured_formatting
                      ?.main_text
                  }
                </Small>
              </View>
              </View>
            </Marker>
            <Circle
              center={{
                latitude: parseFloat(route?.params?.airport?.lat),
                longitude: parseFloat(route?.params?.airport?.lng),
              }}
              strokeColor={Color('btnColor')}
              strokeWidth={2}
              fillColor={Color('mapCircleBg')}
              radius={nauticalMilesToMeters(parseFloat(distance))}
            />
          </>
        )}
        {context?.user?.latitude && context?.user?.longitude && (
          <Marker
            coordinate={{
              latitude: parseFloat(context?.user?.latitude),
              longitude: parseFloat(context?.user?.longitude),
            }}
            title="Your Location"
            description="Your pinpoint locaton"
          />
        )}
        {route?.params?.restaurants
          ?.filter(val => val?.latitude && val?.longitude)
          ?.map((val, index) => {
            const Img = isIOS ? Image : WebView;
            console.log('image of restaurat ==>', `https://praetorstestnet.com/flyneat/${val?.image_path}`);
            return (
              // <Marker
              //     coordinate={{
              //         latitude: parseFloat(val?.latitude),
              //         longitude: parseFloat(val?.longitude),
              //     }}
              //     title={val?.title}
              //     description={val?.description}
              //     key={index}
              //     onPress={() => setVisitBtn(val?.id)}
              //     image={{uri: `https://praetorstestnet.com/flyneat/${val?.image_path}`}}
              //     ref={ref => (markerRefs.current[index] = ref)}
              // />
              <Marker
                coordinate={{
                  latitude: parseFloat(val?.latitude),
                  longitude: parseFloat(val?.longitude),
                }}
                // title={val?.title}

                // description={val?.description}
                key={index}
                // image={{uri: `https://praetorstestnet.com/flyneat/${val?.image_path}`}}
                ref={ref => (markerRefs.current[index] = ref)}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={{
                      uri: `https://praetorstestnet.com/flyneat/${val?.image_path}`,
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                    }}
                  />
                </View>
                <Callout onPress={() => navigation.navigate('RestuarantDetails', {id: val?.id})} tooltip>
                  <View
                    style={{
                      width: 200,
                      padding: 10,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Img
                    resizeMode='stretch'
                      style={{height: 100, width: 180, borderRadius: 5}}
                      source={{
                        uri: `https://praetorstestnet.com/flyneat/${val?.image_path}`,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontWeight: 'bold',
                        marginTop: 5,
                        textAlign:'center',
                        marginBottom: 2,
                      }} numberOfLines={2}>
                      {val?.title}
                    </Text>
                    {val?.description && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: 'black',
                          textAlign: 'center',
                          marginBottom:5,
                        }} numberOfLines={3}>
                        {val?.description}
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })}

        {pointToPoint &&
          airPorts
            ?.filter(val => {
              if (
                parseFloat(val?.location?.lat) ===
                  parseFloat(route?.params?.airport?.lat) &&
                parseFloat(val?.location?.lng) &&
                parseFloat(route?.params?.airport?.lng)
              ) {
                return false;
              }
              return true;
            })
            ?.map((val, index) => {
              return (
                <Marker
                  coordinate={{
                    latitude: parseFloat(val?.location?.lat),
                    longitude: parseFloat(val?.location?.lng),
                  }}
                  title={val?.name}
                  description={val?.address}
                  key={index}
                  onPress={() =>
                    setWaypoint([
                      {
                        latitude: parseFloat(val?.location?.lat),
                        longitude: parseFloat(val?.location?.lng),
                      },
                    ])
                  }
                  style={{overflow: 'visible'}}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      source={require('../assets/images/point_to_point.png')}
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </Marker>
              );
            })}
      </MapView>
    </>
  );
};

export default Map;
