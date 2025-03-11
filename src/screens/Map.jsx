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
import MapView, {
  Callout,
  Circle,
  Marker,
  Polygon,
  Polyline,
} from 'react-native-maps';
import {
  calculateDistance,
  calculateDynamicCircleRadius,
  generateEllipseCoordinates,
  getDistanceBetweenPoints,
  isIOS,
  nauticalMilesToMeters,
} from '../utils/global';
import {Color} from '../utils/Colors';
import {Small} from '../utils/Text';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {DataContext} from '../utils/Context';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';

// const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';
const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';

// const getPolylineCoordinates = (origin, destination, steps = 100) => {
//   const lat1 = origin.latitude;
//   const lon1 = origin.longitude;
//   const lat2 = destination.latitude;
//   const lon2 = destination.longitude;
//   const latDiff = lat2 - lat1;
//   const lonDiff = lon2 - lon1;
//   const coordinates = [];
//   for (let i = 0; i <= steps; i++) {
//     const lat = lat1 + (latDiff * i) / steps;
//     const lon = lon1 + (lonDiff * i) / steps;
//     coordinates.push({ latitude: lat, longitude: lon });
//   }
//   return coordinates;
// };

const Map = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {context, setContext} = useContext(DataContext);
  const [airPorts, setAirPorts] = useState([]);
  const [waypoint, setWaypoint] = useState([]);
  const [polylineCoordinates,setPolylineCoordinates] = useState([])
  const mapRef = useRef(null);
  const origin = {
    latitude: parseFloat(context?.user?.latitude),
    longitude: parseFloat(context?.user?.longitude),
  };
  const destination = {
    latitude: parseFloat(route?.params?.airport?.lat),
    longitude: parseFloat(route?.params?.airport?.lng),
  };

  // const latitudeMid = (route?.params?.airport?.lat + route?.params?.airport2?.lat) / 2;
  // const longitudeMid = (route?.params?.airport?.lng +  route?.params?.airport2?.lng) / 2;

  // console.log(latitudeMid,longitudeMid)

  // Determine larger radius (assuming both circles have a known radius)
  // const radius1 = 500; // Example radius
  // const radius2 = 700; // Example radius
  // const maxRadius = Math.max(radius1, radius2);

  // Set oval dimensions
  // const minorAxis = maxRadius * 1.5; // Adjust as needed for better coverage

  // console.log('restaurant detail ===>',context?.restuarent.latitude)

  useFocusEffect(
    React.useCallback(() => {
      if (context?.returnFromDetail && context?.restuarent) {
        // alert('hello world')
        mapRef.current.animateToRegion(
          {
            latitude: context?.restuarent?.latitude,
            longitude: context?.restuarent?.longitude,
            latitudeDelta: 6.8,
            longitudeDelta: 6.8,
          },
          200,
        );
        setContext({
          ...context,
          returnFromDetail: false,
        });
      }
    }, [context?.returnFromDetail, context?.restuarent]),
  );

  const origin2 = {
    latitude: parseFloat(route?.params?.airport?.lat),
    longitude: parseFloat(route?.params?.airport?.lng),
  };
  const destination2 = {
    latitude: parseFloat(route?.params?.airport2?.lat),
    longitude: parseFloat(route?.params?.airport2?.lng),
  };
  const distance = route?.params?.distance || 0;

  const circle1 = {
    latitude: route?.params?.airport?.lat,
    longitude: route?.params?.airport?.lng,
  };
  const circle2 = {
    latitude: route?.params?.airport2?.lat,
    longitude: route?.params?.airport2?.lng,
  };

  // // Calculate the distance between the two circles' centers
  const majorAxis = getDistanceBetweenPoints(
    circle1.latitude,
    circle1.longitude,
    circle2.latitude,
    circle2.longitude,
  );

  // Minor axis adjustment based on the distance or desired stretch factor
  const minorAxis = nauticalMilesToMeters(distance); // Adjust this multiplier for proper stretch

  // Calculate the center of the oval (midpoint of the two circle centers)
  const centerLat = (circle1.latitude + circle2.latitude) / 2;
  const centerLng = (circle1.longitude + circle2.longitude) / 2;

  // Generate the coordinates for the oval
  const ellipseCoordinates = generateEllipseCoordinates(
    centerLat,
    centerLng,
    majorAxis,
    minorAxis,
  );
  console.log('elipse coordinates',ellipseCoordinates)

  const calculateNewCircle = (circle1, circle2, radius1, radius2) => {
    // return console.log('value from function',circle1,circle2,radius1,radius2)
    const distanceBetweenCenters = calculateDistance(circle1, circle2);

    // The new radius should cover both circles fully
    const newRadius = distanceBetweenCenters / 2 + Math.max(radius1, radius2);

    // Calculate the center point of the new circle
    const newCircleCenter = {
      latitude: (circle1.latitude + circle2.latitude) / 2,
      longitude: (circle1.longitude + circle2.longitude) / 2,
    };

    return {newCircleCenter, newRadius};
  };

  const userRadiusMeters = nauticalMilesToMeters(distance);

  

  // useEffect(() => {
  //   // Get polyline coordinates between origin and destination
  //   const coords = getPolylineCoordinates(origin2, destination2);
  //   setPolylineCoordinates(coords);
  // }, []);

  // Define the centers of the two existing circles
  // const circle1Center = {
  //   latitude: route?.params?.airport?.lat,
  //   longitude: route?.params?.airport?.lng,
  // };
  // const circle2Center = {
  //   latitude: route?.params?.airport2?.lat,
  //   longitude: route?.params?.airport2?.lng,
  // };

  // // Get the new circle details
  // const {newCircleCenter, newRadius} = calculateNewCircle(
  //   circle1Center,
  //   circle2Center,
  //   userRadiusMeters,
  //   userRadiusMeters,
  // );

  // // calculateNewCircle(circle1Center,circle2Center,userRadiusMeters,userRadiusMeters)
  // // Log the values to ensure correctness
  // console.log('New Circle Center:', newCircleCenter);
  // console.log('New Circle Radius:', newRadius);

  console.log('hello world', route?.params?.restaurants);

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
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MapView
        initialRegion={{
          latitude: parseFloat(route?.params?.airport?.lat),
          longitude: parseFloat(route?.params?.airport?.lng),
          latitudeDelta: 6.8,
          longitudeDelta: 6.8,
        }}
        ref={mapRef}
        style={{...StyleSheet.absoluteFillObject, flex: 1}}
        zoomLevel={12}
        mapType="standard">
        {route?.params?.p2p && (
          <Polyline
            coordinates={[origin2,destination2]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
        ) 
          // <Polyline
          //   coordinates={[origin, destination]}
          //   strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          //   strokeWidth={6}
          // />
        }
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
              description={route?.params?.airportDetails?.description}
              anchor={{x: 0.5, y: 0.4}}>
              {!route?.params?.p2p ? (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={require('../assets/images/airport.webp')}
                    style={{
                      width: hp('4%'),
                      height: hp('4%'),
                    }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      padding: hp('1%'),
                      borderRadius: hp('1%'),
                      // backgroundColor: Color('text'),
                      // transform: [
                      //   {translateY: isIOS ? -hp('5%') : 0},
                      //   {
                      //     translateX: isIOS
                      //       ? `-${
                      //           route?.params?.airportDetails?.structured_formatting
                      //             ?.main_text?.length * 2.1
                      //         }%`
                      //       : 0,
                      //   },
                      // ],
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
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/images/airport.webp')}
                    style={{
                      width: hp('4%'),
                      height: hp('4%'),
                    }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      padding: hp('1%'),
                      borderRadius: hp('1%'),
                      // backgroundColor: Color('text'),
                      // transform: [
                      //   {translateY: isIOS ? -hp('5%') : 0},
                      //   {
                      //     translateX: isIOS
                      //       ? `-${
                      //           route?.params?.airportDetails2?.structured_formatting
                      //             ?.main_text?.length * 2.1
                      //         }%`
                      //       : 0,
                      //   },
                      // ],
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
              )}
            </Marker>
            {!route?.params?.p2p ? (
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
            ) : (
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
            )}
            {console.log(route.params?.airport2)}
            {route?.params?.p2p && (
              <>
               {/* <Circle 
                  center={newCircleCenter}
                  radius={newRadius}
                  strokeColor={Color('btnColor')}
                  strokeWidth={2}
                  fillColor={Color('mapCircleBg')}
                /> */}
                {/* <Polygon 
                  coordinates={ellipseCoordinates}
                  strokeColor={Color('black')}
                  strokeWidth={2}
                  fillColor={Color('mapCircleBg')}
                /> */}
                <Circle
                  center={{
                    latitude: parseFloat(route?.params?.airport2?.lat),
                    longitude: parseFloat(route?.params?.airport2?.lng),
                  }}
                  strokeColor={Color('btnColor')}
                  strokeWidth={2}
                  fillColor={Color('mapCircleBg')}
                  radius={nauticalMilesToMeters(parseFloat(distance))}
                />
              </>
            )}
          </>
        )}
        {/* {console.log(route?.params?.airport2)} */}

        {route?.params?.airport2 && (
          <>
            <Marker
              coordinate={{
                latitude: parseFloat(route?.params?.airport2?.lat),
                longitude: parseFloat(route?.params?.airport2?.lng),
              }}
              title={
                route?.params?.airportDetails2?.structured_formatting?.main_text
              }
              description={route?.params?.airportDetails2?.description}
              anchor={{x: 0.5, y: 0.4}}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={require('../assets/images/airport.webp')}
                  style={{
                    width: hp('4%'),
                    height: hp('4%'),
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    padding: hp('1%'),
                    borderRadius: hp('1%'),
                    // backgroundColor: Color('text'),
                    // transform: [
                    //   {translateY: isIOS ? -hp('5%') : 0},
                    //   {
                    //     translateX: isIOS
                    //       ? `-${
                    //           route?.params?.airportDetails2?.structured_formatting
                    //             ?.main_text?.length * 2.1
                    //         }%`
                    //       : 0,
                    //   },
                    // ],
                  }}>
                  <Small
                    style={{fontSize: hp('1%')}}
                    color={Color('homeBg')}
                    heading
                    font="regular">
                    {
                      route?.params?.airportDetails2?.structured_formatting
                        ?.main_text
                    }
                  </Small>
                </View>
              </View>
            </Marker>
          </>
        )}

        {/* {!route?.params?.p2p &&
          context?.user?.latitude &&
          context?.user?.longitude && (
            // <Marker
            //   coordinate={{
            //     latitude: parseFloat(context?.user?.latitude),
            //     longitude: parseFloat(context?.user?.longitude),
            //   }}
            //   title="Your Location"
            //   description="Your pinpoint locaton"
            // />
          )} */}
        {route?.params?.restaurants
          ?.filter(val => val?.latitude && val?.longitude)
          ?.map((val, index) => {
            const Img = isIOS ? Image : WebView;
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
                      uri: `https://praetorstestnet.com/flyneat/${val?.image?.path}`,
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                    }}
                  />
                </View>
                <Callout
                  onPress={() => {
                    // return console.log('hello world',val)
                    navigation.navigate('RestuarantDetails', {id: val?.id})
                  }
                  }
                  tooltip>
                  <View
                    style={{
                      width: 200,
                      padding: 10,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Img
                      resizeMode="stretch"
                      style={{height: 100, width: 180, borderRadius: 5}}
                      source={{
                        uri: `https://praetorstestnet.com/flyneat/${val?.image?.path}`,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontWeight: 'bold',
                        marginTop: 5,
                        textAlign: 'center',
                        marginBottom: 2,
                      }}
                      numberOfLines={2}>
                      {val?.title}
                    </Text>
                    {val?.description && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: 'black',
                          textAlign: 'center',
                          marginBottom: 5,
                        }}
                        numberOfLines={3}>
                        {val?.description}
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>
    </>
  );
};

export default Map;
