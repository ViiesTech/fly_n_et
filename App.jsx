// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable react/react-in-jsx-scope */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Suspense, useContext, useEffect, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {Alert, AppState, LogBox} from 'react-native';
import Splash from './src/screens/Splash';
import Loading from './src/screens/Loading';
import GetStarted from './src/screens/GetStarted';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ForgotPassword from './src/screens/ForgotPassword';
import OTP from './src/screens/OTP';
import ResetPassword from './src/screens/ResetPassword';
import CreateProfile from './src/screens/CreateProfile';
import Message from './src/screens/Message';
import Home from './src/screens/Home';
import SideMenu from './src/screens/SideMenu';
import Map from './src/screens/Map';
import RestuarantDetails from './src/screens/RestuarantDetails';
import Feedback from './src/screens/Feedback';
import Bookmark from './src/screens/Bookmark';
import Notifications from './src/screens/Notifications';
import Profile from './src/screens/Profile';
import AccountSettings from './src/screens/AccountSettings';
import ChangePassword from './src/screens/ChangePassword';
import Settings from './src/screens/Settings';
import About from './src/screens/About';
import Terms from './src/screens/Terms';
import Privacy from './src/screens/Privacy';
import Verify from './src/screens/Verify';
import {AppContext, DataContext} from './src/utils/Context';
import Logout from './src/screens/Logout';
import CFISelection from './src/screens/CFISelection';
import CFIScreen from './src/screens/CFIScreen';
import CFiIScreen from './src/screens/CFiIScreen';
import CFISearch from './src/screens/CFISearch';
import CFIDetail from './src/screens/CFIDetail';
import UserType from './src/screens/UserType';
import CreateProProfile from './src/screens/CreateProProfile';
import SelectLocation from './src/screens/SelectLocation';
import PointToPoint from './src/screens/PointToPoint';
import Map2 from './src/screens/Map2';
import Packages from './src/screens/Packages';
import PackageDetail from './src/screens/PackageDetail';
import {Platform} from 'react-native';
import Purchases from 'react-native-purchases';
import {withIAPContext} from 'react-native-iap';
import {api, baseUrl} from './src/utils/api';
import {replace} from './src/utils/global';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderOverlay from './src/components/LoaderOverlay';
import ContactUs from './src/screens/ContactUs';

const Stack = createNativeStackNavigator();

// function MainApp() {
//   const {context, setContext} = useContext(DataContext);
//   const [isPremium, setIsPremium] = useState(false);
//   const [appState, setAppState] = useState(AppState.currentState);

//   const isFocused = useIsFocused();

//   // console.log('from c==>',context?.token);

//   let APIKEY =
//     Platform.OS === 'android'
//       ? 'goog_NsTIazxZbCUKCthqNMbKrmCyyxT'
//       : 'appl_SAfJQCOjWHjmBWyfUcvNkSwuOnQ';
//   useEffect(() => {
//     LogBox.ignoreLogs(['Warning']);
//     Orientation.lockToPortrait();

//     return () => {
//       Orientation.unlockAllOrientations();
//     };
//   }, []);

//   useEffect(() => {
//     if (!context?.token) return;

//     // const interval = setInterval(() => {
//     //   checkToken();
//     // }, 60000);

//     // return () => clearInterval(interval);
//     checkToken();
//   }, [context?.token]);

//   const checkToken = async () => {
//     try {
//       const res = await api.get('/user/check-token', {
//         headers: {
//           Authorization: `Bearer ${context?.token}`,
//         },
//       });
//       // console.log('response of check token:', res.data);
//       if (
//         res.data.error === 'Invalid token.' ||
//         res.data.error === 'Token is expired'
//       ) {
//         Alert.alert(
//           'Session Expired',
//           'Your account was accessed on another device. Please log in again to continue.',
//           [
//             {
//               text: 'Log In',
//               onPress: () => {
//                 setContext({
//                   ...context,
//                   token: false,
//                   isVerified: false,
//                   user: null,
//                   notifications: null,
//                   restuarents: null,
//                   savedRestuarents: null,
//                   restuarent: null,
//                   about: null,
//                   terms: null,
//                   serviceImages: null,
//                   returnFromDetail: false,
//                 });
//                 replace('Logout');
//               },
//               style: 'default',
//             },
//           ],
//           {cancelable: false},
//         );
//       }
//     } catch (error) {
//       console.log('Token check failed:', error);
//     }
//   };

