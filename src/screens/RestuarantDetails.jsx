/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Br from '../components/Br';
import { H6, Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import Btn from '../utils/Btn';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import { Location } from 'iconsax-react-native';
import { api, errHandler, storageUrl } from '../utils/api';
import { DataContext } from '../utils/Context';
import moment from 'moment';
import { capitalize } from '../utils/global';
import { useIsFocused } from '@react-navigation/native';

const RestuarantDetails = ({ navigation, route }) => {
  const IsFocused = useIsFocused();
  const { context, setContext } = useContext(DataContext);
  const [view, setView] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const reviews = context?.restuarent?.reviews || [];
  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);
  useEffect(() => {
    getRestuarentDetails();
  }, [IsFocused]);

  const getRestuarentDetails = async () => {
    try {
      const res = await api.get('/restaurant/show/' + route?.params?.id, {
        headers: { Authorization: `Bearer ${context?.token}` },
      });
      setContext({
        ...context,
        restuarent: res.data?.restaurant,
      });
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };
  const Tabs = () => {
    const isFirstView = view === 1;
    return (
      <View style={{ flexDirection: 'row', gap: hp('1.5%') }}>
        <TouchableOpacity
          onPress={() => setView(1)}
          style={isFirstView ? styles.btn1 : styles.btn2}>
          <Small
            heading
            font="medium"
            color={isFirstView ? Color('text') : Color('homeBg')}>
            About
          </Small>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setView(2)}
          style={!isFirstView ? styles.btn1 : styles.btn2}>
          <Small
            heading
            font="medium"
            color={!isFirstView ? Color('text') : Color('homeBg')}>
            Menu
          </Small>
        </TouchableOpacity>
      </View>
    );
  };
  const Review = ({ url, name, rating, description, created_at }) => {
    return (
      <View style={{ flexDirection: 'row', gap: wp('3%'), alignItems: 'center' }}>
        {/* Profile Image Section */}
        <View>
          <View
            style={{
              height: hp('9%'),
              width: hp('9%'),
              borderRadius: hp('50%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Color('homeBg'),
            }}>
            <Image
              source={{ uri: url }}
              resizeMode="cover"
              style={{
                height: hp('8%'),
                width: hp('8%'),
                borderRadius: hp('50%'),
              }}
            />
          </View>
        </View>

        {/* Review Details Section */}
        <View style={{ width: wp('68%') }}>
          {/* Row with Name and Created At Date */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Pera color={Color('homeBg')} heading font="bold">
              {name}
            </Pera>
            <Small color={Color('lightText')} heading font="regular">
              {/* {created_at ? new Date(created_at).toDateString() : 'N/A'} */}
              {created_at ? moment(created_at).format('YYYY-MM-DD') : 'N/A'}
            </Small>
          </View>

          {/* Stars for Rating */}
          <View style={{ flexDirection: 'row' }}>
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilledStar = index < (rating || 0); // Compare index with rating
              return (
                <Image
                  key={index}
                  source={{
                    uri: isFilledStar
                      ? 'https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000' // Filled star
                      : 'https://img.icons8.com/?size=100&id=16101&format=png&color=000000', // Empty star
                  }}
                  style={{ width: hp('1.5%'), height: hp('1.5%') }}
                />
              );
            })}
          </View>
          {/* Review Description */}
          <Small color={Color('lightText')} heading font="regular">
            {description ||
              'No feedback.'}
          </Small>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar translucent barStyle="light-content" />
      <BackBtn navigation={navigation} translucent />
      {!context?.restuarent || context?.restuarent?.id !== route?.params?.id ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} color={Color('drawerBg')} />
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: Color('text') }}>
          <Image
            source={{
              uri: `${storageUrl}${context?.restuarent?.image_path}`,
            }}
            resizeMode="cover"
            style={{ height: hp('40%'), width: wp('100%') }}
          />
          <Br space={3} />
          <Wrapper>
            <Tabs />
            <Br space={2} />
            {view === 1 ? (
              <View>
                <H6 color={Color('homeBg')} heading font="bold">
                  {context?.restuarent?.title}
                </H6>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: hp('.5%'),
                    alignItems: 'center',
                  }}>
                  <Small color={Color('homeBg')} heading font="bold">
                    Location
                  </Small>
                  <Location size={hp('2%')} color={Color('homeBg')} />
                  <Small color={Color('lightText')} heading font="medium">
                    {context?.restuarent?.address}
                  </Small>
                </View>
                <Br space={2} />
                <Pera color={Color('homeBg')} heading font="bold">
                  Opening Hours
                </Pera>
                <Br space={0.5} />
                <Small color={Color('lightText')} heading font="medium">
                  {context?.restuarent?.operation_hours}
                  {/* {moment(context?.restuarent?.start_time, 'HH:mm').format(
                    'hh:mm A',
                  )}{' '}
                  -{' '}
                  {moment(context?.restuarent?.end_time, 'HH:mm').format(
                    'hh:mm A',
                  )} */}
                </Small>
                {/* <Small color={Color('homeBg')} heading font="medium">
                  Add to calendar
                </Small> */}
                <Br space={2} />
                <Pera color={Color('homeBg')} heading font="bold">
                  Airport
                </Pera>
                <Br space={0.5} />
                <Small color={Color('lightText')} heading font="medium">
                  {context?.restuarent?.airport}
                </Small>
                <Br space={2} />
                <Pera color={Color('homeBg')} heading font="bold">
                  Description
                </Pera>
                <Br space={0.5} />
                <Small color={Color('lightText')} heading font="medium">
                  {context?.restuarent?.description}
                </Small>
                <Br space={2} />
                <Pera color={Color('homeBg')} heading font="bold">
                  Location
                </Pera>
                <Br space={0.5} />
                <View
                  style={{
                    width: wp('90%'),
                    height: hp('12%'),
                    borderWidth: 1,
                    borderColor: Color('lightText'),
                    backgroundColor: Color('sidebarBg'),
                  }}
                />
                <Br space={2} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: hp('1.2%'),
                    }}>
                    <Pera color={Color('homeBg')} heading font="bold">
                      Review & Rating
                    </Pera>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: hp('0.5%'),
                      }}>
                      <Image
                        source={{
                          uri: 'https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000',
                        }}
                        style={{ width: 20, height: 20 }}
                      />
                      <Small color={Color('homeBg')} heading font="regular">
                        {context?.restuarent?.average_rating?.substring(0, 3)} (
                        {context?.restuarent?.reviews?.length})
                      </Small>
                    </View>
                  </View>
                  {!showAll && reviews.length > 2 && (
                    <TouchableOpacity onPress={() => setShowAll(true)}>
                      <Small color={Color('homeBg')} heading font="medium">
                        See All
                      </Small>
                    </TouchableOpacity>
                  )}
                </View>
                <Br space={2} />
                {displayedReviews.map(review => {
                  return (
                    <View key={review.id}>
                      <Review
                        name={capitalize(review?.user?.name) || 'Anonymous'}
                        url={
                          `${storageUrl}${review?.user?.user_info?.profile_image}` ||
                          null
                        }
                        rating={review?.rating || 0}
                        createdAt={review?.created_at || 'N/A'}
                        description={review?.overall_satisfaction}
                        created_at={review?.created_at}
                      />
                      <Br space={2} />
                    </View>
                  );
                })}
              </View>
            ) : (
              <View>
                <Br space={1} />
                {context?.restuarent?.menues?.length === 0 && (
                  <Small style={{ textAlign: 'center' }} color={Color('shadow')}>
                    No Menu Found
                  </Small>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    columnGap: wp('5%'),
                    rowGap: hp('1.5%'),
                    paddingBottom: hp('2%'),
                  }}>
                  {context?.restuarent?.menues?.map((val, index) => {
                    return (
                      <View key={index} style={styles.card}>
                        <Image
                          source={{ uri: `${storageUrl}${val?.image_path}` }}
                          style={styles.cardImg}
                        />
                        <Small color={Color('homeBg')} heading font="medium">
                          {val?.title}
                        </Small>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            <View style={{ height: 1, backgroundColor: '#ccc' }} />
            <Br space={4} />
            <Btn
              onPress={() => Linking.openURL(`tel:${context?.restuarent?.phone}`)}
              btnStyle={{ backgroundColor: Color('homeBg') }}
              label="Call Restaurant"
            />
            {
              !context?.restuarent?.reviewed && (
                <>
                  <Br space={2} />
                  <Btn
                    onPress={() => navigation.navigate('Feedback')}
                    btnStyle={{ backgroundColor: Color('homeBg') }}
                    label="Send Feedback"
                  />
                </>
              )
            }
            <Br space={2} />
          </Wrapper>
        </ScrollView>
      )}
    </>
  );
};

export default RestuarantDetails;

const styles = StyleSheet.create({
  btn1: {
    backgroundColor: Color('homeBg'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: hp('30%'),
  },
  btn2: {
    backgroundColor: Color('text'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: hp('30%'),
    shadowColor: Color('lightText'),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
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
