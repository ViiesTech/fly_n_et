import {Alert, StyleSheet, Text, View} from 'react-native';
import React, { useContext, useState } from 'react';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Background from '../utils/Background';
import Btn from '../utils/Btn';
import Purchases from 'react-native-purchases';
import { api, note } from '../utils/api';
import { DataContext } from '../utils/Context';
import { useNavigation } from '@react-navigation/native';

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
  const [loading,setLoading] = useState(false);
   const { context,setContext } = useContext(DataContext);
   const navigation = useNavigation();
  // const [offering, setOffering] = useState(null);

  const data = route?.params?.detail;
  console.log(context?.user);


  const TopBar = () => {
    return (
      <View style={styles.topbar}>
        <Text style={styles.packageStyle}>
          {data?.packageType === 'ANNUAL' ? 'Yearly Package' : 'Monthly Package'}
        </Text>
        <Text style={styles.priceText}>{data.packageType === 'ANNUAL' ? data?.product?.priceString + ' ' + '/' + ' ' +  'YEAR (SAVE 15%)' : data?.product?.priceString + ' ' + '/' + ' ' + 'MONTH'}</Text>
      </View>
    );
  };

  const onConfirmPurchase = async () => {
    
    if (!data) {
      Alert.alert('Error', 'No available package for this plan.');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(false);
      const purchaseMade = await Purchases.purchasePackage(data); 
      setLoading(true);

      const obj = {
        purchase_date: purchaseMade?.transaction?.purchaseDate,
        sub_type: data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly',
      };
  
      console.log('Purchase data:', obj);
  
      // Get token (assuming it's stored in AsyncStorage)
  
      const response = await api.post('user/subscribe', obj, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
        },
      });
    
      if (response?.data?.status === 'success' && response?.data?.user?.expired_at) {
        setContext({
          ...context,
          user: {
            ...context.user, 
            expired_at: response.data.user.expired_at, 
          },
        });
      }
      navigation.navigate('Home')
      console.log('Response of subscription:', response.data);
      
    } catch (error) {
      console.log('Error:', error?.response?.data || error?.message);
  
      if (error?.response?.status === 401) {
        Alert.alert('Unauthorized', 'Please log in again.');
      } else {
        Alert.alert('Error', error?.message || 'Something went wrong');
      }
    }
    setLoading(false);
  };

  const onRestorePurchase = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('restore', customerInfo.entitlements.active);
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        note('Purchases Restored!', 'Your subscription has been restored successfully'); 
        navigation.replace('Home');
      } else {
        note('Please buy the subscription', 'You have to buy the subscription first to continue'); 
      }
    } catch (e) {
      console.error('Failed to restore purchases:', e);
    }
  }
  

  return (
   <View style={{flex: 1,backgroundColor: Color('text')}}> 
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
     <View style={{flex: 1,justifyContent: 'flex-end',alignItems: 'center',marginBottom: hp(7)}}>
     <Btn loading={loading} label={'Buy Purchase'} onPress={() => onConfirmPurchase()} btnStyle={{backgroundColor: Color('drawerBg'),width: '90%'}} />
     <Btn label={'Restore Purchases'} onPress={() => onRestorePurchase()} btnStyle={{backgroundColor: Color('drawerBg'),width: '90%',marginTop: hp(1)}} />

   </View>
   </View>
  );
};

export default PackageDetail;

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: Color('homeBg'),
    paddingVertical: hp('2.5%'),
    // width: hp('100%'),
    alignItems: 'center',
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
    fontSize: hp(1.6),
  },
});
