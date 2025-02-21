import {Image, StatusBar, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import BackBtn from '../components/BackBtn';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {DataContext} from '../utils/Context';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '../utils/api';
import { Color } from '../utils/Colors';

const Map2 = ({navigation, route}) => {
  const {context} = useContext(DataContext);
  const [currentLocation, setCurrentLocation] = useState(null);

  console.log('restaurat latitude', context?.restuarent.latitude);
  console.log('restaurant longitude', context?.restuarent.longitude);
  console.log('current location', currentLocation);
  console.log('restaurant data',context?.restuarent)

  const restaurantLocation = {
    latitude: context?.restuarent?.latitude || 42.222222,
    longitude: context?.restuarent?.longitude || -120.870053,
  };

  useEffect(() => {
    const startWatchingLocation = () => {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({latitude, longitude});
        },
        error => {
          console.log('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
        },
      );
    };

    startWatchingLocation();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);

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
          latitude: restaurantLocation?.latitude,
          longitude: restaurantLocation?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{...StyleSheet.absoluteFillObject, flex: 1}}
        zoomLevel={12}
        mapType="standard">
        <Marker
          coordinate={restaurantLocation}
          title={context?.restuarent?.title}
          description={context?.restuarent?.description}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: `https://praetorstestnet.com/flyneat/${context?.restuarent?.image.path}`,
              }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 100,
              }}
            />
          </View>
        </Marker>
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            description="This is your current location"
          />
        )}
        {/* {currentLocation && (
          <MapViewDirections
            origin={currentLocation}
            destination={restaurantLocation}
            apikey={API_KEY}
            strokeWidth={4}
            strokeColor={Color('black')}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min`);
            }}
            onError={error => {
              console.error('Directions Error:', error);
            }}
          />
        )} */}
        {/* {currentLocation && (
          <Polyline
            coordinates={[currentLocation, restaurantLocation]}
            strokeColor="#000" 
            strokeWidth={4}
          />
        )} */}
      </MapView>
    </>
  );
};

export default Map2;

const styles = StyleSheet.create({});
