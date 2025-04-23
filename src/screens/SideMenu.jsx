/* eslint-disable react/no-unstable-nested-components */

/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Background from '../utils/Background';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Br from '../components/Br';
import {Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import {
  AirplaneSquare,
  ArrowRight,
  Bookmark,
  Crown1,
  Home,
  LogoutCurve,
  Notification,
  ProfileDelete,
  Setting,
  User,
} from 'iconsax-react-native';
import BackBtn from '../components/BackBtn';

import Wrapper from '../components/Wrapper';
import {capitalize, isIOS} from '../utils/global';
import {DataContext} from '../utils/Context';
import {storageUrl} from '../utils/api';

const SideMenu = ({navigation}) => {
  const {context} = useContext(DataContext);


  const onDeleteAccount = async () => {
    navigation.navigate('Message', {
      theme: 'light',
      title: context?.token ? 'Account Deletion' : 'Login Required',
      message: context?.token
        ? 'Are you sure you want to delete your account?'
        : 'Please login to continue',
      screen: context?.token ? 'GetStarted' : 'Login',
    });
  };

  const onNavigateScreen = screenName => {
    if (context?.token) {
      navigation.navigate(screenName);
    } else {
      if (
        screenName === 'Home' ||
        screenName === 'Settings' ||
        screenName === 'Packages'
      ) {
        navigation.navigate(screenName);
      } else {
        navigation.navigate('Message', {
          theme: 'light',
          title: 'Login Required',
          message: 'Please log in to continue',
          screen: 'Login',
        });
      }
    }
  };

  const Options = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onNavigateScreen('Home')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <Home size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Home
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onNavigateScreen('Profile')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <User size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Profile
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onNavigateScreen('Bookmark')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <Bookmark size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Bookmarks
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onNavigateScreen('Notifications')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <Notification size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Notification
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onNavigateScreen('Packages')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <Crown1 size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Subscription
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onDeleteAccount()}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            <ProfileDelete size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Delete Account
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Settings')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: hp('1.5%'),
            }}>
            {/* <AirplaneSquare
                            size={hp('3%')}
                            color={Color('drawerBg')}
                        /> */}
            <Setting size={hp('3%')} color={Color('drawerBg')} />
            <Small color={Color('drawerBg')} heading font="bold">
              Settings
            </Small>
          </View>
          <ArrowRight size={hp('3%')} color={Color('lightText')} />
        </TouchableOpacity>
        {context?.token && (
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate('Message', {
                theme: 'light',
                title: 'Logout',
                message: 'Are you sure you want to logout?',
                screen: 'Logout',
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: hp('1.5%'),
              }}>
              <LogoutCurve size={hp('3%')} color={Color('sidebarLastOption')} />
              <Small color={Color('sidebarLastOption')} heading font="bold">
                Logout
              </Small>
            </View>
            <ArrowRight size={hp('3%')} color={Color('sidebarLastOption')} />
          </TouchableOpacity>
        )}
      </>
    );
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
        <View style={{height: hp('91.5%')}}>
          <Br space={isIOS ? 0.5 : 2.5} />
          <Pera
            style={{textAlign: 'center'}}
            color={Color('homeBg')}
            heading
            font="bold">
            Side Menu
          </Pera>
          {context?.token && (
            <>
              <Br space={5} />
              <Image
                source={context?.user?.user_info?.profile_image ? {
                  uri: `${storageUrl}${context?.user?.user_info?.profile_image}`,
                } : require('../assets/images/userProfile.jpeg')}
                style={{
                  width: hp('14%'),
                  height: hp('14%'),
                  borderRadius: hp('50%'),
                  alignSelf: 'center',
                }}
              />
              <Br space={1} />
              <Pera
                style={{textAlign: 'center'}}
                color={Color('homeBg')}
                heading
                font="bold">
                {capitalize(context?.user?.name)}
              </Pera>
              <Small
                style={{textAlign: 'center'}}
                color={Color('lightText')}
                heading
                font="medium">
                Pilot
              </Small>
            </>
          )}
          <Br space={context?.token ? 3 : 7} />
          <Wrapper>
            <View style={styles.options}>
              <Options />
            </View>
          </Wrapper>
        </View>
      </Background>
    </>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  options: {
    backgroundColor: Color('text'),
    borderRadius: hp('3%'),
    shadowColor: Color('lightText'),
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  option: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
