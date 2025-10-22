import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Background from '../utils/Background';
import {Color} from '../utils/Colors';
import {ArrowLeft} from 'iconsax-react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import PackageCard from '../components/PackageCard';
import Purchases from 'react-native-purchases';
import {DataContext} from '../utils/Context';

import {
  endConnection,
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  presentCodeRedemptionSheetIOS,
  getAvailablePurchases,
} from 'react-native-iap';
import AndroidPackageCard from '../components/AndroidPackageCard';
import {api, baseUrl, note} from '../utils/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';
import {Dimensions} from 'react-native';
import {responsiveHeight, trackOfferRedemption} from '../utils/global';
import moment from 'moment';
import Btn from '../utils/Btn';
import LoaderOverlay from '../components/LoaderOverlay';

// const packages = [
//   {
//     id: 1,
//     package: 'Monthly',
//     type: 'Standard',
//     price: '4.99'
//   },
//   {
//     id: 2,
//     package: 'Yearly',
//     type: 'Professional',
//     price: '49.99'
//   }
// ]

const Packages = () => {
  const [offerings, setOfferings] = useState(null);
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const {context, setContext} = useContext(DataContext);
  const [restoreLoader, setRestoreLoader] = useState(false);

  const isAndroid = Platform.OS === 'android'; // check platform is android or not

  const [connection, setConnection] = useState(false); // set in-app purchase is connected or not
  const [subscription, setSubscription] = useState([]);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [PremiumCode, setPremiumCode] = useState('');
  const [codeLoader, setCodeLoader] = useState(false);

  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);
  const [activeSubscription, setActiveSubscription] = useState({});
  // const [currentPurchase, setCurrentPurchase] = useState(null);
  const isFocused = useIsFocused();
  const [packageLoading, setPackageLoading] = useState(false);
  // const [activeSubscription,setActiveSubscription] = useState(null)

  // console.log('active sub type', context?.user?.sub_type);
  // console.log('current purchase',currentPurchase)

  useEffect(() => {
    const updateDimensions = () => {
      const {width, height} = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
    };

    // Listen for orientation changes
    Orientation.addOrientationListener(updateDimensions);

    // Listen for dimension changes (e.g. on rotation)
    const dimensionSubscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );

    // Cleanup both listeners
    return () => {
      Orientation.removeOrientationListener(updateDimensions);
      dimensionSubscription?.remove(); // modern API
    };
  }, []);

  // const routes = navigation.getState().routes;
  // const previousScreen = routes.length > 1 ? routes[routes.length - 2].name === 'SideMenu' : false;

  // console.log('offerings', moment(context?.user.expired_at).format('DD-MM-YYYY'))

  // const productIds = ['flyneat_month', 'flyneat_year2'];
  const androidsubscriptionsId = ['flyneat_month', 'flyneat_year2'];

  // useEffect(() => {
  //   strictToPurchaseMonthlyYearlyExist();
  // }, []);

  useEffect(() => {
    if (isFocused) {
      checkActiveSubscription();
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if (context?.user?.expired_at) {
  //     const isActive = moment().isBefore(moment(context.user.expired_at));
  //     if (isActive) {
  //       // alert('active')
  //       setActiveSubscription(context.user.sub_type);
  //     } else {
  //       setActiveSubscription(null);
  //     }
  //   }
  // }, [context?.user?.expired_at]);

  const checkActiveSubscription = async () => {
    try {
      setPackageLoading(true)
      const response = await api.post('user/check-subscribe', '', {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
      console.log('api check ===>', response?.data);
      if (response?.data?.expiry_date) {
        const isActive = moment().isBefore(moment(response?.data?.expiry_date));
        if (isActive) {
          setActiveSubscription(response?.data);
          // setCurrentPurchase(response?.data?.sub_type)
        } else {
          setActiveSubscription({});
        }
      }
    } catch (error) {
      console.log('some problem occured', error);
    } finally {
      setPackageLoading(false)
    }
  };

  useEffect(() => {
    if (!isAndroid) {
      const setupRevenueCat = async () => {
        // setPackageLoading(true);
        try {
          const offerings = await Purchases.getOfferings();
          console.log(offerings.current.availablePackages);
          if (offerings.current) {
            setOfferings(offerings.current.availablePackages.reverse());
          }
          // setPackageLoading(false);
          // if (context?.token) {
          //   const customerInfo = await Purchases.getCustomerInfo();

          //   // Check if user has any active entitlement
          //   if (customerInfo.entitlements.active) {
          //     const activeEntitlement = Object.values(
          //       customerInfo.entitlements.active,
          //     )[0]; // first active entitlement
          //     setActiveSubscription(activeEntitlement.productIdentifier);
          //   }
          // }
        } catch (error) {
          console.log('Error setting up RevenueCat:', error);
        } 
      };

      setupRevenueCat();
    }
  }, []);

  useEffect(() => {
    const setup = async () => {
      const result = await initConnection();
      console.log('IAP connected?', result);
      setConnection(result);

      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }
    };

    setup();

    return () => {
      endConnection();
    };
  }, []);

  useEffect(() => {
    if (isAndroid) {
      if (connection) {
        getSubscriptionInfo();
      }
    }
  }, [connection]);

  // useEffect(() => {
  //   const fetchActive = async () => {
  //     const purchases = await getAvailablePurchases();
  //     const active = purchases.find(p =>
  //       ['flyneat_month', 'flyneat_year2'].includes(p.productId),
  //     );
  //     console.log('active', active.productId);
  //     if (active) {
  //       setActiveSubscription(active.productId);
  //     }
  //   };
  //   if (Platform.OS === 'android') {
  //     if (context?.token) {
  //       // fetchActive();
  //     }
  //   }
  // }, []);

  // const strictToPurchaseMonthlyYearlyExist = async () => {
  //   if (Platform.OS === 'ios') {
  //     const customerInfo = await Purchases.getCustomerInfo();
  //     // console.log('customerInfo ===>', customerInfo);

  //     const activeEntitlements = customerInfo.entitlements.active;
  //     const activeKeys = Object.keys(activeEntitlements);

  //     if (activeKeys.length > 0) {
  //       const activeEntitlement = activeEntitlements[activeKeys[0]];
  //       const productId = activeEntitlement.productIdentifier;

  //       const subType = productId === 'flyneat_year2' ? 'yearly' : 'monthly';
  //       console.log('current purchase', subType);
  //       setCurrentPurchase(subType);
  //     } else {
  //       console.log('No active subscription found');
  //     }
  //   } else {
  //     const purchases = await getAvailablePurchases();
  //     const subType =
  //       purchases[0].productId === 'flyneat_year2' ? 'yearly' : 'monthly';
  //     setCurrentPurchase(subType);
  //   }
  // };

  // To get Subscription information
  const getSubscriptionInfo = async () => {
    // setPackageLoading(true);
    try {
      const subscriptions = await getSubscriptions({
        skus: androidsubscriptionsId,
      });
      console.log('sussssb', subscriptions);

      setSubscription(subscriptions);
    } catch (error) {
      console.error('Error fetching products: ', error);
    } 
  };

  const SumbitPremiumCode = () => {
    if (PremiumCode == '') {
      return note(
        'Enter Code',
        'Please enter the code to verify your access to the app.',
      );
    }
    setCodeLoader(true);
    let data = new FormData();
    data.append('code', PremiumCode);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/user/post-voucher`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${context.token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        if (response.status) {
          note('Code', response.data.message);
          console.log(JSON.stringify(response.data));
          setContext(prevContext => ({
            ...prevContext,
            user: {
              ...prevContext?.user,
              freetrial_status: response.data?.user.freetrial_status,
            },
          }));
          subscibeForMonth();
        } else {
          console.log('code is wrong');
          setCodeLoader(false);
          note('Wrong Code', 'Please enter correct code.');
        }
      })
      .catch(error => {
        setCodeLoader(false);
        note('Wrong Code', 'Please enter correct code.');
        console.log(error);
      });
  };

  const subscibeForMonth = () => {
    let data = new FormData();
    data.append('sub_type', 'monthly');

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/user/subscribe`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${context.token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(async response => {
        setCodeLoader(false);
        const updatedExpiry = response?.data?.user?.expired_at;
        if (updatedExpiry) {
          if (context?.token) {
            // await AsyncStorage.setItem('token', context?.token);
            // await AsyncStorage.setItem('isVerified', JSON.stringify(true));
            // await AsyncStorage.setItem(
            //   'user',
            //   JSON.stringify(response?.data?.user),
            // );
            setCodeLoader(false);
            setContext(prev => ({
              ...prev,
              user: {
                ...prev.user,
                expired_at: updatedExpiry,
                sub_type: response?.data?.user?.sub_type,
              },
            }));
            // setContext({
            //   ...context,
            //   token: context?.token,
            //   isVerified: true,
            //   user: response?.data?.user,
            // });
            navigation.navigate('Home');
          } else {
            setCodeLoader(false);
          }
          setCodeLoader(false);
        }
      })
      .catch(error => {
        console.log(error);
        setCodeLoader(false);
      });
  };

  const goToLogin = () => {
    if (!context?.token) {
      navigation.navigate('Message', {
        theme: 'light',
        title: 'Login Required',
        message:
          'To access your subscription benefits, please create or log in to your account',
        screen: 'Login',
      });
      return;
    }
  };

  const onOpenSheet = async () => {
    try {
      setLoading(true);
      const prevCustomerInfo = await Purchases.getCustomerInfo();
      const prevEntitlement = prevCustomerInfo.entitlements.active['Premium'];
      // console.log('previous info', prevCustomerInfo?.identifier);
      let isHandled = false;

      const customerInfoListener = async customerInfo => {
        const newEntitlement = customerInfo.entitlements.active['Premium'];
        q;
        if (
          newEntitlement &&
          newEntitlement.productIdentifier !==
            prevEntitlement?.productIdentifier
        ) {
          const subType =
            newEntitlement.productIdentifier === 'flyneat_year2'
              ? 'yearly'
              : 'monthly';
          console.log('Entitlement changed via offer code!');
          isHandled = true;
          Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
          await handlingNavigations(subType);
        }
      };

      Purchases.addCustomerInfoUpdateListener(customerInfoListener);
      await presentCodeRedemptionSheetIOS();

      setTimeout(async () => {
        if (!isHandled) {
          // setLoading(true)
          const latestInfo = await Purchases.getCustomerInfo();
          const latestEntitlement = latestInfo.entitlements.active['Premium'];
          // console.log('latest info', latestEntitlement.);
          const subType =
            latestEntitlement?.productIdentifier === 'flyneat_year2'
              ? 'yearly'
              : 'monthly';
          // const transactionId = latestInfo.
          if (latestEntitlement?.periodType === 'TRIAL') {
            console.log('Entitlement changed after delay fallback');
            await handlingNavigations(subType);
          } else {
            console.log(
              'No entitlement change — likely canceled or invalid code',
            );
            setLoading(false);
          }
          // setLoading(false)

          Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
        }
      }, 2000);
    } catch (error) {
      console.log('Error in redemption flow:', error);
      setLoading(false);
    }
  };

  const handlingNavigations = async subType => {
    // console.log("first", data)
    // return
    if (!context?.token) {
      setLoading(true);
      await AsyncStorage.setItem('isPremium', 'true');
      setLoading(false);
      navigation.navigate('Message', {
        theme: 'light',
        title: 'Login Required',
        message:
          'To access your subscription benefits, please create or log in to your account',
        screen: 'Login',
      });
    } else {
      setLoading(true);
      await AsyncStorage.removeItem('isPremium');
      const iosSubType = subType;
      // return console.log('hello world',iosSubType)
      let datatoBeAppend = new FormData();
      datatoBeAppend.append('sub_type', iosSubType);

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
        .then(async response => {
          const updatedExpiry = response?.data?.user?.expired_at;
          if (updatedExpiry) {
            if (context?.token) {
              await AsyncStorage.setItem('token', context?.token);
              await AsyncStorage.setItem('isVerified', JSON.stringify(true));
              await AsyncStorage.setItem(
                'user',
                JSON.stringify(response?.data?.user),
              );

              // setContext({
              //   ...context,
              //   token: context?.token,
              //   isVerified: true,
              //   user: response?.data?.user,
              // });
              setContext(prev => ({
                ...prev,
                user: {
                  ...prev.user,
                  expired_at: updatedExpiry,
                  sub_type: response?.data?.user?.sub_type,
                },
              }));
              setLoading(false);
              navigation.navigate('Home');
            } else {
              setLoading(false);
            }
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const onRestorePurchase = async () => {
    if (Platform.OS == 'android') {
      setRestoreLoader(true);
      try {
        const purchases = await getAvailablePurchases();
        console.log('purchases', purchases);
        const subType =
          purchases[0].productId === 'flyneat_year2' ? 'yearly' : 'monthly';
        // console.log(subType)
        // if (purchases.length > 0 && !context.token) {
        //   navigation.navigate('Message', {
        //     theme: 'light',
        //     title: 'Login Required',
        //     message:
        //       'To access your subscription benefits, please create or log in to your account',
        //     screen: 'Login',
        //   });
        //   setContext(prev => ({
        //     ...prev,
        //     sub_type: subType,
        //   }));
        // }
        if (purchases.length > 0 && context?.token) {
          let datatoBeAppend = new FormData();
          datatoBeAppend.append('sub_type', subType);
          datatoBeAppend.append('transaction_id', purchases[0].transactionId);
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
            .then(async response => {
              const updatedExpiry = response?.data?.user?.expired_at;
              // alert(response)
              console.log('response ===>', response?.data);
              if (updatedExpiry) {
                setContext(prev => ({
                  ...prev,
                  user: {
                    ...prev.user,
                    expired_at: updatedExpiry,
                    sub_type: response?.data?.user?.sub_type,
                  },
                }));
                setRestoreLoader(false);
                navigation.navigate('Home');
                note(
                  'Purchases Restored!',
                  'Your subscription has been restored successfully',
                );
              }
            })
            .catch(error => {
              console.log(error);
              setRestoreLoader(false);
            });
        } else {
          note(
            'Please buy the subscription',
            'You have to buy the subscription first to continue',
          );
        }
      } catch (e) {
        console.error('Failed to restore purchases:', e);
      } finally {
        setRestoreLoader(false);
      }
    } else {
      setRestoreLoader(true);
      try {
        const customerInfo = await Purchases.restorePurchases();
        console.log('restore', customerInfo);
        const activeProduct = customerInfo.activeSubscriptions[0];
        // if (
        //   Object.keys(customerInfo.entitlements.active).length > 0 &&
        //   !context?.token
        // ) {
        //   navigation.navigate('Message', {
        //     theme: 'light',
        //     title: 'Login Required',
        //     message:
        //       'To access your subscription benefits, please rcreate or log in to your account',
        //     screen: 'Login',
        //   });
        //   setContext(prev => ({
        //     ...prev,
        //     sub_type: subType,
        //   }));
        // }
        if (
          Object.keys(customerInfo.entitlements.active).length > 0 &&
          context?.token &&
          activeProduct.length > 0
        ) {
          const subscriptionData =
            customerInfo.subscriptionsByProductIdentifier[activeProduct];

          const transactionId = subscriptionData?.storeTransactionId;
          const subType =
            customerInfo?.entitlements?.active?.Premium?.productIdentifier ===
            'flyneat_year2'
              ? 'yearly'
              : 'monthly';
          // return console.log('first',customerInfo)
          let datatoBeAppend = new FormData();
          datatoBeAppend.append('sub_type', subType);
          datatoBeAppend.append('transaction_id', transactionId);
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
            .then(async response => {
              const updatedExpiry = response?.data?.user?.expired_at;
              // alert(response)
              console.log('response ===>', response?.data);
              if (updatedExpiry) {
                setContext(prev => ({
                  ...prev,
                  user: {
                    ...prev.user,
                    expired_at: updatedExpiry,
                    sub_type: response?.data?.user?.sub_type,
                  },
                }));
                setRestoreLoader(false);
                navigation.navigate('Home');
                note(
                  'Purchases Restored!',
                  'Your subscription has been restored successfully',
                );
              }
            })
            .catch(error => {
              console.log(error);
              setRestoreLoader(false);
            });
        } else {
          note(
            'Please buy the subscription',
            'You have to buy the subscription first to continue',
          );
        }
      } catch (e) {
        console.error('Failed to restore purchases:', e);
      } finally {
        setRestoreLoader(false);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background
        noScroll={true}
        translucent={true}
        statusBarColor={Color('text')}
        noBackground>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            <View style={{width: wp('20%'), alignItems: 'flex-start'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Color('btnColor'),
                  width: hp('5%'),
                  height: hp('5%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: hp('50%'),
                }}
                onPress={() => {
                  navigation.goBack();
                  // if (!context?.user?.user_info && context?.token) {
                  //   navigation.navigate('UserType');
                  // } else {
                  //   navigation.navigate('Home');
                  // }
                }}>
                <ArrowLeft size={hp('2.5%')} color={Color('text')} />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.heading}>Subscription</Text>
            </View>

            <View style={{width: wp('20%')}} />
          </View>
          {packageLoading ?
                 <ActivityIndicator color={Color('drawerBg')} size={'large'} style={{alignSelf: 'center'}} />
            : 
          Object.keys(activeSubscription).length > 0 &&  (
            <View style={{paddingTop: responsiveHeight(4)}}>
              {Platform.OS === 'ios' ? (
                <>
                  <PackageCard
                    isActive={true}
                    date={activeSubscription?.expiry_date}
                    disabled={activeSubscription?.sub_type === 'yearly' && true}
                    style={{marginBottom: hp(2),paddingVertical: responsiveHeight(2)}}
                    package_name={
                      activeSubscription?.sub_type === 'yearly'
                        ? 'Yearly'
                        : 'Monthly'
                    }
                    price={
                      activeSubscription?.sub_type === 'yearly'
                        ? '$49.99'
                        : '$4.99'
                    }
                  />
                </>
              ) : (
                <>
                  <AndroidPackageCard
                    isActive={true}
                    expiryDate={activeSubscription?.expiry_date}
                    style={{marginBottom: hp(2)}}
                    package_name={
                      activeSubscription.sub_type === 'yearly'
                        ? 'yearly'
                        : 'monthly'
                    }
                    price={
                      activeSubscription.sub_type === 'yearly'
                        ? '$49.99'
                        : '$4.99'
                    }
                  />
                </>
              )}
            </View>
          )}
          <Text style={styles.desc}>
            {/* Choose the best plan that fits your needs. Enjoy premium features
            and seamless access with our subscription packages. */}
            Choose the plan that best fits your needs. Enjoy premium features
            such as unlimited restaurant searches near any airport, customizable
            search radius, and access to filter and connect with CFI/CFII pilots
            — all through our seamless subscription packages.
          </Text>

          {context?.token && Platform.OS === 'android' && (
            <TouchableOpacity
              // disabled={context?.user?.freetrial_status}
              onPress={() => {
                context?.token ? setShowPremiumModal(true) : goToLogin();
              }}
              style={{
                // height: hp(7),
                padding: hp(2.5),
                backgroundColor: Color('drawerBg'),
                width: wp(90),
                alignSelf: 'center',
                borderRadius: 10,
                alignItems: 'center',
                gap: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // justifyContent: 'center',
                marginTop: hp(5),
              }}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <View style={styles.circleView} />
                <Text
                  style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
                  Premium User
                </Text>
              </View>
              {context?.user?.freetrial_status && (
                <Text
                  style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
                  {context?.user?.freetrial_status}
                </Text>
              )}
            </TouchableOpacity>
          )}
          <View style={{marginTop: 25}}>
           {Platform.OS === 'android' ? (
              <>
                {/* subscription.length > 0 ? ( */}
                {subscription.map(item => {
                  console.log('item ====>', item.productId);
                  // console.log("item", item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice)
                  const priceString =
                    item.subscriptionOfferDetails[0].pricingPhases
                      .pricingPhaseList[0].formattedPrice;
                  return (
                    <AndroidPackageCard
                      // isActive={activeSubscription === item.productId}
                      disabled={
                        activeSubscription?.sub_type === 'yearly' && true
                      }
                      // isActive={
                      //   (activeSubscription === 'monthly' &&
                      //     item.productId === 'flyneat_month') ||
                      //   (activeSubscription === 'yearly' &&
                      //     item.productId === 'flyneat_year2')
                      // }
                      //  isActive={item.productId.includes(activeSubscription)}
                      // isActive={activeSubscription === context?.user?.sub_type}
                      // expiryDate={moment(context?.user?.expired_at).format(
                      //   'DD-MM-YYYY',
                      // )}
                      onPress={() =>
                        navigation.navigate('PackageDetail', {detail: item})
                      }
                      style={{marginBottom: hp(2)}}
                      package_name={item.name}
                      price={priceString}
                    />
                  );
                })}
              </>
            ) : (
              <>
                {offerings?.map(item => {
                  console.log('offerings', item.product.identifier);
                  return (
                    <PackageCard
                      // isActive={item.product.identifier === activeSubscription}
                      // isActive={
                      //   (activeSubscription === 'monthly' &&
                      //     item.product.identifier === 'flyneat_month') ||
                      //   (activeSubscription === 'yearly' &&
                      //     item.product.identifier === 'flyneat_year2')
                      // }
                      // date={moment(context?.user?.expired_at).format(
                      //   'DD-MM-YYYY',
                      // )}
                      // disabled={
                      //   activeSubscription?.sub_type === 'yearly' && true
                      // }
                      onPress={() => {
                        navigation.navigate('PackageDetail', {detail: item});
                      }}
                      style={{marginBottom: hp(2)}}
                      package_name={
                        item.packageType === 'ANNUAL' ? 'Yearly' : 'Monthly'
                      }
                      price={item.product.priceString}
                    />
                  );
                })}
              </>
            )}
            {context?.token && (
              <Btn
                label={'Restore Purchase'}
                onPress={() => onRestorePurchase()}
                btnStyle={{
                  backgroundColor: Color('drawerBg'),
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: hp(1),
                }}
              />
            )}
          </View>
          {Platform.OS === 'ios' ? (
            loading ? (
              <ActivityIndicator
                color={'blue'}
                size={'large'}
                style={{alignSelf: 'center', marginTop: 20}}
              />
            ) : (
              <TouchableOpacity style={{marginTop: 20}} onPress={onOpenSheet}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'blue',
                    fontWeight: 'bold',
                    fontSize: hp(2),
                  }}>
                  Redeem Code
                </Text>
              </TouchableOpacity>
            )
          ) : null}
        </View>
        {showPremiumModal && (
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              backgroundColor: 'white',
              height: height,
              width: width,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <KeyboardAvoidingView behavior="padding">
              <ScrollView
                style={{flexGrow: 1}}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Text style={[styles.heading, {fontSize: hp(3)}]}>
                  Enter Premium Code
                </Text>
                <Text style={[styles.desc, {paddingTop: hp(2)}]}>
                  Get 1 month of full access completely free—no credit card
                  needed, no hidden fees. Enjoy all premium features for 30
                  days, totally risk-free!
                </Text>
                <TextInput
                  placeholder="Enter the premium code"
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    width: wp('80%'),
                    borderRadius: 100,
                    paddingHorizontal: 10,
                    marginTop: hp(4),
                    minHeight: hp(5),
                  }}
                  onChangeText={txt => {
                    setPremiumCode(txt);
                  }}
                  value={PremiumCode}
                />

                {codeLoader == true ? (
                  <View
                    style={{
                      height: hp(7),
                      backgroundColor: Color('drawerBg'),
                      width: wp(85),
                      alignSelf: 'center',
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: hp(5),
                    }}>
                    <ActivityIndicator
                      size={'small'}
                      style={{alignSelf: 'center'}}
                      color={'#FFFFFF'}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => SumbitPremiumCode()}
                    style={{
                      height: hp(7),
                      backgroundColor: Color('drawerBg'),
                      width: wp(85),
                      alignSelf: 'center',
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: hp(5),
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => setShowPremiumModal(false)}
                  style={{
                    height: hp(7),
                    backgroundColor: Color('drawerBg'),
                    width: wp(85),
                    alignSelf: 'center',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )}
      </Background>
      <LoaderOverlay visible={restoreLoader} />
      {/* {packageLoading && <LoaderOverlay visible={packageLoading} />} */}
    </SafeAreaView>
  );
};

export default Packages;

const styles = StyleSheet.create({
  container: {
    padding: hp(1),
    paddingTop: Platform.OS == 'android' ? 60 : 0,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  desc: {
    color: 'black',
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: hp(4),
    width: wp(80),
  },
  circleView: {
    height: hp(1.5),
    width: hp(1.5),
    marginTop: hp(0.3),
    borderWidth: 2,
    borderColor: Color('text'),
    borderRadius: 100,
  },
});
