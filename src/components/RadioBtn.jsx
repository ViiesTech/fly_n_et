/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Color } from '../utils/Colors';

const RadioBtn = ({radioClr, isChecked, onPress}) => {

    return (
        <TouchableOpacity style={{
            width: wp('5%'),
            height: wp('5%'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color('headerIcon'),
            borderWidth: 1,
            borderColor: radioClr || Color('headerIconBg'),
            borderRadius: wp('100%'),
        }} onPress={onPress}>
            {
                isChecked && (
                    <View style={{
                        width: wp('3.5%'),
                        height: wp('3.5%'),
                        backgroundColor: radioClr,
                        borderRadius: wp('100%'),
                    }} />
                )
            }
        </TouchableOpacity>
    );
};

export default RadioBtn;
