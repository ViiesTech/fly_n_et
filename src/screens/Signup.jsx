import React, {useContext, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {H5, Small} from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import {drawerInner, drawerStyle, requestPermission} from '../utils/global';
import Input from '../components/Input';
import * as Yup from 'yup';
import {useIsFocused} from '@react-navigation/native';
import {DataContext} from '../utils/Context';
import {api, errHandler, note} from '../utils/api';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Color} from '../utils/Colors';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import messaging from "@react-native-firebase/messaging";

const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter your full name to register.')
    .min(2, 'Name must contains atleast 2 charactes')
    .max(100, 'Name must be at most 100 characters'),
  email: Yup.string()
    .required('Please enter your valid email address to register.')
    .email('Please enter a valid email address.')
    .max(100, 'Email must be at most 100 characters'),
  password: Yup.string()
    .required('Please enter password.')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character.',
    ),
  confirmPassword: Yup.string()
    .required('Confirm password is required.')
    .oneOf(
      [Yup.ref('password'), null],
      'Confirm password must match with the entered password.',
    ),
});

const Signup = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const IsFocused = useIsFocused();
  // const [slideAnimation] = useState(new Animated.Value(hp('100%')));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState();
  const [modal, setModal] = useState({
    visible: false,
    data: {},
  });
  const [selectedSources, setSelectedSources] = useState([]);
  const [token,setToken] = useState(null) 

  console.log('h', selectedSources);

  const sources = ['Facebook', 'Instagram', 'Google', 'Twitter', 'Other'];

  const toggleCheckbox = item => {
    setSelectedSources(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // useEffect(() => {
  //   Animated.timing(slideAnimation, {
  //     toValue: hp('1%'),
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [IsFocused]);

  useEffect(() => {
    if (context?.token && !context?.isVerified) {
      nextScreen(() => navigation.replace('Verify'));
    }
  }, [context?.token]);

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
        Geolocation.requestAuthorization();
        getLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  }

    const askNotificationPermission = async () => {
      const status = await requestPermission('notifications');
      console.log('permission status of android =====>', status);
      if (
        status === 'granted' ||
        status === messaging.AuthorizationStatus.AUTHORIZED
      ) {
        // await messaging().registerDeviceForRemoteMessages()
        const token = await messaging().getToken();
        setToken(token)
        // console.log('tokenn', token);
        // setDeviceToken(token);
      } else {
        return alert('Permission denied');
      }
    };

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

  const nextScreen = nav => {
    // Animated.timing(slideAnimation, {
    //   toValue: hp('100%'),
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start(() => {
    nav();
    // });
  };

  const onUserSignup = async () => {
    try {
      // if (!location) {
      //   note(
      //     'Location is Required',
      //     'You need to allow the app to get your location in order to use fly n eat!',
      //     [
      //       {
      //         text: 'Request Again',
      //         onPress: async () => await requestLocationPermission(),
      //       },
      //     ],
      //   );
      //   return;
      // }
      Keyboard.dismiss();
      setLoading(true);
      const obj = {
        name,
        email,
        password,
        confirmPassword,
        ...(token && {device_token: token}),
        ...location,
      };
      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/register', obj);
      setModal({
        visible: true,
        data: res?.data,
      });
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };

  const onContinuePress = async () => {
    if (selectedSources?.length < 1) {
      note(
        'Oops! You Missed Something',
        'Please select at least one option before continuing.',
      );
    } else {
      //  alert(modal?.data?.token)
      note('Account Created', modal.data?.message);
      setContext({
        ...context,
        token: modal.data?.token,
        user: modal.data?.user,
      });
      setModal({
        visible: false,
      });
    }
  };

  return (
    <>
      <Background noScroll={true} translucent={true}>
        <View style={{height: hp('100%'), justifyContent: 'space-between'}}>
          <View />
            <KeyboardAvoidingView
              behavior={'padding'}>
          <View style={drawerStyle}>
            {/* <Animated.View
            style={[{transform: [{translateY: slideAnimation}]}, drawerStyle]}> */}
            {/* <KeyboardAvoidingView keyboardVerticalOffset={10} behavior='padding'   >    */}
              <ScrollView
                contentContainerStyle={drawerInner}
                keyboardShouldPersistTaps={'handled'}>
                <H5 style={{textAlign: 'center'}} heading font="bold">
                  Create App account!
                </H5>
                <Br space={0.5} />
                <Small style={{textAlign: 'center'}} font="light">
                  Create your amazing app account with us!
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
                <Input label="Full Name" onChangeText={text => setName(text)} />
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
                <Br space={1.5} />
                <Input
                  label="Re-Enter Password"
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry
                />
                <Br space={2.5} />
                <Btn loading={loading} label="Signup" onPress={onUserSignup} />
                <Br space={3} />
                <TouchableOpacity
                  onPress={() =>
                    nextScreen(() => navigation.navigate('Login'))
                  }>
                  <Small
                    style={{textAlign: 'center', fontSize: hp(2)}}
                    heading
                    font="regular">
                    Already have an account ? Login
                  </Small>
                </TouchableOpacity>
              </ScrollView>
            <Modal
              transparent={true}
              visible={modal.visible}
              animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    width: 340,
                    padding: 25,
                    backgroundColor: Color('drawerBg'),
                    borderRadius: 15,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 3},
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  }}>
                  {/* Modal Title */}
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: Color('text'),
                      textAlign: 'center',
                      marginBottom: 10,
                    }}>
                    Help Us Improve!
                  </Text>

                  {/* Short Description */}
                  <Text
                    style={{
                      fontSize: 16,
                      color: Color('text'),
                      textAlign: 'center',
                      marginBottom: 15,
                    }}>
                    We'd love to know how you found us. This helps us improve
                    our marketing efforts!
                  </Text>

                  {/* Checkboxes */}
                  <ScrollView style={{maxHeight: 250, paddingTop: hp(1)}}>
                    {sources.map((source, index) => (
                      <BouncyCheckbox
                      key={index}
                      text={source}
                      textStyle={{fontSize: 16, color: Color('text')}}
                      fillColor={Color('drawerBg')}
                      unfillColor="#FFFFFF"
                      innerIconStyle={{borderColor: Color('text')}}
                      style={{marginBottom: 15}}
                      isChecked={selectedSources.includes(source)}
                      onPress={() => toggleCheckbox(source)}
                      />
                    ))}
                  </ScrollView>
                  <Btn
                    btnStyle={{marginTop: hp(2.5)}}
                    label="Continue"
                    onPress={() => onContinuePress()}
                    />
                </View>
              </View>
            </Modal>
            {/* </KeyboardAvoidingView> */}
          </View>
          {/* </Animated.View> */}
                    </KeyboardAvoidingView>
        </View>
      </Background>
    </>
  );
};

export default Signup;
