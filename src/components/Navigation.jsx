/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Color } from '../utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Small } from '../utils/Text';
import Br from './Br';

const Navigation = ({ label, navigation, ...props }) => {
    return (
        <>
            <View style={styles.navigation}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Home')}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/1.png')}
                        style={{
                            width: hp('3.5%'),
                            height: hp('3.5%'),
                        }}
                    />
                    <Br space={0.5} />
                    <Small size={hp(1.8)} font="Bold">Fly-Eat-Back</Small>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('PointToPoint')}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/2.png')}
                        style={{
                            width: hp('3.5%'),
                            height: hp('3.5%'),
                        }}
                    />
                    <Br space={0.5} />
                    <Small size={hp(1.8)} font="Bold">Point To Point</Small>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('CFISearch')}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/3.png')}
                        style={{
                            width: hp('3.5%'),
                            height: hp('3.5%'),
                        }}
                    />
                    <Br space={0.5} />
                    <Small size={hp(1.8)} font="Bold">CFI/CFII</Small>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Settings')}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/4.png')}
                        style={{
                            width: hp('3%'),
                            height: hp('3%'),
                        }}
                    />
                    <Br space={0.5} />
                    <Small font="Bold">Setting</Small>
                </TouchableOpacity> */}
            </View>
        </>
    );
};

export default Navigation;

const styles = StyleSheet.create({
    navigation: {
        backgroundColor: Color('homeBg'),
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: hp('2.5%'),
        borderTopLeftRadius: hp('3%'),
        borderTopRightRadius: hp('3%'),
    },
});
