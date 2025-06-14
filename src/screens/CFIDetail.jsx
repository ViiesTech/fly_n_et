/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import BackBtn from '../components/BackBtn';
import Background from '../utils/Background';
import Wrapper from '../components/Wrapper';
import {Color} from '../utils/Colors';
import Btn from '../utils/Btn';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Add, Calendar, Clock, Location, Star1} from 'iconsax-react-native';
import {H5, H6, Pera} from '../utils/Text';
import Br from '../components/Br';
import Navigation from '../components/Navigation';
import {api, errHandler, getCityAndState, storageUrl} from '../utils/api';
import {DataContext} from '../utils/Context';
import {capitalize} from '../utils/global';
import Model from '../components/Model';
import Toast from 'react-native-simple-toast';

const CFIDetail = ({navigation, route}) => {
  const {context, setContext} = useContext(DataContext);
  const [show, setShow] = useState();

  console.log('hello',context?.last_pro_user?.user_info)

  useEffect(() => {
    getCFI();
  }, []);
  const getCFI = async () => {
    try {
      const res = await api.get(`/user/pro-users/${route?.params?.id}`, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });

      // console.log('detail response',res.data)

      setContext(prevContext => ({
        ...prevContext,
        last_pro_user: res?.data?.user,
      }));
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };

  const giveRatings = async ratings => {
    try {
      Toast.show('Please Wait...', Toast.SHORT);
      await api.post(
        '/user/review-store',
        {
          user_id: context?.last_pro_user?.id,
          rating: ratings,
        },
        {
          headers: {Authorization: `Bearer ${context?.token}`},
        },
      );
      await getCFI();
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };

  return (
    <>
        <BackBtn navigation={navigation} />
      <Background
        translucent={false}
        statusBarColor={Color('homeBg')}
        noBackground>
        <Br space={5} />
        {!context?.last_pro_user ? (
          <View style={{alignItems: 'center', marginTop: hp('5%')}}>
            <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
          </View>
        ) : (
          <>
            <Wrapper>
              <H5
                style={{textAlign: 'center'}}
                heading
                font="bold"
                color={Color('shadow')}>
                {capitalize(context?.last_pro_user?.name)} -{' '}
                {capitalize(context?.last_pro_user?.user_type.toUpperCase())}
              </H5>
              <Br space={0.5} />
              <Image
                source={{
                  uri: `${storageUrl}${context?.last_pro_user?.user_info?.profile_image}`,
                }}
                style={{
                  width: '100%',
                  height: hp('25%'),
                  borderRadius: hp('2%'),
                }}
              />
              <Br space={1.5} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hp('1%'),
                  marginBottom: hp('1.5%'),
                }}>
                <Location size={hp('2.5%')} color={Color('modelDark')} />
                <Pera color={Color('modelDark')} numberOfLines={1}>
                  {/* {context?.last_pro_user?.user_info?.address || 'No Location Found'} */}
                  {context?.last_pro_user?.user_info?.city && context?.last_pro_user?.user_info?.state ? context?.last_pro_user?.user_info?.city + ',' + context?.last_pro_user?.user_info?.state : 'No Location Found'}
                </Pera>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hp('1%'),
                  marginBottom: hp('1.5%'),
                }}>
                <Clock size={hp('2.5%')} color={Color('modelDark')} />
                <Pera color={Color('modelDark')} numberOfLines={1}>
                  {context?.last_pro_user?.user_info?.operation_time ||
                    'No Operational Time Found'}
                </Pera>
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hp('1%'),
                }}>
                <Star1 size={hp('2.5%')} color={'#FFC000'} variant="Bold" />
                <Pera color={Color('modelDark')}>
                  {!context?.avg_rating
                    ? 0
                    : parseFloat(context?.avg_rating).toFixed(1)}{' '}
                  ({context?.last_pro_user?.rating_count})
                </Pera>
              </View>
              <Br space={1.3} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hp('1%'),
                }}>
                <Calendar size={hp('2.5%')} color={Color('modelDark')} />
                <Pera color={Color('modelDark')}>
                  {context?.last_pro_user?.user_info?.licence_expiry ? 'Certificate Expires on:' + ' ' + context?.last_pro_user?.user_info?.licence_expiry : 'No Date Found'}
                </Pera>
              </View>
            </Wrapper>
            <Br space={2} />
            <Wrapper>
              <H6 font="bold" heading color={Color('shadow')}>
                Bio
              </H6>
              <Br space={1} />
              <Pera color={Color('modelDark')}>
                {context?.last_pro_user?.user_info?.bio}
              </Pera>
            </Wrapper>
            <Br space={2.5} />
            <ScrollView
              horizontal
              style={{paddingLeft: hp('0.5%')}}
              showsHorizontalScrollIndicator={false}>
              {context?.last_pro_user?.images?.map((val, index) => {
                return (
                  <Pressable onPress={() => setShow(val)}>
                    <Image
                      key={index}
                      source={{uri: `${storageUrl}${val?.path}`}}
                      style={{
                        width: hp('10%'),
                        height: hp('10%'),
                        borderRadius: hp('2%'),
                        marginLeft: hp('1.5%'),
                      }}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
            <Br space={3} />
            <Wrapper>
              <Btn
                onPress={() =>
                  Linking.openURL(`tel:${context?.last_pro_user?.phone}`)
                }
                btnStyle={{backgroundColor: Color('homeBg')}}
                label="Contact"
              />
              <Br space={1.5} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {[1, 1, 1, 1, 1].map((_, index) => {
                  const count = index + 1;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (!context?.last_pro_user?.pro_review_exist) {
                          return Alert.alert(
                            'Confirm',
                            `Are you sure to give this user the rating of ${count} star(s)?`,
                            [
                              {text: 'Cancel'},
                              {
                                text: 'Confirm',
                                onPress: () => giveRatings(count),
                              },
                            ],
                          );
                        }
                      }}>
                      <Image
                        source={{
                          uri:
                            count <=
                            context?.last_pro_user?.pro_review_exist?.rating
                              ? 'https://img.icons8.com/fluency/48/star--v2.png'
                              : 'https://img.icons8.com/?size=100&id=16101&format=png&color=000000',
                        }}
                        style={{
                          width: hp('5%'),
                          height: hp('5%'),
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Wrapper>
            <Br space={12} />
          </>
        )}
      </Background>
      <Navigation navigation={navigation} />
      {show && (
        <Model style={{padding: 0}} show={show}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 1,
              right: hp('1%'),
              top: hp('1%'),
              padding: hp('0.5%'),
              backgroundColor: Color('modelDark'),
              borderRadius: hp('50%'),
            }}
            onPress={() => setShow()}>
            <Add
              size="32"
              color={Color('text')}
              style={{transform: [{rotate: '135deg'}], alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
          <Image
            source={{uri: `${storageUrl}${show?.path}`}}
            style={{width: wp('90%'), height: hp('50%')}}
            resizeMode="stretch"
          />
        </Model>
      )}
    </>
  );
};

export default CFIDetail;
