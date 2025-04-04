/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
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
import {api, errHandler, note} from '../utils/api';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter your full name to register.')
    .min(2, 'Name must contains atleast two charactes')
    .max(100, 'Name must be at most hundred characters'),
  phone: Yup.string().required('Please enter your correct phone number.'),
  experience: Yup.string()
    .required('Please enter your experience.')
    .min(2, 'Experience must contain at least two characters')
    .max(100, 'Experience must be at most 100 characters'),
  bio: Yup.string()
    .required('Please enter your bio.')
    .min(10, 'Bio must contain at least 10 characters')
    .max(500, 'Bio must be at most 500 characters'),
});

const AccountSettings = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);
  const [email, setEmail] = useState(context?.user?.email || '');
  const [name, setName] = useState(context?.user?.name || '');
  const [phone, setPhone] = useState(context?.user?.phone || '');
  const [experience, setExperience] = useState(context?.user?.user_info?.experience || '');
  const [bio, setBio] = useState(context?.user?.user_info?.bio || '');
  const [loading, setLoading] = useState(false);

  console.log('hh',context?.user);

  const onSaveChanges = async () => {
    try {
      setLoading(true);
      const obj = {
        name: name,
        phone: phone,
        experience: experience,
        bio: bio,
      };
      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/user/account-setting', obj, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
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
              <Input
                value={context?.user?.user_info?.address}
                readOnly
                mode="light"
                label="Home Airport"
              />
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
