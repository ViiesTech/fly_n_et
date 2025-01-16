/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { H5, Pera, Small } from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import { capitalize, drawerInner, drawerStyle } from '../utils/global';
import Input from '../components/Input';
import { useIsFocused } from '@react-navigation/native';
import { Color } from '../utils/Colors';
import RadioBtn from '../components/RadioBtn';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Add } from 'iconsax-react-native';
import { DataContext } from '../utils/Context';
import DOB from '../components/DOB';
import Model from '../components/Model';
import * as Yup from 'yup';
import moment from 'moment';
import { api, errHandler, note } from '../utils/api';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = 'AIzaSyD0w7OQfYjg6mc7LVGwqPkvNDQ6Ao7GTwk';

const validationSchema = Yup.object().shape({
  age: Yup.number()
    .required('Please enter your exact age in years.')
    .min(18, 'You must be at least 18 years old'),
  dob: Yup.string()
    .required('Please enter your date of birth.')
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date of Birth must be in the format YYYY-MM-DD',
    )
    .test('is-18-years-old', 'You must be at least 18 years old', value => {
      if (!value) {
        return false;
      }
      const today = moment();
      const dob = moment(value, 'YYYY-MM-DD');
      return today.diff(dob, 'years') >= 18;
    }),
  aircraft_type: Yup.string().required(
    'Please select the aircraft type from the dropdown.',
  ),
  profile_image: Yup.object().required('Please upload your profile image.'),
  banner_image: Yup.object().required(
    'Banner Image is required by the application.',
  ),
  phone: Yup.string().required(
    'Please enter your valid phone number.',
  ),
  address: Yup.string().required(
    'Please enter your full address.',
  ),
  bio: Yup.string().required(
    'Please enter about your self.',
  ),
  user_type: Yup.string().required(
    'Please select atleast one user type!',
  ),
  operation_time: Yup.string().required(
    'Please enter your operational time.',
  ),
});

