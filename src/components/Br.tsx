/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Br = ({ space }: { space: number }) => {
    return (
        <View style={{ height: hp(`${space}%`), opacity: 0, overflow: 'visible', zIndex: 0 }} />
    );
};

export default Br;
