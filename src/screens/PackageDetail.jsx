import {Alert, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Background from '../utils/Background';
import Btn from '../utils/Btn';
import Purchases from 'react-native-purchases';

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
  // const [offering, setOffering] = useState(null);

  const data = route?.params?.detail;
  console.log(data?.identifier);


  const TopBar = () => {
    return (
      <View style={styles.topbar}>
        <Text style={styles.packageStyle}>
          {data?.packageType === 'ANNUAL' ? 'Yearly Package' : 'Monthly Package'}
        </Text>
        <Text style={styles.priceText}>${data?.product?.price}</Text>
      </View>
    );
  };

  const onConfirmPurchase = async () => {
      if (!data) {
        Alert.alert('Error', 'No available package for this plan.');
        return;
      }

      try {
       const purchaseMade = await Purchases.purchasePackage(data);
        console.log('purchasemade',purchaseMade?.transaction)
        // const customerInfo = await Purchases.getCustomerInfo();
        // if (customerInfo?.entitlements.active['pro']) {
        //   Alert.alert('Success', 'Purchase successful!');
        // } else {
        //   Alert.alert('Error', 'Purchase failed');
        // }
      } catch (error) {
        if (!error.userCancelled) {
          Alert.alert('Error', error.message);
        }
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
     <Btn label={'Buy Purchase'} onPress={() => onConfirmPurchase()} btnStyle={{backgroundColor: Color('drawerBg'),width: '90%'}} />
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