const CreateProProfile = ({ navigation }) => {
  const typeData = [
    'Single Engine',
    'Beechcraft (the one Rick has)',
    'Cessna',
    'Piper',
    'Mooney',
    'Cirrus',
    'Diamond',
    'Bristell',
    'JMB',
    'American Champion',
    'Aviat',
    'Bellanca',
    'Boeing',
    'Dehavilland',
    'Game Composites',
    'Tecnam',
    'Waco',
    'Columbia',
    'Cubcrafters',
    'TBM',
    'Grumman/American General',
    'Maule',
    'Siai',
    'Turbo Prop Aircraft',
    'Daher TBM',
    'Mitsubishi',
    'Pilatus',
    'Socata TBM',
    'Piaggio',
    'Lockheed',
    'Antonov',
    'Commander',
    'Dornier',
    'Epic',
    'Fairchild',
    'ATR',
    'Light Sport Aircraft',
    'Icon',
    'Pipestrel',
    'Aero',
    'Czech Sport',
    'Tecnam',
    'Tomark Aero',
    'Vashon',
    'American Legend',
    'Gogetair',
    'Evektor',
    'Flight Design',
  ];

  const { context, setContext } = useContext(DataContext);
  const IsFocused = useIsFocused();
  const [slideAnimation] = useState(new Animated.Value(hp('100%')));
  const [profile, setProfile] = useState(null);
  const [banner, setBanner] = useState(null);
  const [dob, setDob] = useState('');
  const [show, setShow] = useState(false);
  const [type, setType] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState(0);
  const [location, setLocation] = useState();
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [region, setRegion] = useState(location?.locationName || '');
  const [bio, setBio] = useState('');
  const [userType, setUserType] = useState('');
  const [show1, setShow1] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: hp('1%'),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [IsFocused]);

  useEffect(() => {
    setShow(false);
  }, [type]);

  useEffect(() => {
    setShow1(false);
  }, [userType]);

  useEffect(() => {
    if (dob?.length > 0) {
      const date_of_birth = moment(dob).format('YYYY-MM-DD');
      const years = moment().diff(date_of_birth, 'years', false);
      setAge(years);
    }
  }, [dob]);

  useEffect(() => {
    if (context?.user && context?.user?.user_info) {
      nextScreen(() =>
        navigation.replace('Message', {
          title: 'All Done',
          message: 'Your profile has been created successfully.',
          screen: 'SelectLocation',
        }),
      );
    }
  }, [context?.user]);

  const nextScreen = nav => {
    Animated.timing(slideAnimation, {
      toValue: hp('100%'),
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      nav();
    });
  };
  const uploadProfileImage = async bannerImg => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    });
    if (result?.assets) {
      if (bannerImg) {
        setBanner(result.assets[0]);
      } else {
        setProfile(result.assets[0]);
      }
    }
  };
  const clickProfileImage = async bannerImg => {
    const result = await launchCamera({
      cameraType: 'back',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    });
    if (result?.assets) {
      if (bannerImg) {
        setBanner(result.assets[0]);
      } else {
        setProfile(result.assets[0]);
      }
    }
  };
  const onCreateProfile = async () => {
    try {
      if (!agree) {
        note('Validation Error', 'Please accept our terms of service.');
        return false;
      }
      if (!profile) {
        note('Validation Error', 'Please upload your profile image!');
        return false;
      }
      setLoading(true);
      const date_of_birth = moment(dob).format('YYYY-MM-DD');
      const obj = {
        age: age,
        dob: date_of_birth,
        aircraft_type: type,
        profile_image: profile,
        banner_image: banner,
        phone: phone,
        address: region,
        bio: bio,
        user_type: userType,
        operation_time: time,
      };
      const formData = new FormData();
      formData.append('age', age);
      formData.append('dob', date_of_birth);
      formData.append('aircraft_type', type);
      formData.append('phone', phone);
      formData.append('address', region);
      formData.append('bio', bio);
      formData.append('user_type', userType);
      formData.append('operation_time', time);
      formData.append('profile_image', {
        uri: profile.uri,
        type: profile.type,
        name: profile.fileName,
      });
      formData.append('banner_image', {
        uri: banner.uri,
        type: banner.type,
        name: banner.fileName,
      });

      await validationSchema.validate(obj, { abortEarly: false });
      const res = await api.post('/user/user-info', formData, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const token = await AsyncStorage.getItem('token');
      const user = {
        ...context?.user,
        user_info: res?.data?.user_info,
      };
      if (token) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      setContext({
        ...context,
        user: user,
      });
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };

  async function requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Fly n Eat',
            message: 'Fly n Eat App access to your location',
          }
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

  async function getLocation() {
    Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 });
    Geolocation.getCurrentPosition(async (pos) => {
      const crd = pos.coords;

      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEY}`);
      const data = response?.data;
      const locationName = data?.results[0]?.formatted_address;

      setLocation({
        latitude: crd?.latitude,
        longitude: crd?.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
        locationName: locationName,
      });
    }, (err) => {
      console.log(err);
    });
  }
  return (
    <>
      <Background translucent={false} statusBarColor={Color('drawerBg')}>
        <View style={{ height: hp('97%'), justifyContent: 'space-between' }}>
          <Animated.View
            style={[
              { transform: [{ translateY: slideAnimation }], zIndex: 100 },
              drawerStyle,
            ]}>
            <ScrollView style={[drawerInner, { zIndex: 1, height: null }]}>
              <H5 style={{ textAlign: 'center' }} heading font="bold">
                Signup Pro User
              </H5>
              <Br space={0.5} />
              <Small style={{ textAlign: 'center' }} font="light">
                Enter your details!
              </Small>
              <Br space={3} />
              <View
                style={{
                  position: 'relative',
                  width: hp('10%'),
                  alignSelf: 'center',
                }}>
                <Image
                  source={{
                    uri: profile?.uri
                      ? profile?.uri
                      : 'https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg',
                  }}
                  style={{
                    width: hp('10%'),
                    height: hp('10%'),
                    borderRadius: hp('50%'),
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    borderRadius: hp('50%'),
                    bottom: 0,
                    right: 0,
                    backgroundColor: Color('text'),
                    padding: hp('0.5%'),
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Select an Option',
                      'Do you want to upload an image or click one from the camera?',
                      [
                        { text: 'Cancel' },
                        { text: 'Camera', onPress: () => clickProfileImage() },
                        { text: 'Upload', onPress: () => uploadProfileImage() },
                      ],
                    );
                  }}>
                  <Add size={hp('3%')} color={Color('drawerBg')} />
                </TouchableOpacity>
              </View>
              <Br space={1} />
              <Pera heading font="bold" style={{ textAlign: 'center' }}>
                {capitalize(context?.user?.name)}
              </Pera>
              <Small
                color={Color('lightText')}
                heading
                font="regular"
                style={{ textAlign: 'center' }}>
                {context?.user?.email}
              </Small>
              <Br space={5} />
              <DOB dob={dob} setDob={setDob} />
              <Br space={2} />
              <Input
                value={age.toString()}
                keyboardType="numeric"
                label="Enter Age"
                style={{ borderRadius: hp('1%') }}
                readOnly
              />
              <Br space={2} />
              <Input
                defaultValue={location?.locationName}
                label="Your Address"
                style={{ borderRadius: hp('1%') }}
                onChangeText={(text) => setRegion(text)}
              />
              <Br space={2} />
              <Input
                label="Your Phone Number"
                style={{ borderRadius: hp('1%') }}
                onChangeText={(text) => setPhone(text)}
              />
              <Br space={2} />
              <Input
                label="Operational Time"
                style={{ borderRadius: hp('1%') }}
                onChangeText={(text) => setTime(text)}
              />
              <Br space={1.5} />
              <Pera heading font="bold">
                Aircraft Type
              </Pera>
              <Br space={1} />
              <TouchableOpacity onPress={() => setShow(!show)}>
                <Input style={{ borderRadius: hp('1%') }} label="Select Type" value={type} readOnly />
              </TouchableOpacity>
              <Br space={1} />
              <Pera heading font="bold">
                User Type
              </Pera>
              <Br space={1} />
              <TouchableOpacity onPress={() => setShow1(!show1)}>
                <Input style={{ borderRadius: hp('1%') }} label="Select Type" value={userType} readOnly />
              </TouchableOpacity>
              <Br space={1} />
              <Pera heading font="bold">
                Banner Image
              </Pera>
              <Br space={1} />
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Select an Option',
                    'Do you want to upload an image or click one from the camera?',
                    [
                      { text: 'Cancel' },
                      {
                        text: 'Camera',
                        onPress: () => clickProfileImage(true),
                      },
                      {
                        text: 'Upload',
                        onPress: () => uploadProfileImage(true),
                      },
                    ],
                  );
                }}>
                <Input
                  label="Upload Here"
                  value={banner ? 'Image Uploaded Successfully' : ''}
                  style={{ borderRadius: hp('1%') }}
                  readOnly
                />
              </TouchableOpacity>
              <Br space={2} />
              <Input
                label="Enter Bio"
                style={{ borderRadius: hp('1%'), height: hp('15%') }}
                numberOfLines={10}
                onChangeText={(text) => setBio(text)}
                inputStyle={{ height: hp('10%'), textVerticalAlign: 'top', verticalAlign: 'top', borderRadius: 0, paddingTop: hp('1%') }}
                multiline
              />
              <Br space={2} />
              <View
                style={{
                  marginTop: hp('1%'),
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
                    radioClr={Color('text')}
                    isChecked={agree}
                    onPress={() => setAgree(!agree)}
                  />
                  <Small heading font="regular">
                    I agree to the Terms of Service
                  </Small>
                </View>
              </View>
              <Btn
                onPress={onCreateProfile}
                label="Create Now"
                loading={loading}
              />
              <Br space={7} />
            </ScrollView>
          </Animated.View>
        </View>
      </Background>
      <Model show={show}>
        <TouchableOpacity onPress={() => setShow(false)}>
          <Add
            size="32"
            color={Color('shadow')}
            style={{ transform: [{ rotate: '135deg' }], alignSelf: 'flex-end' }}
          />
        </TouchableOpacity>
        {typeData.map((t, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: heightPercentageToDP('0.5%'),
                borderBottomColor: Color('borderColor'),
                borderBottomWidth: 1,
              }}
              onPress={() => setType(t)}>
              <Pera color={Color('shadow')}>{t}</Pera>
            </TouchableOpacity>
          );
        })}
      </Model>
      <Model show={show1}>
        <TouchableOpacity onPress={() => setShow1(false)}>
          <Add
            size="32"
            color={Color('shadow')}
            style={{ transform: [{ rotate: '135deg' }], alignSelf: 'flex-end' }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: heightPercentageToDP('0.5%'),
            borderBottomColor: Color('borderColor'),
            borderBottomWidth: 1,
          }}
          onPress={() => setUserType('cfi')}>
          <Pera color={Color('shadow')}>CFI</Pera>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: heightPercentageToDP('0.5%'),
            borderBottomColor: Color('borderColor'),
            borderBottomWidth: 1,
          }}
          onPress={() => setUserType('cfii')}>
          <Pera color={Color('shadow')}>CFII</Pera>
        </TouchableOpacity>
      </Model>
    </>
  );
};

export default CreateProProfile;
