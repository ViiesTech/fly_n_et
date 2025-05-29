/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import {H2, Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  Home,
  InfoCircle,
  LocationTick,
  Lock,
  Logout,
  Sms,
  TableDocument,
} from 'iconsax-react-native';
import {DataContext} from '../utils/Context';
import Input from '../components/Input';
import Btn from '../utils/Btn';
import {api, note} from '../utils/api';
import { responsiveHeight } from '../utils/global';

const contactOptions = [
  {
    id: 1,
    text: 'flygirl@fly-n-eat.com',
    icon: () => <Sms size={hp('3%')} color={Color('drawerBg')} />,
  },
  {
    id: 2,
    text: 'Rick@fly-n-eat.com',
    icon: () => <Sms size={hp('3%')} color={Color('drawerBg')} />,
  },
  {
    id: 3,
    text: '25200 Chagrin Blvd, Suite #230 Cleveland, OH 44122',
    icon: () => <LocationTick size={hp('3%')} color={Color('drawerBg')} />,
  },
];

const ContactUs = ({navigation}) => {
  const {context} = useContext(DataContext);

  const [state, setState] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const onChangeText = (value, text) => {
    setState(prevState => ({
      ...prevState,
      [value]: text,
    }));
  };

  const onContact = async () => {
    if (!state.first_name) {
      note('Contact Us', 'Please enter your first name');
    } else if (!state.last_name) {
      note('Contact Us', 'Please enter your last name');
    } else if (!state.email) {
      note('Contact Us', 'Please enter your email');
    } else if (!state.phone) {
      note('Contact Us', 'Please enter your phone number');
    } else if (!state.message) {
      note('Contact Us', 'Please enter any message');
    } else {
      setLoading(true);
      const data = new FormData();
      data.append('firstName', state.first_name);
      data.append('lastName', state.last_name);
      data.append('email', state.email);
      data.append('phone', state.phone);
      data.append('message', state.message);

      await api
        .post('/contact', data, {
          headers: {
            Authorization: `Bearer ${context?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          note('Contact Us', res.data?.message);
        })
        .catch(error => {
          console.log('error sending message =====>', error);
          note('Contact Us', 'Some problem occured');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <BackBtn navigation={navigation} />
      <Br space={2} />
      <Background
        translucent={false}
        bgColor={Color('sidebarBg')}
        statusBarColor={Color('sidebarBg')}
        barStyle="dark-content"
        noBackground>
        <View>
          <Br space={8} />
          <Wrapper>
            <Pera color={Color('homeBg')} heading font="bold">
              Contact Us
            </Pera>
            <Br space={4} />
            <Input
              value={state.first_name}
              onChangeText={text => onChangeText('first_name', text)}
              mode="light"
              label="First Name"
            />
            <Br space={2} />
            <Input
              value={state.last_name}
              onChangeText={text => onChangeText('last_name', text)}
              mode="light"
              label="Last Name"
            />
            <Br space={2} />
            <Input
              value={state.email}
              onChangeText={text => onChangeText('email', text)}
              mode="light"
              label="Email"
            />
            <Br space={2} />
            <Input
              value={state.phone}
              onChangeText={text => onChangeText('phone', text)}
              mode="light"
              label="Phone"
            />
            <Br space={2} />
            <Input
              textAlign={'top'}
              multiline={true}
              value={state.message}
              onChangeText={text => onChangeText('message', text)}
              mode="light"
              label="Message"
            />
            {/* <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Notifications')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <Notification
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Notification</Small>
                            </View>
                        </TouchableOpacity> */}
            <Br space={3} />
            <Btn
              loading={loading}
              onPress={onContact}
              btnStyle={{backgroundColor: Color('homeBg')}}
              label="Submit"
            />
            <Br space={3} />
            <Pera color={Color('homeBg')} heading font="bold">
              Contact Us
            </Pera>
            <View style={{gap: hp('0.5%')}}>
              {contactOptions.map(item => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp(2.2),
                    gap: wp('2%'),
                  }}>
                  {item.icon()}
                  <Small size={responsiveHeight(2.1)} color={Color('drawerBg')} style={{flex: 1}} >
                    {item.text}
                  </Small>
                </View>
              ))}
            </View>
          </Wrapper>
        </View>
      </Background>
    </>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  option: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Color('homeBg'),
    borderRadius: hp('10%'),
  },
});
