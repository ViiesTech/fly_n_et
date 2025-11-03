/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import PointToPoint from '../screens/PointToPoint';
import CFISearch from '../screens/CFISearch';
import {responsiveFontSize, responsiveHeight} from '../utils/global';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../screens/Profile';
import Bookmark from '../screens/Bookmark';
import SideMenu from '../screens/SideMenu';
import Notifications from '../screens/Notifications';
import Packages from '../screens/Packages';
import PackageDetail from '../screens/PackageDetail';
import ContactUs from '../screens/ContactUs';
import Settings from '../screens/Settings';
import Privacy from '../screens/Privacy';
import AccountSettings from '../screens/AccountSettings';
import Terms from '../screens/Terms';
import About from '../screens/About';
import ChangePassword from '../screens/ChangePassword';
import Map from '../screens/Map';
import Map2 from '../screens/Map2';
import SelectLocation from '../screens/SelectLocation';
import RestuarantDetails from '../screens/RestuarantDetails';
import Feedback from '../screens/Feedback';
import CFIDetail from '../screens/CFIDetail';
import Message from '../screens/Message';

// const tabItems = [
//   {
//     id: 1,
//     label: 'Fly-Eat-Back',`
//     icon: require('../assets/images/1.png'),
//     navTo: 'Home',
//   },
//   {
//     id: 2,
//     label: 'Point-To-Point',
//     icon: require('../assets/images/2.png'),
//     navTo: 'PointToPoint',
//   },
//   {
//     id: 3,
//     label: 'CFI/CFII',
//     icon: require('../assets/images/3.png'),
//   },
// ];

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = ({label, navigation, ...props}) => {
  const {context, setContext} = useContext(DataContext);
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);
  // const [selectedItem, setSelectedItem] = useState(0);
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Color('text'),
        tabBarInactiveTintColor: Color('borderColor'),
        tabBarLabelStyle: {
          fontSize: responsiveFontSize(1.7),
          marginTop: responsiveHeight(0.6),
          // color: 'red',
        },
        tabBarStyle: {
          borderTopWidth: 0,
          height: responsiveHeight(11),
          backgroundColor: Color('homeBg'),
          position: 'absolute',
          // elevation: 2,
          // zIndex: 1,
          bottom: 0,
          // width: wp('100%'),
          // alignItems: 'center',
          paddingTop: responsiveHeight(2),
          // marginBottom: responsiveHeight(2),
          // marginTop: hp(2),
          borderTopLeftRadius: hp('3%'),
          borderTopRightRadius: hp('3%'),
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Fly-Eat-Back',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={require('../assets/images/1.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={require('../assets/images/home_inactive.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Point-To-Point"
        component={PointToPoint}
        options={{
          tabBarLabel: 'Point-To-Point',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={require('../assets/images/2.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={require('../assets/images/point_inactive.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="CFI/CFII"
        component={CFISearch}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault()
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
          },
        })}
        options={{
          tabBarLabel: 'CFI/CFII',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={require('../assets/images/3.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={require('../assets/images/cfi_inactive.png')}
                style={{
                  width: hp('3.5%'),
                  height: hp('3.5%'),
                }}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );

  // return (
  //   <>
  //     <View style={[styles.navigation, {width: width}]}>
  //       {tabItems.map((item, index) => {
  //         const isActive = context?.activeScreen == item.navTo
  //         return (
  //           <TouchableOpacity
  //             style={{alignItems: 'center'}}
  //             onPress={() => {
  //               // setSelectedItem(index);
  //               setContext({...context,activeScreen: item.navTo})

  //               // setTimeout(() => {
  //                 if (index == 2 && !item.navTo) {
  //                   if (context?.token) {
  //                     const expiryDate = context?.user?.expired_at
  //                       ? new Date(context.user.expired_at)
  //                       : null;
  //                     const currentDate = new Date();
  //                     const isExpired =
  //                       !expiryDate || (expiryDate && currentDate > expiryDate);

  //                     if (isExpired) {
  //                       navigation.navigate('Packages');
  //                     } else {
  //                       navigation.navigate('CFISearch');
  //                     }
  //                   } else {
  //                     navigation.navigate('Message', {
  //                       theme: 'light',
  //                       title: 'Login Required',
  //                       message:
  //                         'To access your subscription benefits, please create or log in to your account',
  //                       screen: 'Login',
  //                     });
  //                   }
  //                 } else {
  //                   navigation.navigate(item.navTo);
  //                 }
  //               // }, 100);
  //             }}>
  //             <Image
  //               resizeMode="contain"
  //               source={item.icon}
  //               style={{
  //                 width: hp('3.5%'),
  //                 height: hp('3.5%'),
  //                 tintColor:
  //                   isActive
  //                     ? Color('text')
  //                     : Color('borderColor'),
  //               }}
  //             />
  //             <Br space={0.5} />
  //             <Small
  //               color={
  //                 isActive  ? Color('text') : Color('borderColor')
  //               }
  //               size={hp(1.8)}
  //               font="Bold">
  //               {item.label}
  //             </Small>
  //           </TouchableOpacity>
  //         );
  //       })}

  //       {/* <TouchableOpacity
  //         style={{alignItems: 'center'}}
  //         onPress={() => navigation.navigate('PointToPoint')}>
  //         <Image
  //           resizeMode="contain"
  //           source={require('../assets/images/2.png')}
  //           style={{
  //             width: hp('3.5%'),
  //             height: hp('3.5%'),
  //           }}
  //         />
  //         <Br space={0.5} />
  //         <Small size={hp(1.8)} font="Bold">
  //           Point To Point
  //         </Small>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={{alignItems: 'center'}}
  //         onPress={() => {
  //              navigation.navigate('CFISearch')
  //           // if (context?.token) {
  //           //   const expiryDate = context?.user?.expired_at
  //           //     ? new Date(context.user.expired_at)
  //           //     : null;
  //           //   const currentDate = new Date();
  //           //   const isExpired =
  //           //     !expiryDate || (expiryDate && currentDate > expiryDate);
  //           //   if (isExpired) {
  //           //     navigation.navigate('Packages');
  //           //   } else {
  //           //     navigation.navigate('CFISearch')
  //           //   }
  //           // } else {
  //           //   navigation.navigate('Message', {
  //           //     theme: 'light',
  //           //     title: 'Login Required',
  //           //     message:
  //           //       'To access your subscription benefits, please create or log in to your account',
  //           //     screen: 'Login',
  //           //   });
  //           // }
  //         }}>
  //         <Image
  //           resizeMode="contain"
  //           source={require('../assets/images/3.png')}
  //           style={{
  //             width: hp('3.5%'),
  //             height: hp('3.5%'),
  //           }}
  //         />
  //         <Br space={0.5} />
  //         <Small size={hp(1.8)} font="Bold">
  //           CFI/CFII
  //         </Small>
  //       </TouchableOpacity> */}
  //       {/* <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Settings')}>
  //                   <Image
  //                       resizeMode="contain"
  //                       source={require('../assets/images/4.png')}
  //                       style={{
  //                           width: hp('3%'),
  //                           height: hp('3%'),
  //                       }}
  //                   />
  //                   <Br space={0.5} />
  //                   <Small font="Bold">Setting</Small>
  //               </TouchableOpacity> */}
  //     </View>
  //   </>
  // );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Bookmark" component={Bookmark} />
      <Stack.Screen name="Packages" component={Packages} />
      <Stack.Screen name="PackageDetail" component={PackageDetail} />
    </Stack.Navigator>
  );
};

const SecondaryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SideMenu" component={SideMenu} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Packages" component={Packages} />
      <Stack.Screen name="PackageDetail" component={PackageDetail} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Map2" component={Map2} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="RestuarantDetails" component={RestuarantDetails} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="CFIDetail" component={CFIDetail} />
      <Stack.Screen name="Message" component={Message} />
    </Stack.Navigator>
  );
};

const BottomStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Navigation" component={Navigation} />
      <Stack.Screen name="SecondaryStack" component={SecondaryStack} />
    </Stack.Navigator>
  );
};

export default BottomStack;

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
