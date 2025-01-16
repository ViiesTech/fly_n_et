/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import Background from '../utils/Background';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import Navigation from '../components/Navigation';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import { api, errHandler, storageUrl } from '../utils/api';
import { DataContext } from '../utils/Context';

const Bookmark = ({ navigation }) => {
    const {context, setContext} = useContext(DataContext);

    useEffect(() => {
        getSavedRestuarents();
    }, []);

    const getSavedRestuarents = async () => {
        try {
            const res = await api.get('/bookmark/list', {
                headers: { Authorization: `Bearer ${context?.token}` },
            });
            setContext({
                ...context,
                savedRestuarents: res.data?.bookmarks,
            });
        } catch (err) {
            await errHandler(err, null, navigation);
        }
    };

    return (
        <>
            <BackBtn navigation={navigation} />
            <Background barStyle={'dark-content'} translucent={false} noBackground>
                <Br space={8} />
                <Wrapper>
                    <Pera color={Color('homeBg')} heading font="bold">Bookmark</Pera>
                    <Br space={2} />
                    {
                        !context?.savedRestuarents
                        ?
                        <ActivityIndicator size={'large'} color={Color('drawerBg')} />
                        :
                        context?.savedRestuarents?.length === 0
                        ?
                        <Small style={{textAlign: 'center'}} color={Color('homeBg')}>
                            No Bookmark Found
                        </Small>
                        :
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', columnGap: wp('5%'), rowGap: hp('2%')}}>
                            {
                                context?.savedRestuarents?.map((val, index) => {
                                    return (
                                        <Pressable key={index} style={styles.card} onPress={() => navigation.navigate('RestuarantDetails', {id: val?.restaurant_id})}>
                                            <Image source={{uri: `${storageUrl}${val?.restaurant?.image_path}`}} style={styles.cardImg} />
                                            <Small color={Color('homeBg')} heading font="bold">{val?.restaurant?.title}</Small>
                                            <Small style={{fontSize: hp('1.2%')}} color={Color('homeBg')} heading font="light">{val?.restaurant?.location}</Small>
                                        </Pressable>
                                    );
                                })
                            }
                        </View>
                    }
                </Wrapper>
                <Br space={10} />
            </Background>
            <Navigation navigation={navigation} />
        </>
    );
};

export default Bookmark;

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: Color('homeBg'),
        paddingVertical: hp('3%'),
        width: wp('100%'),
        flexDirection: 'row',
        borderBottomLeftRadius: hp('3%'),
        borderBottomRightRadius: hp('3%'),
    },
    input: {
        borderWidth: 1,
        borderColor: Color('lightText'),
        borderRadius: hp('50%'),
        width: wp('70%'),
    },
    inputField: {
        borderRadius: hp('50%'),
        paddingHorizontal: wp('5%'),
        color: Color('homeBg'),
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
    },
    card: {
        width: wp('42%'),
    },
    cardImg: {
        width: wp('42%'),
        height: hp('12%'),
        borderRadius: hp('1%'),
        marginBottom: hp('0.2%'),
    },
});
