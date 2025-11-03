/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {H5, Pera, Small} from '../utils/Text';
import Br from '../components/Br';
import Btn from '../utils/Btn';
import Background from '../utils/Background';
import {capitalize, drawerInner, drawerStyle} from '../utils/global';
import Input from '../components/Input';
import {useIsFocused} from '@react-navigation/native';
import {Color} from '../utils/Colors';
import RadioBtn from '../components/RadioBtn';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Add} from 'iconsax-react-native';
import {DataContext} from '../utils/Context';
import DOB from '../components/DOB';
import Model from '../components/Model';
import * as Yup from 'yup';
import moment from 'moment';
import {api, errHandler, note} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  // dob: Yup.string()
  //   .required('Please enter your date of birth.')
  //   .matches(
  //     /^\d{4}-\d{2}-\d{2}$/,
  //     'Date of Birth must be in the format YYYY-MM-DD',
  //   )
  //   .test('is-18-years-old', 'You must be at least 18 years old', value => {
  //     if (!value) {
  //       return false;
  //     }
  //     const today = moment();
  //     const dob = moment(value, 'YYYY-MM-DD');
  //     return today.diff(dob, 'years') >= 18;
  //   }),
  aircraft_type: Yup.string().required(
    'Please select the aircraft type from the dropdown.',
  ),
  // profile_image: Yup.object().required('Please upload your profile image.'),
});

