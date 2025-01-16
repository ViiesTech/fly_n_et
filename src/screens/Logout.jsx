/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect} from 'react';
import {DataContext} from '../utils/Context';
import Toast from 'react-native-simple-toast';
import {api} from '../utils/api';

const Logout = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);

  useEffect(() => {
    LogoutOut();
    handleLogout();
  }, []);

  const LogoutOut = async () => {
    await api.get('/user/logout', {
      headers: {Authorization: `Bearer ${context?.token}`},
    });
  };

  const handleLogout = async () => {
    try {
      if (!context?.token) {
        // If no token is present, redirect to Login immediately
        navigation.navigate('Login');
        return;
      }

      // Clear AsyncStorage and context
      await AsyncStorage.multiRemove(['token', 'isVerified', 'user', 'locationDetails', 'distance', 'selectLocation']);
      setContext({
        ...context,
        token: null, // Ensure token is explicitly set to null
        isVerified: false,
        user: null,
        restaurant: null, // Clear restaurant data
      });

      Toast.show('Logged out successfully', Toast.SHORT);

      // Redirect to Login
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return null; // No UI rendering is required for this component
};

export default Logout;
