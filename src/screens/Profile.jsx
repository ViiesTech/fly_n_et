/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
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
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import { Add, ArrowLeft, Bookmark, DocumentUpload, Edit2, Trash } from 'iconsax-react-native';
import Navigation from '../components/Navigation';
import Wrapper from '../components/Wrapper';
import { capitalize, isIOS } from '../utils/global';
import { DataContext } from '../utils/Context';
import { api, errHandler, storageUrl } from '../utils/api';
import Toast from 'react-native-simple-toast';
import Background from '../utils/Background';
import { launchImageLibrary } from 'react-native-image-picker';
import Model from '../components/Model';
import { useIsFocused } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const focused = useIsFocused();
  const { context, setContext } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState(context?.serviceImages || []);
  const [show, setShow] = useState();
  const translate = -hp('5%');

  useEffect(() => {
    getRestuarents();
    getUploadedImages();
  }, [focused]);

  useEffect(() => {
    setImages(context?.serviceImages);
  }, [context?.serviceImages]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const getRestuarents = async (page = 1) => {
    if (isLoading || !hasMore) {return;}

    setIsLoading(true);

    try {
      const res = await api.get(`/restaurant/list?page=${page}`, {
        headers: { Authorization: `Bearer ${context?.token}` },
      });

      const newRestaurants = res?.data?.restaurant || [];

      setContext((prevContext) => ({
        ...prevContext,
        restuarents: page === 1
          ? newRestaurants // Replace existing restaurants on the first page
          : [...prevContext.restuarents, ...newRestaurants], // Append new restaurants
      }));

      setCurrentPage(page);
      setHasMore(page < res?.data?.last_page);

    } catch (err) {
      await errHandler(err, null, navigation);
    } finally {
      setIsLoading(false);
    }
  };

  const bookmark = async id => {
    try {
      const res = await api.post(
        '/bookmark/store',
        {
          restaurant_id: id,
        },
        {
          headers: { Authorization: `Bearer ${context?.token}` },
        },
      );
      Toast.show(res?.data?.message, Toast.SHORT);
      await getRestuarents();
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };

  const uploadImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
    });

    if (result?.assets) {
      updateImages(result?.assets);
    }
  };

  const removeImage = (index) => {
    const arr = images.filter((_, i) => i !== index);
    setImages(arr);
  };

  const getUploadedImages = async () => {
    const res = await api.get(
      '/user/service-images',
      {headers: { Authorization: `Bearer ${context?.token}` }},
    );
    setContext((prevContext) => ({
      ...prevContext,
      serviceImages: res.data?.images,
    }));
  };

  const removeUploadedImage = async (id, index) => {
    try {
      Toast.show('Deleting...', Toast.SHORT);
      await api.delete(
        '/user/remove-image/' + id,
        {headers: { Authorization: `Bearer ${context?.token}` }},
      );
      const arr = images.filter((_, i) => i !== index);
      setContext((prevContext) => ({
        ...prevContext,
        serviceImages: arr,
      }));
    }catch(err) {
      await errHandler(err, null, navigation);
    }
  };

  const TopBar = () => {
    return (
      <>
        <View style={styles.topbar}>
          <ImageBackground
            style={{
              width: wp('100%'),
            }}
            source={{
              uri: context?.user?.user_info?.banner_image ? `${storageUrl}${context?.user?.user_info?.banner_image}` : 'https://picsum.photos/500/300',
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: hp('3%'),
                height: hp('20%'),
                marginTop: hp('2%'),
              }}>
              <View style={{ width: wp('20%'), alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color('btnColor'),
                    width: hp('5%'),
                    height: hp('5%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: hp('50%'),
                  }}
                  onPress={() => navigation.goBack()}>
                  <ArrowLeft size={hp('2.5%')} color={Color('text')} />
                </TouchableOpacity>
              </View>
              <View style={{ width: wp('60%'), alignItems: 'center' }} />
              <View style={{ width: wp('20%'), alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color('btnColor'),
                    width: hp('5%'),
                    height: hp('5%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: hp('50%'),
                  }}
                  onPress={() => navigation.navigate('AccountSettings')}>
                  <Edit2 size={hp('2.5%')} color={Color('text')} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
        <Image
          source={{
            uri: `${storageUrl}${context?.user?.user_info?.profile_image}`,
          }}
          style={{
            borderWidth: 1,
            borderColor: Color('shadow'),
            width: hp('10%'),
            height: hp('10%'),
            borderRadius: hp('50%'),
            alignSelf: 'center',
            transform: [{ translateY: translate }],
          }}
        />
        <View>
          <Pera
            style={{
              textAlign: 'center',
              transform: [{ translateY: translate + hp('1%') }],
            }}
            color={Color('homeBg')}
            heading
            font="bold">
            {capitalize(context?.user?.name)}
          </Pera>
          <Small
            style={{
              textAlign: 'center',
              transform: [{ translateY: translate + hp('1%') }],
            }}
            color={Color('homeBg')}
            heading
            font="medium">
            {context?.user?.email}
          </Small>
          <Small
            style={{
              textAlign: 'center',
              transform: [{ translateY: translate + hp('1%') }],
            }}
            color={Color('homeBg')}
            heading
            font="medium">
            {context?.user?.user_info?.bio}   
          </Small>
          <Small
            style={{
              textAlign: 'center',
              transform: [{ translateY: translate + hp('1%') }],
            }}
            color={Color('homeBg')}
            heading
            font="medium">
            {context?.user?.user_info?.experience}
          </Small>
        </View>
      </>
    );
  };

  const updateImages = async (arr) => {
    try {
      Toast.show('Uploading...', Toast.SHORT);
      const formData = new FormData();
      arr.forEach((image) => {
        const uri = image.uri;
        const type = image.type; // Ensure you have the correct mime type
        const name = image.fileName; // Ensure you have the correct file name
        // Append image data to the formData
        formData.append('image_path[]', { uri, type, name });
      });

      const res = await api.post(
        '/user/service-images', formData,
        {headers: { Authorization: `Bearer ${context?.token}`, 'Content-Type': 'multipart/form-data' }},
      );
      await getUploadedImages();
      Toast.show(res?.data?.message, Toast.SHORT);
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };

  // if (context?.user?.user_type !== 'user') {
  //   return (
  //     <>
  //       <StatusBar
  //         translucent
  //         backgroundColor="transparent"
  //         barStyle="light-content"
  //       />
  //       <Background
  //         detectScrollEnd
  //         onScrollEnd={() => {
  //           if (!isLoading && hasMore) {
  //             getRestuarents(currentPage + 1);
  //           }
  //         }}
  //       >
  //         <View style={{ backgroundColor: Color('text') }}>
  //           <TopBar />
  //           <Wrapper>
  //             <Pera color={Color('homeBg')} heading font="bold">
  //               Tim Bookmarks
  //             </Pera>
  //             <Br space={1} />
  //             <Pera color={Color('homeBg')} heading font="light">
  //               {context?.user?.user_info?.bio}
  //             </Pera>
  //             {/* <Br space={2} />
  //             <Pera style={{fontStyle: 'italic'}} color={Color('homeBg')} heading font="bold">
  //               Upload service images
  //             </Pera> */}
  //             {/* <Br space={1} /> */}
  //             {/* <View style={{flexDirection: 'row', gap: hp('1.5%'), flexWrap: 'wrap'}}>
  //               <TouchableOpacity style={{
  //                 backgroundColor: Color('imageUpload'),
  //                 width: wp('26%'),
  //                 height: wp('26%'),
  //                 borderRadius: hp('2%'),
  //                 alignItems: 'flex-end',
  //                 justifyContent: 'flex-end',
  //                 padding: hp('1%'),
  //               }} onPress={uploadImage}>
  //                 <DocumentUpload
  //                   size={hp('3%')}
  //                   color={Color('text')}
  //                 />
  //               </TouchableOpacity>
  //               {images?.map((_, index) => {
  //                 if (_?.id) {
  //                   return (
  //                     <TouchableOpacity style={{position: 'relative'}} onPress={() => setShow(_)}>
  //                       <Image source={{ uri: `${storageUrl}${_.path}` }}
  //                         style={{ width: wp('26%'), height: wp('26%'), borderRadius: hp('2%') }}
  //                         resizeMode="stretch" />
  //                         <TouchableOpacity style={{position: 'absolute', bottom: hp('1%'), right: hp('1%'), padding: hp('0.5%'), backgroundColor: Color('modelDark'), borderRadius: hp('50%')}} onPress={() => removeUploadedImage(_?.id, index)}>
  //                           <Trash
  //                             size={hp('2.5%')}
  //                             color={Color('sidebarLastOption')}
  //                           />
  //                         </TouchableOpacity>
  //                     </TouchableOpacity>
  //                   );
  //                 }
  //                 return (
  //                   <TouchableOpacity onPress={() => removeImage(index)}>
  //                     <Image source={{ uri: `data:${images[index].type};base64,${images[index].base64}` }}
  //                       style={{ width: wp('26%'), height: wp('26%'), borderRadius: hp('2%') }}
  //                       resizeMode="stretch" />
  //                   </TouchableOpacity>
  //                 )
  //               })}
  //             </View> */}
  //             {/* <Br space={5} /> */}
  //             {/* {context?.restuarents?.length === 0 && (
  //               <Pera style={{ textAlign: 'center' }} color={Color('shadow')}>
  //                 No Restuarent Found
  //               </Pera>
  //             )}
  //             {
  //               isLoaded && (
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     flexWrap: 'wrap',
  //                     columnGap: wp('5%'),
  //                     rowGap: hp('2%'),
  //                   }}>
  //                   {context?.restuarents?.map((val, index) => {
  //                     return (
  //                       <Pressable
  //                         key={index}
  //                         style={styles.card}
  //                         onPress={() =>
  //                           navigation.navigate('RestuarantDetails', { id: val?.id })
  //                         }>
  //                         <Image
  //                           source={{ uri: `${storageUrl}${val?.image_path}` }}
  //                           style={styles.cardImg}
  //                         />
  //                         <Small color={Color('homeBg')} heading font="bold">
  //                           {val?.title}
  //                         </Small>
  //                         <Small
  //                           style={{ fontSize: hp('1.2%') }}
  //                           color={Color('homeBg')}
  //                           heading
  //                           font="light">
  //                           {val?.location}
  //                         </Small>
  //                         <TouchableOpacity
  //                           style={{
  //                             position: 'absolute',
  //                             top: hp('1%'),
  //                             right: hp('1%'),
  //                             backgroundColor: Color('homeBg'),
  //                             paddingVertical: hp('0.8%'),
  //                             paddingHorizontal: hp('0.8%'),
  //                             borderRadius: hp('1%'),
  //                           }}
  //                           onPress={() => bookmark(val?.id)}>
  //                           <Bookmark
  //                             size={hp('2%')}
  //                             color={Color('text')}
  //                             variant={val?.bookmarked ? 'Bold' : 'Outline'}
  //                           />
  //                         </TouchableOpacity>
  //                       </Pressable>
  //                     );
  //                   })}
  //                   <View style={{ marginVertical: '0', marginHorizontal: 'auto' }} >
  //                     {isLoading && <ActivityIndicator size={hp('5%')} color={Color('shadow')} />}
  //                   </View>
  //                 </View>
  //               )
  //             }
  //             <Br space={10} /> */}
  //           </Wrapper>
  //         </View>
  //       </Background>
  //       <Navigation navigation={navigation} />
  //       {/* {
  //         show && (
  //           <Model style={{padding: 0}} show={show}>
  //             <TouchableOpacity style={{position: 'absolute', zIndex: 1, right: hp('1%'), top: hp('1%'), padding: hp('0.5%'), backgroundColor: Color('modelDark'), borderRadius: hp('50%')}} onPress={() => setShow()}>
  //               <Add
  //                 size="32"
  //                 color={Color('text')}
  //                 style={{ transform: [{ rotate: '135deg' }], alignSelf: 'flex-end' }}
  //               />
  //             </TouchableOpacity>
  //             <Image source={{ uri: `${storageUrl}${show?.path}` }}
  //               style={{ width: wp('90%'), height: hp('50%') }}
  //               resizeMode="stretch" />
  //           </Model>
  //         )
  //       } */}
  //     </>
  //   );
  // }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Background
        detectScrollEnd
        onScrollEnd={() => {
          if (!isLoading && hasMore) {
            getRestuarents(currentPage + 1);
          }
        }}
        statusBarColor={Color('homeBg')}
        noBackground={true}
      >
        <View style={{ backgroundColor: Color('text') }}>
          <TopBar />
          <Wrapper>
            {/* <Pera color={Color('homeBg')} heading font="bold">
              Tim Recent Views
            </Pera> */}
            {/* <Br space={1} />
            {context?.restuarents?.length === 0 && (
              <Pera style={{ textAlign: 'center' }} color={Color('shadow')}>
                No Restuarent Found
              </Pera>
            )} */}
            {/* {
              isLoaded && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    columnGap: wp('5%'),
                    rowGap: hp('2%'),
                  }}>
                  {context?.restuarents?.map((val, index) => {
                    return (
                      <Pressable
                        key={index}
                        style={styles.card}
                        onPress={() =>
                          navigation.navigate('RestuarantDetails', { id: val?.id })
                        }>
                        <Image
                          source={{ uri: `${storageUrl}${val?.image_path}` }}
                          style={styles.cardImg}
                        />
                        <Small color={Color('homeBg')} heading font="bold">
                          {val?.title}
                        </Small>
                        <Small
                          style={{ fontSize: hp('1.2%') }}
                          color={Color('homeBg')}
                          heading
                          font="light">
                          {val?.location}
                        </Small>
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            top: hp('1%'),
                            right: hp('1%'),
                            backgroundColor: Color('homeBg'),
                            paddingVertical: hp('0.8%'),
                            paddingHorizontal: hp('0.8%'),
                            borderRadius: hp('1%'),
                          }}
                          onPress={() => bookmark(val?.id)}>
                          <Bookmark
                            size={hp('2%')}
                            color={Color('text')}
                            variant={val?.bookmarked ? 'Bold' : 'Outline'}
                          />
                        </TouchableOpacity>
                      </Pressable>
                    );
                  })}
                  <View style={{ marginVertical: '0', marginHorizontal: 'auto' }} >
                    {isLoading && <ActivityIndicator size={hp('5%')} color={Color('shadow')} />}
                  </View>
                </View>
              )
            } */}
            {/* <Br space={10} /> */}
          </Wrapper>
        </View>
      </Background>
      <Navigation navigation={navigation} />
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  topbar: {
    width: wp('100%'),
    borderBottomLeftRadius: hp('4%'),
    borderBottomRightRadius: hp('4%'),
    overflow: 'hidden',
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