//   useEffect(() => {
//     const configurePurchases = async () => {
//       await Purchases.configure({apiKey: APIKEY});
//     };

//     configurePurchases();

//     return () => {
//       try {
//         Purchases.logOut();
//       } catch (error) {
//         console.log('Error during Purchases logOut:', error);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (isFocused) {
//       let prevProductId = null;

//       const fetchAndSaveEntitlement = async customerInfo => {
//         const premium = customerInfo.entitlements.active['Premium'];
//         console.log('revnnue cat', premium.productIdentifier);
//         if (premium) {
//           const currentProductId = premium.productIdentifier;

//           if (prevProductId !== currentProductId) {
//             prevProductId = currentProductId;

//             console.log(
//               'Entitlement changed via deep link or offer code. Hitting API...',
//             );
//             await handlingNavigations();
//           }
//         }
//       };
//       Purchases.addCustomerInfoUpdateListener(fetchAndSaveEntitlement);

//       return () => {
//         Purchases.removeCustomerInfoUpdateListener(fetchAndSaveEntitlement);
//       };
//     }
//   }, [context.token, isFocused]);

//   const handlingNavigations = async () => {
//     // console.log("first", data)
//     // return

//     const iosSubType = 'monthly';
//     // return console.log('hello world',iosSubType)
//     let datatoBeAppend = new FormData();
//     datatoBeAppend.append('sub_type', iosSubType);

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: `${baseUrl}/user/subscribe`,
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         Authorization: `Bearer ${context.token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//       data: datatoBeAppend,
//     };

//     axios
//       .request(config)
//       .then(async response => {
//         const updatedExpiry = response?.data?.user?.expired_at;
//         if (updatedExpiry) {
//           if (context?.token) {
//             await AsyncStorage.setItem('token', context?.token);
//             await AsyncStorage.setItem('isVerified', JSON.stringify(true));
//             await AsyncStorage.setItem(
//               'user',
//               JSON.stringify(response?.data?.user),
//             );

//             setContext({
//               ...context,
//               token: context?.token,
//               isVerified: true,
//               user: response?.data?.user,
//             });
//             // setLoading(false);
//             // navigation.navigate('Home');
//           } else {
//             // setLoading(false);
//           }
//         }
//       })
//       .catch(error => {
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   const Sus = ({component}) => {
//     return <Suspense fallback={<Loading />}>{component}</Suspense>;
//   };
//   return (
//     <>
//       <AppContext>
//         <NavigationContainer>
//           <Stack.Navigator
//             screenOptions={{
//               headerShown: false,
//               animation: 'fade_from_bottom',
//             }}>
//             <Stack.Screen name="Splash" component={Splash} />
//             <Stack.Screen name="Logout" component={Logout} />
//             <Stack.Screen name="PointToPoint">
//               {props => <Sus component={<PointToPoint {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="SelectLocation">
//               {props => <Sus component={<SelectLocation {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="GetStarted">
//               {props => <Sus component={<GetStarted {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Login">
//               {props => <Sus component={<Login {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Signup">
//               {props => <Sus component={<Signup {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="ForgotPassword">
//               {props => <Sus component={<ForgotPassword {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CreateProProfile">
//               {props => <Sus component={<CreateProProfile {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="OTP">
//               {props => <Sus component={<OTP {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="ResetPassword">
//               {props => <Sus component={<ResetPassword {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CreateProfile">
//               {props => <Sus component={<CreateProfile {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Message">
//               {props => <Sus component={<Message {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Home">
//               {props => <Sus component={<Home {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="SideMenu">
//               {props => <Sus component={<SideMenu {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Map">
//               {props => <Sus component={<Map {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Map2">
//               {props => <Sus component={<Map2 {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="RestuarantDetails">
//               {props => <Sus component={<RestuarantDetails {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Feedback">
//               {props => <Sus component={<Feedback {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Bookmark">
//               {props => <Sus component={<Bookmark {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Notifications">
//               {props => <Sus component={<Notifications {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Profile">
//               {props => <Sus component={<Profile {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="AccountSettings">
//               {props => <Sus component={<AccountSettings {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="ChangePassword">
//               {props => <Sus component={<ChangePassword {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Settings">
//               {props => <Sus component={<Settings {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="About">
//               {props => <Sus component={<About {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Terms">
//               {props => <Sus component={<Terms {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Privacy">
//               {props => <Sus component={<Privacy {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Verify">
//               {props => <Sus component={<Verify {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CFISelection">
//               {props => <Sus component={<CFISelection {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CFIScreen">
//               {props => <Sus component={<CFIScreen {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CFiIScreen">
//               {props => <Sus component={<CFiIScreen {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CFISearch">
//               {props => <Sus component={<CFISearch {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="CFIDetail">
//               {props => <Sus component={<CFIDetail {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="UserType">
//               {props => <Sus component={<UserType {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="Packages">
//               {props => <Sus component={<Packages {...props} />} />}
//             </Stack.Screen>
//             <Stack.Screen name="PackageDetail">
//               {props => <Sus component={<PackageDetail {...props} />} />}
//             </Stack.Screen>
//           </Stack.Navigator>
//         </NavigationContainer>
//       </AppContext>
//     </>
//   );
// }

// function App() {
//   return (
//     <AppContext>
//       <MainApp />
//     </AppContext>
//   );
// }

// export default withIAPContext(App);

// import React, {useContext, useEffect, useState, Suspense} from 'react';
// import {NavigationContainer, useIsFocused} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Orientation from 'react-native-orientation-locker';
// import {
//   Alert,
//   AppState,
//   LogBox,
//   Platform,
//   View,
// } from 'react-native';
// import Purchases from 'react-native-purchases';
// import {withIAPContext} from 'react-native-iap';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {api, baseUrl} from './src/utils/api';
// import {replace} from './src/utils/global';
// import {DataContext, AppContext} from './src/utils/Context';
// import Loading from './src/screens/Loading';

// Screens (import all your screens here)
// import Splash from './src/screens/Splash';
// import Logout from './src/screens/Logout';
// ... other screen imports

// const Stack = createNativeStackNavigator();

const Sus = ({component}) => {
  return <Suspense fallback={<Loading />}>{component}</Suspense>;
};

function MainApp() {
  const {context, setContext} = useContext(DataContext);
  // const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [appState, setAppState] = useState(AppState.currentState);
  const isFocused = useIsFocused();

  console.log(context?.token)

  let APIKEY =
    Platform.OS === 'android'
      ? 'goog_NsTIazxZbCUKCthqNMbKrmCyyxT'
      : 'appl_SAfJQCOjWHjmBWyfUcvNkSwuOnQ';

  useEffect(() => {
    LogBox.ignoreLogs(['Warning']);
    Orientation.lockToPortrait();
    return () => Orientation.unlockAllOrientations();
  }, []);

  useEffect(() => {
    if (!context?.token) return;
    checkToken();
  }, [context?.token]);

  const checkToken = async () => {
    try {
      const res = await api.get('/user/check-token', {
        headers: {Authorization: `Bearer ${context?.token}`},
      });

      if (
        res.data.error === 'Invalid token.' ||
        res.data.error === 'Token is expired'
      ) {
        Alert.alert(
          'Session Expired',
          'Your account was accessed on another device. Please log in again to continue.',
          [
            {
              text: 'Log In',
              onPress: () => {
                setContext({
                  ...context,
                  token: false,
                  isVerified: false,
                  user: null,
                  notifications: null,
                  restuarents: null,
                  savedRestuarents: null,
                  restuarent: null,
                  about: null,
                  terms: null,
                  serviceImages: null,
                  returnFromDetail: false,
                });
                replace('Logout');
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.log('Token check failed:', error);
    }
  };

  useEffect(() => {
    const configurePurchases = async () => {
      await Purchases.configure({apiKey: APIKEY});
    };
    configurePurchases();

    return () => {
      try {
        Purchases.logOut();
      } catch (error) {
        console.log('Error during Purchases logOut:', error);
      }
    };
  }, []);

  useEffect(() => {
  if(Platform.OS === 'ios') {  
    if (isFocused) {
      let prevProductId = null;

      const fetchAndSaveEntitlement = async customerInfo => {
        const premium = customerInfo.entitlements.active['Premium'];
        console.log('first', premium);
        if (premium) {
          const currentProductId = premium.productIdentifier;
          if (prevProductId !== currentProductId) {
            prevProductId = currentProductId;
            const token = await AsyncStorage.getItem('token');
            await handlingNavigations(token);
          }
        }
      };

      Purchases.addCustomerInfoUpdateListener(fetchAndSaveEntitlement);

      return () => {
        Purchases.removeCustomerInfoUpdateListener(fetchAndSaveEntitlement);
      };
    }
    }
  }, [context.token, isFocused]);

  const handlingNavigations = async token => {
    const iosSubType = 'monthly';
    const formData = new FormData();
    formData.append('sub_type', iosSubType);

    try {
      if (!token) {
        // alert('no token');
        // console.log('hello token')
        setLoading(true);
        await AsyncStorage.setItem('isPremium', 'true');
        setLoading(false);
      } else {
        // alert('token');
        setLoading(true);
        await AsyncStorage.removeItem('isPremium');

        const response = await axios.post(
          `${baseUrl}/user/subscribe`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log(response?.data?.user);
        const updatedUser = response?.data?.user;
        if (updatedUser) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('isVerified', JSON.stringify(true));
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

          setContext({
            ...context,
            token: token,
            isVerified: true,
            user: updatedUser,
          });
        }
        setLoading(false); // Stop loader after API + async calls
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Stop loader on error as well
    }
  };

  return (
    <>
      <LoaderOverlay visible={loading} />
      <Stack.Navigator
        screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
        {/* <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Logout" component={Logout} /> */}
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="PointToPoint">
          {props => <Sus component={<PointToPoint {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="SelectLocation">
          {props => <Sus component={<SelectLocation {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="GetStarted">
          {props => <Sus component={<GetStarted {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => <Sus component={<Login {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {props => <Sus component={<Signup {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {props => <Sus component={<ForgotPassword {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CreateProProfile">
          {props => <Sus component={<CreateProProfile {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="OTP">
          {props => <Sus component={<OTP {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {props => <Sus component={<ResetPassword {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CreateProfile">
          {props => <Sus component={<CreateProfile {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Message">
          {props => <Sus component={<Message {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {props => <Sus component={<Home {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="SideMenu">
          {props => <Sus component={<SideMenu {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Map">
          {props => <Sus component={<Map {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Map2">
          {props => <Sus component={<Map2 {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="RestuarantDetails">
          {props => <Sus component={<RestuarantDetails {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Feedback">
          {props => <Sus component={<Feedback {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Bookmark">
          {props => <Sus component={<Bookmark {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Notifications">
          {props => <Sus component={<Notifications {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => <Sus component={<Profile {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="AccountSettings">
          {props => <Sus component={<AccountSettings {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="ChangePassword">
          {props => <Sus component={<ChangePassword {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {props => <Sus component={<Settings {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="About">
          {props => <Sus component={<About {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Terms">
          {props => <Sus component={<Terms {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Privacy">
          {props => <Sus component={<Privacy {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Verify">
          {props => <Sus component={<Verify {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CFISelection">
          {props => <Sus component={<CFISelection {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CFIScreen">
          {props => <Sus component={<CFIScreen {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CFiIScreen">
          {props => <Sus component={<CFiIScreen {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CFISearch">
          {props => <Sus component={<CFISearch {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="CFIDetail">
          {props => <Sus component={<CFIDetail {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="UserType">
          {props => <Sus component={<UserType {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="Packages">
          {props => <Sus component={<Packages {...props} />} />}
        </Stack.Screen>
        <Stack.Screen name="PackageDetail">
          {props => <Sus component={<PackageDetail {...props} />} />}
        </Stack.Screen>
              <Stack.Screen name="ContactUs">
          {props => <Sus component={<ContactUs {...props} />} />}
        </Stack.Screen>
        {/* Add the rest of your screens similarly using <Sus component={<Component />} /> */}
      </Stack.Navigator>
    </>
  );
}

function App() {
  return (
    <AppContext>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AppContext>
  );
}

export default withIAPContext(App);
