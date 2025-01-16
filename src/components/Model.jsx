/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Color } from '../utils/Colors';

const Model = ({ show, style, children }) => {

    if (!show) {
        return <></>;
    }

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: widthPercentageToDP('100%'),
            height: heightPercentageToDP('100%'),
            zIndex: 10,
            backgroundColor: Color('modelDark'),
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <ScrollView style={[{
                maxHeight: heightPercentageToDP('50%'),
                backgroundColor: Color('text'),
                padding: heightPercentageToDP('1%'),
                width: widthPercentageToDP('90%'),
                borderRadius: heightPercentageToDP('0.5%'),
            }, style]}>{children}</ScrollView>
        </View>
    );
};

export default Model;
