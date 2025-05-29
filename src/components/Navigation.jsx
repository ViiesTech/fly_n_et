/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Small} from '../utils/Text';
import Br from './Br';
import {DataContext} from '../utils/Context';
import Orientation from 'react-native-orientation-locker';

const Navigation = ({label, navigation, ...props}) => {
  const {context, setContext} = useContext(DataContext);
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);
  // const [premium, setPremium] = useState(null);
  useEffect(() => {
    const updateDimensions = () => {
      const {width, height} = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
    };

    // console.log(premium);

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

  // useEffect(() => {
  //   const checkPremium = async () => {
  //     const result = await AsyncStorage.getItem('isPremium');
  //     setPremium(result);
  //   };

  //   checkPremium();
  // }, []);

  return (
    <>
      <View style={[styles.navigation, {width: width}]}>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => navigation.navigate('Home')}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/1.png')}
            style={{
              width: hp('3.5%'),
              height: hp('3.5%'),
            }}
          />
          <Br space={0.5} />
          <Small size={hp(1.8)} font="Bold">
            Fly-Eat-Back
          </Small>
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => navigation.navigate('PointToPoint')}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/2.png')}
            style={{
              width: hp('3.5%'),
              height: hp('3.5%'),
            }}
          />
          <Br space={0.5} />
          <Small size={hp(1.8)} font="Bold">
            Point To Point
          </Small>
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => {
            if (context?.token) {
              const expiryDate = context?.user?.expired_at
                ? new Date(context.user.expired_at)
                : null;
              const currentDate = new Date();
              const isExpired =
                !expiryDate || (expiryDate && currentDate > expiryDate);
              if (isExpired) {
                navigation.navigate('Packages');
              } else {
                navigation.navigate('CFISearch');
              }
            } else {
              navigation.navigate('Message', {
                theme: 'light',
                title: 'Login Required',
                message:
                  'To access your subscription benefits, please create or log in to your account',
                screen: 'Login',
              });
            }
          }}>
          <Image
            resizeMode="contain"
            source={require('../assets/images/3.png')}
            style={{
              width: hp('3.5%'),
              height: hp('3.5%'),
            }}
          />
          <Br space={0.5} />
          <Small size={hp(1.8)} font="Bold">
            CFI/CFII
          </Small>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Settings')}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/4.png')}
                        style={{
                            width: hp('3%'),
                            height: hp('3%'),
                        }}
                    />
                    <Br space={0.5} />
                    <Small font="Bold">Setting</Small>
                </TouchableOpacity> */}
      </View>
    </>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  navigation: {
    backgroundColor: Color('homeBg'),
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: hp('2.5%'),
    borderTopLeftRadius: hp('3%'),
    borderTopRightRadius: hp('3%'),
  },
});
