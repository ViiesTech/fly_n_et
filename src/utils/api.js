import axios from 'axios';
import { Alert } from 'react-native';

// export const baseUrl = 'https://praetorstestnet.com/flyneat/api';
export const baseUrl = 'https://fly-n-eat.com/admin/api';
// export const storageUrl = 'https://praetorstestnet.com/flyneat/';
export const storageUrl = 'https://fly-n-eat.com/admin/'
export const API_KEY = 'AIzaSyAtOEF2JBQyaPqt2JobxF1E5q6AX1VSWPk';
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
