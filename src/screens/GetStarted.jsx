/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Platform, Dimensions} from 'react-native';
import Background from '../utils/Background';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Br from '../components/Br';
import {H1, Pera} from '../utils/Text';
import Wrapper from '../components/Wrapper';
import {Color} from '../utils/Colors';
import Btn from '../utils/Btn';
import {LoginCurve} from 'iconsax-react-native';
import {isIOS, trackLaunch} from '../utils/global';
import Orientation from 'react-native-orientation-locker';
import {presentCodeRedemptionSheetIOS} from 'react-native-iap';
import Purchases from 'react-native-purchases';

const GetStarted = ({navigation}) => {
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);

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

  const onGetStartedPress = async () => {
    navigation.navigate('Home')
    // try {
    //   const customerInfo = await Purchases.getCustomerInfo();
    //   console.log(customerInfo.entitlements.active);
    // } catch (error) {
    //   console.log('first ===>', error);
    // }
  };

  const lineHeight = hp('8%');
  return (
    <>
      <Background translucent={true}>
        <Br space={isIOS ? 6 : 8} />
        <Image
          source={require('../assets/images/get_started.png')}
          style={[styles.image, {width: width, height: height * 0.4}]}
        />
        <Br space={5} />
        <Wrapper>
          <H1 size={hp('6%')} style={{lineHeight}} heading font="extraBold">
            WELCOME TO
          </H1>
          <H1 size={hp('6%')} style={{lineHeight}} heading font="extraBold">
            FLY-N-EAT
          </H1>
          <Br space={2} />
          {/* <Pera font="light">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
                    </Pera> */}
          <Br space={3} />
        </Wrapper>
      </Background>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          bottom: isIOS ? hp('5%') : hp('3%'),
          alignSelf: 'center',
          width: width * 0.9,
        }}>
        <Btn
          label="Let’s Get Started"
          icon={<LoginCurve size={hp('3%')} color={Color('text')} />}
          onPress={() => onGetStartedPress()}
        />
      </View>
    </>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  image: {
    width: wp('100%'),
    height: hp('40%'),
    objectFit: 'contain',
  },
});
