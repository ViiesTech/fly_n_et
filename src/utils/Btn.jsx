import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Pera } from './Text';
import { Color } from './Colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Btn = ({ loading, loadingColor, label, icon, onPress, textStyle, btnStyle }) => {
    return (
        <>
            <TouchableOpacity disabled={loading} style={[styles.btn, btnStyle]} onPress={onPress}>
                {
                    loading
                    ?
                    <ActivityIndicator size={hp('2.6%')} color={loadingColor || Color('text')} />
                    :
                    <>
                        <Pera style={textStyle}>{label}</Pera>
                        {icon}
                    </>
                }
            </TouchableOpacity>
        </>
    );
};

export default Btn;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Color('btnColor'),
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: hp('1%'),
        borderRadius: hp('50%'),
    },
});
