import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from '../utils/Colors';
import { ArrowLeft } from 'iconsax-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { isIOS } from '../utils/global';

const BackBtn = ({ navigation, x, translucent }) => {
    const width = x ? (x * 5) : (1 * 5);
    const top = translucent ?
    isIOS ? hp('6.3%') : hp('5%')
    :
    isIOS ? hp('6.3%') : hp('1.5%');
    return (
        <TouchableOpacity style={[styles.btn, {left: wp(`${width}%`), top: top}]} onPress={() => navigation.goBack()}>
            <ArrowLeft
                size={hp('3%')}
                color={Color('text')}
            />
        </TouchableOpacity>
    );
};

export default BackBtn;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Color('btnColor'),
        position: 'absolute',
        zIndex: 10,
        paddingVertical: hp('1%'),
        paddingHorizontal: hp('1%'),
        borderRadius: hp('50%'),
    },
});
