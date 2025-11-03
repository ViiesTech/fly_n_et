/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Background from '../utils/Background';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import { isIOS } from '../utils/global';
import { api, errHandler, storageUrl } from '../utils/api';
import { DataContext } from '../utils/Context';
import moment from 'moment';

const Notifications = ({ navigation }) => {
    const {context, setContext} = useContext(DataContext);

    useEffect(() => {
        getNotifications();
    }, []);

    const Notification = ({ data }) => {
        console.log('data ===>',data?.data?.data?.restaurant?.title)
        return (
            <View style={styles.notification}>
                {/* <Image
                    source={{ uri: `${storageUrl}${data?.data?.sender?.profile_image}` }}
                    style={{ borderWidth: 1, borderColor: Color('lightText'), width: hp('6%'), height: hp('6%'), borderRadius: hp('50%'), alignSelf: 'center' }}
                /> */}
                <View style={{ width: wp('82%') }}>
                    <Small color={Color('homeBg')} heading font="bold">{data?.data?.data?.restaurant?.title || 'No Title'}</Small>
                    <Small color={Color('lightText')} heading font="regular"> {data?.data?.data?.message || 'No message'}</Small>
                </View>
                {/* <View style={{ alignItems: 'flex-end' }}>
                    {!data?.read_at && (
                        <View style={{borderRadius: hp('50%'), overflow: 'hidden'}}>
                            <Small style={{ fontSize: hp('1.1%'), backgroundColor: Color('homeBg'), paddingVertical: hp('0.6%'), paddingHorizontal: hp('1%') }}>1</Small>
                        </View>
                    )}
                    <Small color={Color('lightText')} heading font="regular">{moment(data?.created_at).format('hh:mm A')}</Small>
                </View> */}
            </View>
        );
    };

    const getNotifications = async () => {
        try {``
            const res = await api.get('/user/list-notify', {
                headers: {Authorization: `Bearer ${context?.token}`},
            });
            console.log('notifications response ===>',res.data?.notifications)
            setContext({
                ...context,
                notifications: res.data?.notifications,
            });
        } catch (err) {
            await errHandler(err, null, navigation);
        }
    };

    return (
        <>
            <BackBtn navigation={navigation} />
            <Background bgColor={Color('sidebarBg')} statusBarColor={Color('sidebarBg')} barStyle="dark-content" noBackground>
                <View>
                    <Br space={isIOS ? 0.5 : 2} />
                    <Pera style={{ textAlign: 'center' }} color={Color('homeBg')} heading font="bold">Notification</Pera>
                    <Br space={3.5} />
                    <Wrapper>
                        {
                            !context?.notifications
                            ?
                            <View style={{alignItems: 'center'}}>
                                <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
                            </View>
                            :
                            context?.notifications?.length === 0
                            ?
                            <Pera color={Color('shadow')} style={{textAlign: 'center'}}>No Notification Found</Pera>
                            :
                            context?.notifications?.map((val, index) => {
                                return <Notification data={val} key={index} />;
                            })
                        }
                        <Br space={2} />
                    </Wrapper>
                </View>
            </Background>
        </>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    notification: {
        borderWidth: 1,
        borderColor: Color('lightText'),
        paddingVertical: hp('1%'),
        paddingHorizontal: hp('1%'),
        borderRadius: hp('1%'),
        flexDirection: 'row',
        gap: hp('1%'),
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: hp('1.5%'),
        justifyContent: 'space-evenly',
    },
});
