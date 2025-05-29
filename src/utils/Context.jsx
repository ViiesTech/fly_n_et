/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const DataContext = createContext(null);
export const AppContext = ({ children }) => {
    const [context, setContext] = useState({
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
        subscribed_details: null,
        skipNavigationCheck: false
        // isHome: false,
        // isPoint: false,
    });

    useEffect(() => {
        if (!context?.token || !context?.user) {
            // alert('gretting token')
            checkRememberData();
        }
    }, []);

    const checkRememberData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const isVerified = await AsyncStorage.getItem('isVerified');
            const user = await AsyncStorage.getItem('user');

            if (token && isVerified && user) {
                setContext({
                    ...context,
                    token,
                    isVerified,
                    user: JSON.parse(user),
                });
            }
        }catch(err) {
            console.log(err);
        }
    };

    return (
        <DataContext.Provider value={{ context, setContext }}>
            {children}
        </DataContext.Provider>
    );
};
