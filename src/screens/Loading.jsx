/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Color } from '../utils/Colors';
import Background from '../utils/Background';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Loading = () => {
    return (
        <Background>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={hp('5%')} color={Color('text')} />
            </View>
        </Background>
    );
};

export default Loading;