const CreateProfile = ({navigation}) => {
 const typeData = [
  'None',
  'Aero',
  'American Champion',
  'American Legend',
  'Antonov',
  'ATR',
  'Aviat',
  'Beechcraft (the one Rick has)',
  'Bellanca',
  'Boeing',
  'Bristell',
  'Cessna',
  'Cirrus',
  'Columbia',
  'Commander',
  'Cubcrafters',
  'Czech Sport',
  'Daher TBM',
  'Dehavilland',
  'Diamond',
  'Dornier',
  'Epic',
  'Evektor',
  'Fairchild',
  'Flight Design',
  'Game Composites',
  'Gogetair',
  'Grumman/American General',
  'Helicopter',
  'Icon',
  'JMB',
  'Light Sport Aircraft',
  'Lockheed',
  'Maule',
  'Mitsubishi',
  'Mooney',
  'Piper',
  'Pilatus',
  'Piaggio',
  'Pipestrel',
  'Siai',
  'Single Engine',
  'Socata TBM',
  'TBM',
  'Tecnam',
  'Tecnam',
  'Tomark Aero',
  'Turbo Prop Aircraft',
  'Vashon',
  'Waco',
];


  const {context, setContext} = useContext(DataContext);
  const IsFocused = useIsFocused();
  // const [slideAnimation] = useState(new Animated.Value(hp('100%')));
  const [profile, setProfile] = useState(null);
  const [banner, setBanner] = useState(null);
  const [dob, setDob] = useState('');
  const [show, setShow] = useState(false);
  const [type, setType] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState(0);

  // console.log(context?.token)


  // useEffect(() => {
  //   Animated.timing(slideAnimation, {
  //     toValue: hp('1%'),
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [IsFocused]);

  useEffect(() => {
    setShow(false);
  }, [type]);

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
          screen: 'BottomStack',
        }),
      );
    }
  }, [context?.user]);

  const nextScreen = nav => {
    // Animated.timing(slideAnimation, {
    //   toValue: hp('100%'),
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start(() => {
      nav();
    // });
  };
  const uploadProfileImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    });
    // console.log('hhh',result)
    if (result?.assets) {
      // if (bannerImg) {
      //   setBanner(result.assets[0]);
      // } else {
      // }
      setProfile(result.assets[0]);
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
      // if (bannerImg) {
      //   setBanner(result.assets[0]);
      // } else {
      // }
      setProfile(result.assets[0]);
    }
  };
  const onCreateProfile = async () => {
    try {
      if (!agree) {
        note('Validation Error', 'Please accept our terms of service.');
        return false;
      }
      // if (!profile) {
      //   note('Validation Error', 'Please upload your profile image!');
      //   return false;
      // }
      // await AsyncStorage.setItem('token2',context?.token)
      setLoading(true);
      Keyboard.dismiss();
      const date_of_birth = moment(dob).format('YYYY-MM-DD');
      const obj = {
        // age: age,
        // dob: date_of_birth,
        aircraft_type: type,
        // profile_image: profile,
        // banner_image: banner,
      };

      const formData = new FormData();
      // formData.append('age', age);
      // formData.append('dob', date_of_birth);
      formData.append('aircraft_type', type);
      formData.append('profile_image', {
        uri: profile.uri,
        type: profile.type,
        name: profile.fileName,
      });
      // formData.append('banner_image', banner ? {
      //   uri: banner?.uri,
      //   type: banner?.type,
      //   name: banner?.fileName,
      // } : null);
      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/user-info', formData, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
       console.log('first',res.data)
      // const token = await AsyncStorage.getItem('token');
      const user = {
        ...context?.user,
        user_info: res?.data?.user_info,
      };
      // return console.log(user)
      // if (token) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      // }
      //  console.log('token',context)
      setContext({
        ...context,
        user: user,
      });
      // setContext(prevContext => ({
      //   ...prevContext,
      //   user: user,
      //   token: prevContext.token
      // }));
      
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Background noScroll={true} translucent={true}>
        <View style={{height: hp('100%'), justifyContent: 'space-between'}}>
          <View />
          <View style={drawerStyle}>
          {/* <Animated.View
            style={[
              {transform: [{translateY: slideAnimation}], zIndex: 100},
              drawerStyle,
            ]}> */}
            <View style={[drawerInner, {zIndex: 1}]}>
              <ScrollView style={{zIndex: 100}}>
                <H5 style={{textAlign: 'center'}} heading font="bold">
                  Create Profile
                </H5>
                <Br space={0.5} />
                <Small style={{textAlign: 'center'}} font="light">
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
                          {text: 'Cancel'},
                          {text: 'Camera', onPress: () => clickProfileImage()},
                          {text: 'Upload', onPress: () => uploadProfileImage()},
                        ],
                      );
                    }}>
                    <Add size={hp('3%')} color={Color('drawerBg')} />
                  </TouchableOpacity>
                </View>
                <Br space={1} />
                <Pera heading font="bold" style={{textAlign: 'center'}}>
                  {capitalize(context?.user?.name)}
                </Pera>
                <Small
                  color={Color('lightText')}
                  heading
                  font="regular"
                  style={{textAlign: 'center'}}>
                  {context?.user?.email}
                </Small>
                {/* <Br space={5} /> */}
                {/* <DOB dob={dob} setDob={setDob} /> */}
                {/* <Br space={2} />
                <Input
                  value={age.toString()}
                  keyboardType="numeric"
                  label="Enter Age"
                  style={{borderRadius: hp('1%')}}
                  readOnly
                /> */}
                <Br space={1.5} />
                <Pera heading font="bold">
                  Aircraft Type
                </Pera>
                <Br space={1} />
            <TouchableOpacity
                           style={{
                             borderRadius: hp('1%'),
                             padding: hp('2%'),
                             borderWidth: 1,
                             borderColor: Color('lightGray'),
                           }}
                           onPress={() => setShow(!show)}>
                           <Text style={{color: Color('lightGray')}}>{type ? type : 'Select Type'}</Text>
                           {/* <Input style={{borderRadius: hp('1%')}} label="Select Type" value={type} readOnly={false} /> */}
                         </TouchableOpacity>
                <Br space={1} />
                {/* <Pera heading font="bold">
                  Banner Image
                </Pera>
                <Br space={1} />
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Select an Option',
                      'Do you want to upload an image or click one from the camera?',
                      [
                        {text: 'Cancel'},
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
                    style={{borderRadius: hp('1%')}}
                    readOnly
                  />
                </TouchableOpacity> */}
                {/* <Br space={2} /> */}
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
              </ScrollView>
            </View>
            </View>
          {/* </Animated.View> */}
        </View>
      </Background>
      <Model show={show}>
        <TouchableOpacity onPress={() => setShow(false)}>
          <Add
            size="32"
            color={Color('shadow')}
            style={{transform: [{rotate: '135deg'}], alignSelf: 'flex-end'}}
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
    </>
  );
};

export default CreateProfile;
