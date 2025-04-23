/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Home, InfoCircle, Lock, Logout, Notification, TableDocument } from 'iconsax-react-native';
import { DataContext } from '../utils/Context';

const Settings = ({ navigation }) => {
    const {context} = useContext(DataContext)
    return (
        <>
            <BackBtn navigation={navigation} />
            <Br space={6} />
            <Background translucent={false} bgColor={Color('sidebarBg')} statusBarColor={Color('sidebarBg')} barStyle="dark-content" noBackground>
                <View>
                    <Br space={8} />
                    <Wrapper>
                        <Pera color={Color('homeBg')} heading font="bold">Settings</Pera>
                        <Br space={1.2} />
                        {/* <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Notifications')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <Notification
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Notification</Small>
                            </View>
                        </TouchableOpacity> */}
                        <Br space={1.2} />
                       {context?.token && 
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AccountSettings')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <Home
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Account Settings</Small>
                            </View>
                        </TouchableOpacity>
                        }
                        <Br space={1.2} />
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('About')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <InfoCircle
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">About App</Small>
                            </View>
                        </TouchableOpacity>
                        <Br space={1.2} />
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Terms')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <TableDocument
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Terms & Condition</Small>
                            </View>
                        </TouchableOpacity>
                        <Br space={1.2} />
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Privacy')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <Lock
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Privacy Policy</Small>
                            </View>
                        </TouchableOpacity>
                        <Br space={1.2} />
                       {context?.token &&
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Message', {theme: 'light', title: 'Logout', message: 'Are you sure you want to logout?', screen: 'Logout'})}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hp('1.5%') }}>
                                <Logout
                                    size={hp('3%')}
                                    color={Color('drawerBg')}
                                />
                                <Small color={Color('drawerBg')} heading font="bold">Sign Out</Small>
                            </View>
                        </TouchableOpacity>
                        }
                    </Wrapper>
                </View>
            </Background>
        </>
    );
};

export default Settings;

const styles = StyleSheet.create({
    option: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Color('homeBg'),
        borderRadius: hp('10%'),
    },
});
