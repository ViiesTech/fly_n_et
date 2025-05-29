/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import {Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import Input from '../components/Input';
import Btn from '../utils/Btn';
import {isIOS} from '../utils/global';
import {DataContext} from '../utils/Context';
import * as Yup from 'yup';
import {api, errHandler, note, storageUrl} from '../utils/api';
import {Text} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {Edit2} from 'iconsax-react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DOB from '../components/DOB';
import moment from 'moment';

// const validationSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Please enter your full name to register.')
//     .min(2, 'Name must contains atleast two charactes')
//     .max(100, 'Name must be at most hundred characters'),
//   phone: Yup.string().required('Please enter your correct phone number.'),
//   experience: Yup.string()
//     .required('Please enter your experience.')
//     .min(2, 'Experience must contain at least two characters')
//     .max(100, 'Experience must be at most 100 characters'),
//   bio: Yup.string()
//     .required('Please enter your bio.')
//     .min(10, 'Bio must contain at least 10 characters')
//     .max(500, 'Bio must be at most 500 characters'),
// });

const AccountSettings = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const [email, setEmail] = useState(context?.user?.email || '');
  const [name, setName] = useState(context?.user?.name || '');
  const [phone, setPhone] = useState(context?.user?.phone || '');
  const [profile, setProfile] = useState(
    `${storageUrl}${context?.user?.user_info?.profile_image}` || '',
  );
  const [experience, setExperience] = useState(
    context?.user?.user_info?.experience || '',
  );
  const [bio, setBio] = useState(context?.user?.user_info?.bio || '');
  const [loading, setLoading] = useState(false);
  const translate = -heightPercentageToDP('5%');
  const [expiry, setExpiry] = useState(
    context?.user?.user_info?.licence_expiry || '',
  );

  console.log('hh', profile);

  const onSaveChanges = async () => {
    try {
      setLoading(true);

      const licenseExpiry = moment(expiry).format('YYYY-MM-DD');

      var data = new FormData();
      data.append('name', name);
      data.append('phone', phone);
      data.append('experience', experience);
      data.append('bio', bio);
      data.append('licence_expiry', licenseExpiry);
      data.append('profile_image', {
        uri: profile,
        type: 'image/jpg',
        name: 'image',
      });

      // return console.log('formdata',data)

      // const obj = {
      //   name: name,
      //   phone: phone,
      //   experience: experience,
      //   bio: bio,
      // };
      // await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/account-setting', data, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('heloo update===>', res.data.user);
      const user = {
        ...context.user,
        ...res?.data?.user,
      };
      setContext({
        ...context,
        user: user,
      });
      note('Changes Saved', res?.data?.message);
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };
  const uploadProfileImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    });
    // console.log('hhh', result);
    if (result?.assets) {
      // if (bannerImg) {
      //   setBanner(result.assets[0]);
      // } else {
      // }
      setProfile(result.assets[0].uri);
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
      setProfile(result.assets[0].uri);
    }
  };
  return (
    <>
      <BackBtn navigation={navigation} />
      <Background
        translucent={false}
        bgColor={Color('sidebarBg')}
        statusBarColor={Color('sidebarBg')}
        barStyle="dark-content"
        noBackground>
        <View>
          <Br space={isIOS ? 0.5 : 2.5} />
          <Pera
            style={{textAlign: 'center'}}
            color={Color('homeBg')}
            heading
            font="bold">
            Account Settings
          </Pera>
          <Br space={5} />
          <Wrapper>
            <Br space={5} />
            <Image
              source={
                profile != 'https://fly-n-eat.com/admin/undefined'
                  ? {
                      uri: profile,
                    }
                  : require('../assets/images/userProfile.jpeg')
              }
              style={{
                borderWidth: 1,
                borderColor: Color('shadow'),
                width: heightPercentageToDP('14%'),
                height: heightPercentageToDP('14%'),
                borderRadius: heightPercentageToDP('50%'),
                alignSelf: 'center',
                transform: [{translateY: translate}],
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: Color('btnColor'),
                position: 'absolute',
                alignSelf: 'center',
                transform: [
                  {translateY: -heightPercentageToDP('3%')},
                  {translateX: -heightPercentageToDP('-2%')},
                ],
                top: '22%',
                width: heightPercentageToDP('5%'),
                height: heightPercentageToDP('5%'),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: heightPercentageToDP('50%'),
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
              <Edit2
                size={heightPercentageToDP('2.5%')}
                color={Color('text')}
              />
            </TouchableOpacity>
            <Input
              value={email}
              onChangeText={text => setEmail(text)}
              mode="light"
              label="Email Address"
              readOnly
            />
            <Br space={1.2} />
            <Input
              value={name}
              onChangeText={text => setName(text)}
              mode="light"
              label="Full Name"
            />
            <Br space={1.2} />
            <Input
              value={phone}
              onChangeText={text => setPhone(text)}
              mode="light"
              keyboardType={'numeric'}
              label="Phone Number"
            />

            <Br space={1.2} />
            <Input
              value={experience}
              onChangeText={text => setExperience(text)}
              mode="light"
              label="Experience"
            />
            <Br space={1.2} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SelectLocation', {change: true})
              }>
              <View
                style={{
                  borderWidth: 0.5,
                  padding: heightPercentageToDP(0.7),
                  paddingHorizontal: widthPercentageToDP('5%'),
                  borderColor: Color('shadow'),
                  borderRadius: heightPercentageToDP('50%'),
                }}>
                <Text
                  style={{
                    color: Color('shadow'),
                    fontSize: heightPercentageToDP('1.2%'),
                  }}>
                  Home Airport
                </Text>
                <Text
                  style={{
                    color: Color('shadow'),
                    fontSize: heightPercentageToDP('1.5%'),
                    marginTop: heightPercentageToDP(0.7),
                  }}>
                  {context?.user?.user_info?.address &&
                    context?.user?.user_info?.address}
                </Text>
              </View>
              {/* <Input
                value={context?.user?.user_info?.address}
                readOnly
                mode="light"
                label="Home Airport"
              /> */}
            </TouchableOpacity>
            <Br space={1.2} />
            <Input
              value={bio}
              textAlign={'top'}
              multiline={true}
              onChangeText={text => setBio(text)}
              mode="light"
              label="Bio"
            />
            {(context?.user?.user_type === 'cfi' ||
              context?.user?.user_type === 'cfii') &&
                <>
                  <Br space={1.2} />
                  <DOB
                    labelSize={13}
                    labelColor={Color('modelDark')}
                    innerInput={{color: Color('shadow')}}
                    inputCss={{
                      backgroundColor: 'transparent',
                      borderColor: Color('modelDark'),
                    }}
                    dob={expiry}
                    setDob={setExpiry}
                  />
                </>
              }
          </Wrapper>

          <Br space={2} />
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}>
            <Small
              style={{textAlign: 'center'}}
              color={Color('homeBg')}
              heading
              font="medium">
              Change Password
            </Small>
          </TouchableOpacity>
        </View>
      </Background>
      <Wrapper>
        <Btn
          loading={loading}
          onPress={onSaveChanges}
          btnStyle={{backgroundColor: Color('homeBg')}}
          label="Save Changes"
        />
      </Wrapper>
      <Br space={2} />
    </>
  );
};

export default AccountSettings;
