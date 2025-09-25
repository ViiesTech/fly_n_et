import axios from 'axios';
import { Alert } from 'react-native';
import { replace } from './global';

// export const baseUrl = 'https://praetorstestnet.com/flyneat/api';
export const baseUrl = 'https://fly-n-eat.com/admin/api';
// export const storageUrl = 'https://praetorstestnet.com/flyneat/';
export const storageUrl = 'https://fly-n-eat.com/admin/'
export const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';
export const META_APP_ID = '1111969450559335'
export const api = axios.create({
    baseURL: baseUrl,
});

export const note = (title, message, buttons) => {
    return Alert.alert(title, message, buttons);
};

export const errHandler = async (err, callBack, navigation) => {
    if (err.errors) {
        console.log(err.errors);
        note('Validation Error', err.errors[0]);
    }else {
        const error = err?.response?.data;
        console.log(error);
        if (error?.errors) {
            const errors = [];
            for (let x = 0; x < Object.keys(error.errors)?.length; x++) {
                const key = Object.keys(error.errors)[x];
                if (typeof (error.errors[key]) === 'string') {
                    errors.push(error.errors[key]);
                }else {
                    errors.push(error.errors[key][0]);
                }
            }
            note('Request Failed', errors[0]);
        }else if (error?.error) {
            if (error?.error === 'Token expired.') {
                 Alert.alert(
                          'Session Expired',
                          'Please log in again to continue.',
                          [
                            {
                              text: 'Log In',
                              onPress: () => {
                                // setContext({
                                //   ...context,
                                //   token: false,
                                //   isVerified: false,
                                //   user: null,
                                //   notifications: null,
                                //   restuarents: null,
                                //   savedRestuarents: null,
                                //   restuarent: null,
                                //   about: null,
                                //   terms: null,
                                //   serviceImages: null,
                                //   returnFromDetail: false,
                                // });
                                replace('Logout');
                              },
                            },
                          ],
                          {cancelable: false},
                        );
            // note(
            //     'Session Expired',
            //     'You have been logged out because your account was logged in on another device.'
            // );
            }
            note('Request Failed', error?.error);
        }else if (error?.status === 'error') {
            note('Request Failed', error?.message);
        }
    }
    if (callBack) {
        callBack();
    }
};

export const getCityAndState = (address = '') => {
  try {
    const parts = address.split(',');
    const city = parts[2]?.trim() || '';
    const state = parts[3]?.trim().split(' ')[0] || '';
    return `${city}, ${state}`;
  } catch {
    return '';
  }
};

