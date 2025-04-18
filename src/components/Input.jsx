import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Color } from '../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Small } from '../utils/Text';

const Input = ({ mode, label, style, inputStyle,textAlign,multiline,keyboardType, ...props }) => {
    const lightModeStyle = mode === 'light' ? {
        borderColor: Color('lightText'),
    } : {};
    return (
        <>
            <View style={[styles.input, lightModeStyle, style]}>
                {label && <Small font="regular" style={styles.label} color={mode === 'light' ? Color('shadow') : Color('text')}>{label}</Small>}
                <TextInput  keyboardType={keyboardType} multiline={multiline} textAlignVertical={textAlign} style={[styles.inputField, inputStyle, {color: mode === 'light' ? Color('shadow') : Color('text')}]} {...props} />
            </View>
        </>
    );
};

export default Input;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Color('lightGray'),
        borderRadius: hp('50%'),
        position: 'relative',
    },
    inputField: {
        borderRadius: hp('50%'),
        paddingHorizontal: wp('5%'),
        fontFamily: 'Montserrat-Regular',
        height: hp('4%'),
        marginTop: hp('1.5%'),
        paddingVertical: 0,
    },
    label: {
        position: 'absolute',
        top: hp('.3%'),
        left: wp('5%'),
        fontSize: hp('1.2%'),
    },
});
