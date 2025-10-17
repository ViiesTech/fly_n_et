/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color} from '../utils/Colors';
import {H5, Small} from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import {drawerInner, drawerStyle} from '../utils/global';
import Input from '../components/Input';
import RadioBtn from '../components/RadioBtn';
import {useIsFocused} from '@react-navigation/native';
import * as Yup from 'yup';
import {api, baseUrl, errHandler, note} from '../utils/api';
import {DataContext} from '../utils/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Purchases from 'react-native-purchases';
import LoaderOverlay from '../components/LoaderOverlay';

const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter your valid email address to login.')
    .email('Please enter a valid email address.')
    .max(100, 'Email must be at most 100 characters'),
  password: Yup.string().required('Please enter your exact password.'),
});

const Login = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const IsFocused = useIsFocused();
  // const [slideAnimation] = useState(new Animated.Value(hp('100%')));
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState();

  console.log('user info ==>', context?.user?.sub_type);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     Animated.timing(slideAnimation, {
  //       toValue: hp('1%'),
  //       duration: 1000,
  //       useNativeDriver: true,
  //     }).start();
  //   }, 200);
  //   return () => clearTimeout(timeout);
  // }, [IsFocused]);

  // console.log('hh', context);

  useEffect(() => {
    if (
      !context?.skipNavigationCheck &&
      context?.token &&
      context?.isVerified
    ) {
      Toast.show('Login Successfully', Toast.SHORT);
      // console.log('atleast wrk',context?.user?.expired_at)
      // handlingNavigations();
    } else if (
      !context?.skipNavigationCheck &&
      context?.token &&
      !context?.isVerified
    ) {
      nextScreen(() => navigation.replace('Verify'));
    }
  }, [context?.token, context?.isVerified]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handlingNavigations = async (sub_type, token,userData,transactionId) => {
    const user = userData || context?.user;

    if (!user?.user_info) {
      console.log('Navigating to UserType because profile is missing');
      nextScreen(() => navigation.navigate('UserType'));
    } else {
      const updatedExpiry = await getSubscriptionInfo(sub_type, token,transactionId);
      const expiryDate = updatedExpiry
        ? new Date(updatedExpiry)
        : context?.user?.expired_at
        ? new Date(context.user.expired_at)
        : null;

      const currentDate = new Date();

      const isPremium = await AsyncStorage.getItem('isPremium');
      // const isPremiumParsed = JSON.parse(isPremium);

      console.log('is premium', isPremium);

      const isExpired = !expiryDate || currentDate > expiryDate;

      console.log('isExpired', isExpired);

      if (Platform.OS === 'ios' && isPremium) {
        // alert('premium true tou nhi hai')
        if (isPremium) {
          try {
            const iosSubType = 'monthly';
            const formData = new FormData();
            formData.append('sub_type', iosSubType);
            setApiLoading(true);
            await AsyncStorage.removeItem('isPremium');
            const response = await axios.post(
              `${baseUrl}/user/subscribe`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${context?.token}`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            );
            // console.log(response?.data?.user);
            const updatedUser = response?.data?.user;
            if (updatedUser) {
              // await AsyncStorage.setItem('token', context?.token);
              // await AsyncStorage.setItem('isVerified', JSON.stringify(true));
              // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

              // setContext({
              //   ...context,
              //   token: context?.token,
              //   isVerified: true,
              //   user: updatedUser,
              //   skipNavigationCheck: false,
              // });
              setContext(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  expired_at: response?.data?.user?.expired_at,
                  sub_type: response?.data?.user?.sub_type,
                },
              }));
              navigation.replace('Home');
            }
            // setApiLoading(false);
            return;
          } catch (error) {
            console.log('Error updating free trial to subscription:', error);
          } finally {
            setApiLoading(false);
          }
        }
      }

      if (isExpired) {
        console.log('check the expiry');
        nextScreen(() => navigation.navigate('Packages'));
      } else {
        nextScreen(() => navigation.replace('Home'));
      }

      setContext(prev => ({
        ...prev,
        skipNavigationCheck: false,
      }));
    }
  };

  // const getSubscriptionInfo = async () => {
  //   console.log('subscriptiom',context?.subscribed_details)
  //   if (!context?.subscribed_details) return null;

  //   try {
  //     const obj = {
  //       sub_type: context.subscribed_details.sub_type,
  //       purchase_date: context.subscribed_details.purchased_date,
  //     };
  //     // alert('from ios and android')
  //     const response = await api.post('user/subscribe', obj, {
  //       headers: {
  //         Authorization: `Bearer ${context?.token}`,
  //       },
  //     });

  //     if (
  //       response?.data?.status === 'success' &&
  //       response?.data?.user?.expired_at
  //     ) {
  //       const updatedExpiry = response.data.user.expired_at;
  //       setContext(prev => ({
  //         ...prev,
  //         subscribed_details: null,
  //         user: {...prev.user, expired_at: updatedExpiry},
  //       }));

  //       return updatedExpiry;
  //     }
  //   } catch (err) {
  //     console.error('Error fetching subscription info:', err);
  //   }

  //   return null;
  // };

  const getSubscriptionInfo = async (sub_type, token,transactionId) => {
    try {
      // Step 1: Try to load from context, otherwise fallback to AsyncStorage
      // let subDetails = context?.subscribed_details;
      // if (!subDetails) {
      // let subDetails;
      //   const stored = await AsyncStorage.getItem("subscribed_details");
      // if (!stored) {
      //   console.log("⚠️ No subscription details found");
      //   return null;
      // }

      // subDetails = JSON.parse(stored)

      // Step 3: Send to backend to validate
      const obj = {
        sub_type: sub_type,
        transaction_id: transactionId
        // purchase_date: subDetails.purchased_date,
      };

      const response = await api.post('user/subscribe', obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        response?.data?.status === 'success' &&
        response?.data?.user?.expired_at
      ) {
        const updatedExpiry = response.data.user.expired_at;

        // Step 4: Save fresh expiry everywhere
        // await AsyncStorage.setItem(
        //   "subscribed_details",
        //   JSON.stringify({
        //     ...subDetails,
        //     expired_at: updatedExpiry,
        //   })
        // );

        // setContext(prev => ({
        //   ...prev,
        //   user: {
        //     ...prev.user,
        //     expired_at: updatedExpiry,
        //     sub_type: response?.data?.user?.sub_type,
        //   },
        // }));
        // // setContext(prev => ({
        //   ...prev,
        //   subscribed_details: { ...subDetails, expired_at: updatedExpiry },
        //   user: { ...prev.user, expired_at: updatedExpiry },
        // }));

        return updatedExpiry;
      }
    } catch (err) {
      console.error('Error fetching subscription info:', err);
    }

    return null;
  };

  async function requestLocationPermission() {
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
          getLocation();
        } else {
          console.log('location permission denied');
        }
      } else if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
        getLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function getLocation() {
    // Geolocation.setRNConfiguration({
    //   enableHighAccuracy: false,
    //   timeout: 20000,
    //   maximumAge: 10000,
    // });
    Geolocation.getCurrentPosition(
      async pos => {
        console.log('Position received: ', pos);
        const crd = pos.coords;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`,
        );
        const data = response?.data;
        const locationName = data?.results[0]?.formatted_address;

        console.log('Location Name: ', locationName);
        if (locationName) {
          setLocation({
            latitude: crd?.latitude,
            longitude: crd?.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
            locationName,
          });
        } else {
          console.log('Could not get address from lat/lng');
        }
      },
      err => {
        console.log('Geolocation error: ', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
    // Geolocation.getCurrentPosition(
    //   async pos => {
    //     const crd = pos.coords;

    //     const response = await axios.get(
    //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`,
    //     );
    //     const data = response?.data;
    //     const locationName = data?.results[0]?.formatted_address;

    //     setLocation({
    //       latitude: crd?.latitude,
    //       longitude: crd?.longitude,
    //       latitudeDelta: 0.0421,
    //       longitudeDelta: 0.0421,
    //       locationName: locationName,
    //     });
    //   },
    //   err => {
    //     console.log(err);
    //   },
    // );
  }

  const onUserLogin = async () => {
    // await AsyncStorage.clear()
    try {
      // if (!location) {
      //     note('Location is Required', 'You need to allow the app to get your location in order to use fly n eat!', [{ text: 'Request Again', onPress: async () => await requestLocationPermission() }]);
      //     return;
      // }

      // return  await  AsyncStorage.clear()
      setLoading(true);
      Keyboard.dismiss();
      const obj = {
        email,
        password,
        remember: true,
        // latitude: 0,
        // longitude: 0,
        ...location,
      };

      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/login', obj);
      console.log('api response =======>', res.data);
      if (res.data?.status === 'error') {
        note('Login', res.data?.message);
      }
      if (true) {
        await AsyncStorage.setItem('token', res?.data?.token);
        await AsyncStorage.setItem(
          'isVerified',
          res?.data?.verified || 'false',
        );
        await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user));
      }

      const localSubType = context?.sub_type;
      const transactionId = context?.transaction_id
      const apiSubType = res?.data?.user?.sub_type;
      let finalSubType = apiSubType;
      if (localSubType && apiSubType && apiSubType !== localSubType) {
       const updatedExpiry = await getSubscriptionInfo(localSubType, res?.data?.token,transactionId);
        setContext(prev => ({
          ...prev,
          token: res?.data?.token,
          isVerified: res?.data?.verified ? true : false,
          user: {...res?.data?.user, expired_at: updatedExpiry, sub_type: localSubType},
        }));
        finalSubType = localSubType;
      } else {
        setContext(prev => ({
          ...prev,
          token: res?.data?.token,
          isVerified: res?.data?.verified ? true : false,
          user: {...res?.data?.user, sub_type: finalSubType},
        }));
      }
      handlingNavigations(finalSubType, res?.data?.token,res?.data?.user,transactionId);
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };

  const nextScreen = nav => {
    // Animated.timing(slideAnimation, {
    //   toValue: hp('100%'),
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start(() => {
    //   nav();
    // });
    nav();
  };

  return (
    <>
      <Background noScroll={true} translucent={true}>
        <View style={{height: hp(100), justifyContent: 'space-between'}}>
          <View />
          <KeyboardAvoidingView behavior={'padding'}>
            <View style={drawerStyle}>
              {/* <Animated.View
            style={[{transform: [{translateY: slideAnimation}]}, drawerStyle]}> */}
              {/* <KeyboardAvoidingView behavior='padding'>                */}
              {/* Place the Background and ScrollView inside here */}
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                contentContainerStyle={[drawerInner, {}]}>
                <H5 style={{textAlign: 'center'}} heading font="bold">
                  Login Account
                </H5>
                <Br space={0.5} />
                <Small style={{textAlign: 'center'}} font="light">
                  Discover your social & Try to Login
                </Small>
                <Br space={1.5} />
                <Image
                  source={require('../assets/images/logo.png')}
                  style={{
                    width: hp('20%'),
                    height: hp('20%'),
                    alignSelf: 'center',
                  }}
                />
                <Br space={1.5} />
                <Input
                  label="Email Address"
                  onChangeText={text => setEmail(text)}
                />
                <Br space={1.5} />
                <Input
                  label="Password"
                  onChangeText={text => setPassword(text)}
                  secureTextEntry
                />
                <View
                  style={{
                    marginTop: hp('2%'),
                    marginBottom: hp('3%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: wp('2%'),
                      alignItems: 'center',
                    }}>
                    <RadioBtn
                      isChecked={rememberMe}
                      radioClr={Color('text')}
                      onPress={() => setRememberMe(!rememberMe)}
                    />
                    <Small heading font="regular">
                      Remember Me
                    </Small>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      nextScreen(() => navigation.navigate('ForgotPassword'))
                    }>
                    <Small heading font="regular">
                      Forgot Password?
                    </Small>
                  </TouchableOpacity>
                </View>
                <Btn loading={loading} label="Login" onPress={onUserLogin} />
                <Br space={3} />
                <TouchableOpacity
                  onPress={() =>
                    nextScreen(() => navigation.navigate('Signup'))
                  }>
                  <Small
                    style={{textAlign: 'center', fontSize: hp(2)}}
                    heading
                    font="regular">
                    Don’t have an account? Signup
                  </Small>
                </TouchableOpacity>
              </ScrollView>

              {/* </KeyboardAvoidingView> */}
            </View>
          </KeyboardAvoidingView>
          {/* </Animated.View> */}
        </View>
      </Background>
      {/* <LoaderOverlay visible={api} /> */}
    </>
  );
};

export default Login;
