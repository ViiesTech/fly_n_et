/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Suspense, useEffect, useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
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
import { AppContext } from './src/utils/Context';
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
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

const Stack = createNativeStackNavigator();

function App() {
  

  useEffect(() => {
    LogBox.ignoreLogs(['Warning']);
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);


  useEffect(() => {
    const configurePurchases = async () => {
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: 'appl_SAfJQCOjWHjmBWyfUcvNkSwuOnQ' });
      }
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
   

  const Sus = ({ component }) => {
    return <Suspense fallback={<Loading />}>{component}</Suspense>;
  };
  return (
    <>
      <AppContext>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}>
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
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext>
    </>
  );
}

export default function MobileApp() {
  return <App />;
}
