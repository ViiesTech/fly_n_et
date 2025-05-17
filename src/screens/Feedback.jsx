/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
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
import { launchImageLibrary } from 'react-native-image-picker';

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
  // imageUri: Yup.string()
  //   .required('Please upload an image.')
  //   .test(
  //     'is-valid-uri',
  //     'Please upload a valid image.',
  //     (value) => value && value.startsWith('file://') || value.startsWith('http')
  //   ),
});

const Feedback = ({navigation,route}) => {
  const initialImages = Array(5).fill({
    id: '16101',
    uri: 'https://img.icons8.com/?size=100&id=16101&format=png&color=000000',
  });
  const options = ['Great', 'Average', 'Bad'];
  const options2 = ['Very Fast', 'Average', 'Slow', 'Very Slow'];
  
    const data = route?.params?.feedbackData;

  const [star, setStar] = useState(0);
  const [quality, setQuality] = useState(data?.quality ? data?.quality : '');
  const [serviceSpeed, setServiceSpeed] = useState(data?.service_speed ? data?.service_speed : '');
  const [overallSatisfaction, setOverallSatisfaction] = useState(data?.overall_satisfaction ? data?.overall_satisfaction : '');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(initialImages);
  const [imageUri, setImageUri] = useState(data?.image_path ? `${storageUrl}${data.image_path}` : null);
  const {context} = useContext(DataContext);

  // console.log('data of feedback fields ====>',data)

  const starCount = images?.filter(img => img.id === '8ggStxqyboK5').length;

  useEffect(() => {
    if (data?.rating) {
      setStar(data.rating); 
  
      setImages(images.map((img, index) => ({
        ...img,
        id: index < data.rating ? '8ggStxqyboK5' : '16101', 
        uri: `https://img.icons8.com/?size=100&id=${
          index < data.rating ? '8ggStxqyboK5' : '16101'
        }&format=png&color=000000`,
      })));
    }
  }, [data?.rating]);

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
        restaurant_id: data?.restaurant_id ? data?.restaurant_id : context?.restuarent?.id || 'default_restaurant_id', 
        // imageUri: imageUri || '', 
      };

      const formData = new FormData();
      formData.append('rating', star);
      formData.append('quality', quality);
      formData.append('service_speed', serviceSpeed);
      formData.append('overall_satisfaction', overallSatisfaction);
      formData.append('restaurant_id', data?.restaurant_id ? data?.restaurant_id : context?.restuarent?.id || 'default_restaurant_id'); // Fallback value
      if (imageUri) {
        // const isStorageUrl = imageUri.startsWith(storageUrl);
        // const isSameAsExisting = isStorageUrl && imageUri === data?.image_path;
        const isLocalFile = imageUri.startsWith('file://');
      
        if (isLocalFile) {
          formData.append('image_path', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'feedback_image.jpg',
          });
        } 
      }
      // if (imageUri) {
      //   formData.append('image_path', {
      //     uri: imageUri,
      //     type: 'image/jpeg',  
      //     name: 'feedback_image.jpg', 
      //   });
      // }
      // console.log('formdata',formData)
      
      await validationSchema.validate(obj, { abortEarly: false });

     if(!data) { 
      // alert('hello')
      const res = await api.post('/review/store', formData, {
        headers: { Authorization: `Bearer ${context?.token}`,'Content-Type': 'multipart/form-data' },
      });

      // console.log('api responnse',res.data)
      
      note('Feedback send successful', res?.data?.message, [
        { text: 'Okay', onPress: () => navigation.goBack() },
      ]);
    } else {
    //  return console.log('hello world',formData)
      const res = await api.post(`/review/${data?.id}`, formData,{
        headers: { Authorization: `Bearer ${context?.token}`,"Content-Type": 'multipart/form-data'}
      });
      // return console.log('response',res.data);
      note('Feedback updated successfully!',res?.data?.message,[
        {text: 'Okay', onPress: () => navigation.goBack()}
      ]);
    }
    } catch (err) {
      console.log('error',err)
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

  const onSelectImage = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('Image picker error: ', response.errorMessage);
        } else {
          // Set the selected image URI
          setImageUri(response.assets[0].uri);
        }
      }
    );
  }

  // console.log('hello world',imageUri)



  return (
    <>
      <BackBtn navigation={navigation} />
      <Background
        bgColor={Color('sidebarBg')}
        statusBarColor={Color('sidebarBg')}
        barStyle="dark-content"
        noBackground
        translucent={false}>
        <ScrollView contentContainerStyle={{paddingBottom: hp(10)}}>
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
            <TouchableOpacity
              style={{
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Color('homeBg'),
                borderRadius: hp('2%'),
                height: hp(15)
              }}
              onPress={() => onSelectImage()}
              >
              {imageUri ?  
                  <Image borderRadius={hp('2%')} source={{uri: imageUri}} style={{height: hp(15),width: wp(90)}} />
                :
                <>
                <Image source={require('../assets/images/upload.png')} style={{height: hp(5),width: hp(5)}} />
                <Text style={{
                  color: Color(''),
                  fontSize: hp(2)
                }}>Select an image</Text>
                </>
              }
              </TouchableOpacity>
            <Br space={3} />
            <Btn
              onPress={SendFeedback}
              loading={loading}
              btnStyle={{backgroundColor: Color('homeBg')}}
              label={data ? "Update Feedback" : "Send Feedback"}
            />
          </Wrapper>
        </ScrollView>
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
