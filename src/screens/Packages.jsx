import {
  Platform,
  SafeAreaView,
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
import {useNavigation} from '@react-navigation/native';
import PackageCard from '../components/PackageCard';
import Purchases from 'react-native-purchases';
import {DataContext} from '../utils/Context';

import {
  endConnection,
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  Subscription,
} from 'react-native-iap';
import AndroidPackageCard from '../components/AndroidPackageCard';
import {baseUrl} from '../utils/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {context, setContext} = useContext(DataContext);

  const isAndroid = Platform.OS === 'android'; // check platform is android or not

  const [connection, setConnection] = useState(false); // set in-app purchase is connected or not
  const [subscription, setSubscription] = useState([]);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [PremiumCode, setPremiumCode] = useState("");

  // const routes = navigation.getState().routes;
  // const previousScreen = routes.length > 1 ? routes[routes.length - 2].name === 'SideMenu' : false;

  console.log(products);

  const productIds = ['flyneat_month', 'flyneat_year2'];
  const androidsubscriptionsId = ['flyneat_month', 'flyneat_year2'];

  useEffect(() => {
    if (!isAndroid) {
      const setupRevenueCat = async () => {
        try {
          const offerings = await Purchases.getOfferings();
          if (offerings.current) {
            setOfferings(offerings.current.availablePackages);
          }
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

  // To get Subscription information
  const getSubscriptionInfo = async () => {
    try {
      const subscriptions = await getSubscriptions({
        skus: androidsubscriptionsId,
      });
      console.log('sussssb', subscriptions);

      setSubscription(subscriptions); // set subscription information
    } catch (error) {
      console.error('Error fetching products: ', error);
    }
  };

  const SumbitPremiumCode = () => {
    let data = new FormData();
    data.append('code', 'X6RgzCXb');

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
          console.log(JSON.stringify(response.data));
          subscibeForMonth();
        } else {
          console.log('code is wrong');
        }
      })
      .catch(error => {
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
              navigation.navigate('Home');
            }else{
              
            }
  
          }
        })
        .catch(error => {
          console.log(error);
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
      return
    }
  }

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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* {previousScreen ?   */}
            <View style={{width: wp('20%'), alignItems: 'center'}}>
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
                  if (!context?.user?.user_info && context?.token) {
                    navigation.navigate('UserType');
                  } else {
                    navigation.navigate('Home');
                  }
                }}>
                <ArrowLeft size={hp('2.5%')} color={Color('text')} />
              </TouchableOpacity>
            </View>
            {/* : null */}
            {/* } */}
            <View style={{justifyContent: 'center', flex: 0.8}}>
              <Text style={styles.heading}>Our Packages</Text>
            </View>
          </View>
          <Text style={styles.desc}>
            Choose the best plan that fits your needs. Enjoy premium features
            and seamless access with our subscription packages.
          </Text>

          <TouchableOpacity
            onPress={() => {context?.token ? setShowPremiumModal(true): goToLogin()}}
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
            <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
              Premium User
            </Text>
          </TouchableOpacity>

          <View style={{marginTop: 20}}>
            {subscription.length > 0 ? (
              <>
                {subscription.map(item => {
                  // console.log("item", item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice)
                  const priceString =
                    item.subscriptionOfferDetails[0].pricingPhases
                      .pricingPhaseList[0].formattedPrice;

                  return (
                    <AndroidPackageCard
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
                {offerings?.reverse().map(item => (
                  <PackageCard
                    onPress={() =>
                      navigation.navigate('PackageDetail', {detail: item})
                    }
                    style={{marginBottom: hp(2)}}
                    package_name={
                      item.packageType === 'ANNUAL' ? 'Yearly' : 'Monthly'
                    }
                    price={item.product.priceString}
                  />
                ))}
              </>
            )}
          </View>
        </View>
        {showPremiumModal && (
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              backgroundColor: 'white',
              height: hp('100%'),
              width: wp('100%'),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <Text style={[styles.heading, {fontSize: hp(3)}]}>
              Enter Premium Code
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
              }}
              onChangeText={(txt)=> {
                setPremiumCode(txt)
              }}
              value={PremiumCode}
            />

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
                style={{color: '#FFFFFF', fontSize: 20, fontWeight: 'bold'}}>
                Submit
              </Text>
            </TouchableOpacity>

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
                style={{color: '#FFFFFF', fontSize: 20, fontWeight: 'bold'}}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Background>
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
});
