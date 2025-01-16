/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Background from '../utils/Background';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Br from '../components/Br';
import {Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import Btn from '../utils/Btn';
import {isIOS} from '../utils/global';
import {api, errHandler, note, storageUrl} from '../utils/api';
import {DataContext} from '../utils/Context';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Please give atleast one star.')
    .required('Rating is required!'),
  quality: Yup.string().required(
    'Please select atleast one option from quality section.',
  ),
  service_speed: Yup.string().required(
    'Please select atleast one option from service speed section.',
  ),
  restaurant_id: Yup.string().required('Invalid Restaurant id'),
});

const Feedback = ({navigation}) => {
  const initialImages = Array(5).fill({
    id: '16101',
    uri: 'https://img.icons8.com/?size=100&id=16101&format=png&color=000000',
  });
  const options = ['Great', 'Average', 'Bad'];
  const options2 = ['Very Fast', 'Average', 'Slow', 'Very Slow'];

  const [star, setStar] = useState(0);
  const [quality, setQuality] = useState('');
  const [serviceSpeed, setServiceSpeed] = useState('');
  const [overallSatisfaction, setOverallSatisfaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(initialImages);
  const {context} = useContext(DataContext);

  const starCount = images?.filter(img => img.id === '8ggStxqyboK5').length;

  useEffect(() => {
    setStar(starCount);
  }, [starCount]);

  const handleSelect = qty => {
    setQuality(qty);
  };
  const handleSelect2 = service_speed => {
    setServiceSpeed(service_speed); // Update the selected quality
  };
  const SendFeedback = async () => {
    try {
      setLoading(true);
      const obj = {
        rating: star,
        quality,
        service_speed: serviceSpeed,
        overall_satisfaction: overallSatisfaction,
        restaurant_id: context?.restuarent?.id || 'default_restaurant_id', // Fallback value
      };
      await validationSchema.validate(obj, {abortEarly: false});
      const res = await api.post('/review/store', obj, {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
      note('Feedback send successful', res?.data?.message, [
        {text: 'Okay', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setLoading(false);
    }
  };
  const toggleId = selectedIndex => {
    setImages(prevImages =>
      prevImages.map((img, index) => ({
        ...img,
        id: index <= selectedIndex ? '8ggStxqyboK5' : '16101', // Highlight all stars up to the selected index
        uri: `https://img.icons8.com/?size=100&id=${
          index <= selectedIndex ? '8ggStxqyboK5' : '16101'
        }&format=png&color=000000`,
      })),
    );
  };

  return (
    <>
      <BackBtn navigation={navigation} />
      <Background
        bgColor={Color('sidebarBg')}
        statusBarColor={Color('sidebarBg')}
        barStyle="dark-content"
        noBackground
        translucent={false}>
        <View style={{height: hp('100%')}}>
          <Br space={isIOS ? 0.5 : 2.5} />
          <Pera
            style={{textAlign: 'center'}}
            color={Color('homeBg')}
            heading
            font="bold">
            Feedback
          </Pera>
          <Br space={5} />
          <Image
            source={{
              uri: `${storageUrl}${context?.user?.user_info?.profile_image}`,
            }}
            style={{
              width: hp('14%'),
              height: hp('14%'),
              borderRadius: hp('50%'),
              alignSelf: 'center',
            }}
          />
          <Br space={1} />
          <Pera
            style={{textAlign: 'center'}}
            color={Color('homeBg')}
            heading
            font="bold">
            {context?.user?.name}
          </Pera>
          <Small
            style={{textAlign: 'center'}}
            color={Color('lightText')}
            heading
            font="medium">
            How was the Experience?
          </Small>
          <Br space={1} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: hp('0.5%'),
            }}>
            {images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => toggleId(index)}>
                <Image
                  source={{uri: img.uri}}
                  style={{
                    width: hp('5%'),
                    height: hp('5%'),
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Br space={3} />
          <Wrapper>
            <Small color={Color('homeBg')} heading font="bold">
              Quality
            </Small>
            <Br space={1} />
            <View
              style={{flexDirection: 'row', gap: hp('1%'), flexWrap: 'wrap'}}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleSelect(option)}>
                  <View
                    style={[
                      styles.option,
                      quality === option && styles.selectedOption, // Add selected background
                    ]}>
                    <Small
                      color={
                        quality === option
                          ? Color('selectedText') // Highlighted text color
                          : Color('homeBg') // Default text color
                      }
                      heading
                      font="medium">
                      {option}
                    </Small>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Wrapper>
          <Br space={3} />
          <Wrapper>
            <Small color={Color('homeBg')} heading font="bold">
              Service speed
            </Small>
            <Br space={1} />
            <View
              style={{flexDirection: 'row', gap: hp('1%'), flexWrap: 'wrap'}}>
              {options2.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleSelect2(option)}>
                  <View
                    style={[
                      styles.option,
                      serviceSpeed === option && styles.selectedOption, // Add selected background
                    ]}>
                    <Small
                      color={
                        serviceSpeed === option
                          ? Color('selectedText') // Highlighted text color
                          : Color('homeBg') // Default text color
                      }
                      heading
                      font="medium">
                      {option}
                    </Small>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Wrapper>
          <Br space={3} />
          <Wrapper>
            <Small color={Color('homeBg')} heading font="bold">
              Overall Satisfaction
            </Small>
            <Br space={1} />
            <View
              style={{
                borderWidth: 1,
                borderColor: Color('homeBg'),
                borderRadius: hp('2%'),
                padding: hp('1%'),
              }}>
              <TextInput
                numberOfLines={6}
                style={{textAlignVertical: 'top', color: Color('shadow')}}
                multiline
                value={overallSatisfaction}
                onChangeText={setOverallSatisfaction}
              />
            </View>

            <Br space={3} />
            <Btn
              onPress={SendFeedback}
              loading={loading}
              btnStyle={{backgroundColor: Color('homeBg')}}
              label="Send Feedback"
            />
          </Wrapper>
        </View>
      </Background>
    </>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  option: {
    paddingTop: hp('0.5%'),
    paddingBottom: hp('0.8%'),
    borderRadius: hp('30%'),
    paddingHorizontal: wp('5%'),
    borderWidth: 1,
    borderColor: Color('homeBg'),
  },
  selectedOption: {
    backgroundColor: Color('drawerBg'), // Highlighted background for selection
    borderColor: Color('drawerBg'),
  },
});
