import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import React, {useContext, useState} from 'react';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Background from '../utils/Background';
import Btn from '../utils/Btn';
import Purchases from 'react-native-purchases';
import {api, baseUrl, note} from '../utils/api';
import {DataContext} from '../utils/Context';
import {useNavigation} from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import { getAvailablePurchases, requestSubscription } from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoaderOverlay from '../components/LoaderOverlay';

const packageDetails = [
  {
    id: 1,
    text: 'Your choice of trip planning options: fly-eat-back to home base for short hops, or point-to-point when traveling   longer distances or even cross country',
  },
  {
    id: 2,
    text: 'airport locations (city/state/region) and call letters',
  },
  {
    id: 3,
    text: 'restaurant names, addresses, phone numbers',
  },
  {
    id: 4,
    text: 'hours of operation and descriptions of décor, ambience, and other amenities',
  },
  {
    id: 5,
    text: 'links to restaurant websites and menus',
  },
];

const PackageDetail = ({route}) => {
  const [loading, setLoading] = useState(false);
  const {context, setContext} = useContext(DataContext);
  const navigation = useNavigation();


  console.log("context",context)
  // const [offering, setOffering] = useState(null);

  const data = route?.params?.detail;
  console.log('user expiry',context?.user?.expired_at);
  console.log('context',context?.subscribed_details)

   const isAndroid = Platform.OS === 'android'; 

  // console.log("data",data)

  // console.log("data", data.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice)
  const priceData = isAndroid && data.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice

  const TopBar = () => {
    return (
      <View style={styles.topbar}>
          {/* <View style={{width: wp('20%'), alignItems: 'center'}}> */}
        <TouchableOpacity
                      style={{
                        backgroundColor: Color('btnColor'),
                        width: hp('5%'),
                        height: hp('5%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: hp('50%'),
                      }}
                      onPress={() =>  navigation.goBack()}>
                      <ArrowLeft size={hp('2.5%')} color={Color('text')} />
                    </TouchableOpacity>
       <View style={{width: hp('35'),alignItems: 'center'}}>             
        <Text style={styles.packageStyle}>
          {data?.packageType === 'ANNUAL'
            ? 'Yearly Package'
            : 'Monthly Package'}
        </Text>
        <Text style={styles.priceText}>
          {data.packageType === 'ANNUAL'
            ? data?.product?.priceString + ' ' + '/' + ' ' + 'YEAR (SAVE 15%)'
            : data?.product?.priceString + ' ' + '/' + ' ' + 'MONTH'}
        </Text>
        </View>
        {/* </View>   */}
      </View>
    );
  };

  const AndroidTopBar = () => {
    return (
      <View style={styles.topbar}>
          {/* <View style={{width: wp('20%'), alignItems: 'center'}}> */}
        <TouchableOpacity
                      style={{
                        backgroundColor: Color('btnColor'),
                        width: hp('5%'),
                        height: hp('5%'),
                        marginLeft: hp(2.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: hp('50%'),
                      }}
                      onPress={() =>  navigation.goBack()}>
                      <ArrowLeft size={hp('2.5%')} color={Color('text')} />
                    </TouchableOpacity>
       <View style={{width: hp('35'),alignItems: 'center'}}>             
        <Text style={styles.packageStyle}>
          {data?.name}
        </Text>
        <Text style={styles.priceText}>
          {priceData
            ? priceData 
            : priceData }
        </Text>
        </View>
        {/* </View>   */}
      </View>
    );
  };
  console.log("cot..........,.,.,", context?.token)
  const onConfirmPurchase = async () => {

    if (!data) {
      Alert.alert('Error', 'No available package for this plan.');
      setLoading(false);
      return;
    }

    if(Platform.OS == 'android'){
      setLoading(true);
      try {
        setContext({
          ...context,
          skipNavigationCheck: true
        })
        const offerToken = data?.subscriptionOfferDetails[0].offerToken
        const purchaseData = await requestSubscription({
          sku: data?.productId,
          ...(offerToken && {
            subscriptionOffers: [{ sku: data?.productId, offerToken }],
          }),
        });
        // setLoading(true)
        const purchase = purchaseData?.[0];

        if (purchase.transactionDate && !purchase?.isAcknowledgedAndroid) {
          // return alert('hello')
          if (!context?.token) {
            navigation.navigate('Message', {
              theme: 'light',
              title: 'Login Required',
              message:
                'To access your subscription benefits, please create or log in to your account',
              screen: 'Login',
            });
          }else{
            if(context.token){
              
              console.log("going in navigatii func")
              await handlingNavigations()
              return
            }
          }
        
          const subType = data?.productId.includes('year') ? 'yearly' : 'monthly';
          const purchasedDate = new Date(purchase.transactionDate);
        
          setContext({
            ...context,
            subscribed_details: {
              purchased_date: purchasedDate,
              sub_type: subType,
            },
            skipNavigationCheck: false
          });
        }
      } catch (error) {
        console.log(error);
        setContext({
          ...context,
          skipNavigationCheck: false
        })
      } finally {
        setLoading(false)
      }
    }else{

      setLoading(true);
      try {
        const purchaseMade = await Purchases.purchasePackage(data);
        // setLoading(true);
  
        // const obj = {
        //   purchase_date: purchaseMade?.transaction?.purchaseDate,
        //   sub_type: data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly',
        // };
  
        // console.log('Purchase data:', obj);

        // return console.log('hello world',purchaseMade)
     
        if (purchaseMade?.transaction?.purchaseDate && !context?.token) {
          navigation.navigate('Message', {
            theme: 'light',
            title: 'Login Required',
            message:
              'To access your subscription benefits, please create or log in to your account',
            screen: 'Login',
          });
        }else{
          if(context.token){
            
            setLoading(false);
            console.log("going in navigatii func")
            await handlingNavigations()
            return
          }
        }

        //  alert('lilill') 
        setContext({
          ...context,
          subscribed_details: purchaseMade?.transaction?.purchaseDate && {
          purchased_date: purchaseMade?.transaction?.purchaseDate,
          sub_type: data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly',
        }})
      
      } catch (error) {
        console.log('Error:', error?.response?.data || error?.message);
  
        if (error?.response?.status === 401) {
          Alert.alert('Unauthorized', 'Please log in again.');
        } else {
          Alert.alert('Error', error?.message || 'Something went wrong');
        }
      } finally {
        setLoading(false)
      }
    }
    
  };

  const onRestorePurchase = async () => {
    if(Platform.OS == "android"){
    setLoading(true)
      try {
        // const purchases = await RNIap.getAvailablePurchases();
        const purchases = await getAvailablePurchases();
        console.log("purchases",purchases);// get current available purchases

        if(purchases.length > 0){

          navigation.navigate('Message', {
            theme: 'light',
            title: 'Login Required',
            message:
              'To access your subscription benefits, please create or log in to your account',
            screen: 'Login',
          });

        }else{
          note(
            'Please buy the subscription',
            'You have to buy the subscription first to continue',
          );
        }
   
      } catch (e) {
        console.error('Failed to restore purchases:', e);
        
      } finally {
        setLoading(false)
      }
      
      
    }else{
   setLoading(true)
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('restore', customerInfo.entitlements.active);
      if (
        Object.keys(customerInfo.entitlements.active).length > 0 &&
        !context?.token
      ) {
        // note('Purchases Restored!', 'Your subscription has been restored successfully');
        navigation.navigate('Message', {
          theme: 'light',
          title: 'Login Required',
          message:
            'To access your subscription benefits, please create or log in to your account',
          screen: 'Login',
        });
        // navigation.replace('Home');
      } else if (
        Object.keys(customerInfo.entitlements.active).length > 0 &&
        context?.token
      ) {
        note(
          'Purchases Restored!',
          'Your subscription has been restored successfully',
        );
      } else {
        note(
          'Please buy the subscription',
          'You have to buy the subscription first to continue',
        );
      }
    } catch (e) {
      console.error('Failed to restore purchases:', e);
    } finally {
      setLoading(false)
    }
      
  }
  };


  const handlingNavigations = async () => {
    // console.log("first", data)
    // return
    const androidsubtype = Platform.OS === 'android' &&  data?.subscriptionOfferDetails[0]?.basePlanId == "year" ? "yearly" : "monthly"
    const iosSubType = Platform.OS === 'ios' && data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly'
// return console.log('hello world',iosSubType)
    let datatoBeAppend = new FormData();
    datatoBeAppend.append('sub_type', Platform.OS == "android" ? androidsubtype : iosSubType);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/user/subscribe`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${context.token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: datatoBeAppend,
    };

    axios
      .request(config)
      .then(async (response) => {
        const updatedExpiry = response?.data?.user?.expired_at;
        if (updatedExpiry) {
          if (context?.token) {
              await AsyncStorage.setItem('token', context?.token);
              await AsyncStorage.setItem('isVerified', JSON.stringify(true));
              await AsyncStorage.setItem('user', JSON.stringify(response?.data?.user));

            setContext({
              ...context,
              token: context?.token,
              isVerified: true,
              user: response?.data?.user,
            });
            setLoading(false);
            navigation.navigate('Home');
          }else{
            setLoading(false);
          }

        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

   const nextScreen = (nav) => {
          Animated.timing(slideAnimation, {
              toValue: hp('100%'),
              duration: 1000,
              useNativeDriver: true,
          }).start(() => {
              nav();
          });
      };


  


 

  return (
    <View style={{flex: 1, backgroundColor: Color('text')}}>
      {
        Platform.OS == "android" ?
        <>
      <Background
        translucent={false}
        noScroll={true}
        statusBarColor={Color('homeBg')}
        noBackground>
        <AndroidTopBar />
        <View style={styles.container}>
          <Text style={styles.heading}>Package Details</Text>
          <View
            style={{
              flexDirection: 'column',
              gap: hp(2),
              paddingTop: hp(3),
            }}>
            {packageDetails.map(item => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  gap: wp(3),
                }}>
                <View style={styles.circleView} />
                <Text style={styles.detail}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </Background>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: hp(7),
        }}>
        <Btn
          loading={loading}
          label={'Purchase'}
          onPress={() => onConfirmPurchase()}
          btnStyle={{backgroundColor: Color('drawerBg'), width: '90%'}}
        />
        <Btn
          label={'Restore Purchase'}
          onPress={() => onRestorePurchase()}
          btnStyle={{
            backgroundColor: Color('drawerBg'),
            width: '90%',
            marginTop: hp(1),
          }}
        />
      </View>
        
        </>
        :
        <>
      <Background
        translucent={false}
        noScroll={true}
        statusBarColor={Color('homeBg')}
        noBackground>
        <TopBar />
        <View style={styles.container}>
          <Text style={styles.heading}>Package Details</Text>
          <View
            style={{
              flexDirection: 'column',
              gap: hp(2),
              paddingTop: hp(3),
            }}>
            {packageDetails.map(item => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  gap: wp(3),
                }}>
                <View style={styles.circleView} />
                <Text style={styles.detail}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </Background>

      
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: hp(7),
        }}>
        <Btn
          // loading={loading}
          label={'Purchase'}
          onPress={() => onConfirmPurchase()}
          btnStyle={{backgroundColor: Color('drawerBg'), width: '90%'}}
        />
        <Btn
          label={'Restore Purchase'}
          onPress={() => onRestorePurchase()}
          btnStyle={{
            backgroundColor: Color('drawerBg'),
            width: '90%',
            marginTop: hp(1),
          }}
        />
       <LoaderOverlay visible={loading} />
      </View>
        </>
      }
    </View>
  );
};

export default PackageDetail;

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: Color('homeBg'),
    paddingVertical: hp('2.5%'),
    // width: hp('100%'),
    // alignItems: 'center',
    flexDirection: 'row',
    borderBottomLeftRadius: hp('4%'),
    borderBottomRightRadius: hp('4%'),
  },
  packageStyle: {
    color: Color('text'),
    fontWeight: 'bold',
    fontSize: hp(2.8),
  },
  priceText: {
    color: Color('text'),
    fontWeight: 'bold',
    fontSize: hp(2.5),
    marginTop: hp(1),
  },
  container: {
    padding: hp(2.5),
    paddingTop: hp(3),
  },
  heading: {
    color: Color('drawerBg'),
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  circleView: {
    height: hp(1.5),
    width: hp(1.5),
    marginTop: hp(0.25),
    borderWidth: 1,
    borderColor: Color('drawerBg'),
    borderRadius: 100,
  },
  detail: {
    color: 'black',
    width: wp(80),
    fontSize: hp(1.6),
  },
});
