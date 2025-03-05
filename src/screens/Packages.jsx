import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
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
  const [offerings,setOfferings] = useState(null);
  const navigation = useNavigation();

  console.log(offerings);

  useEffect(() => {
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
    }, []);
  

  return (
    <Background noScroll={true} translucent={true} statusBarColor={Color('text')} noBackground>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
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
              onPress={() => navigation.navigate('Home')}>
              <ArrowLeft size={hp('2.5%')} color={Color('text')} />
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center', flex: 0.8}}>
            <Text style={styles.heading}>Our Packages</Text>
          </View>
        </View>
        <Text style={styles.desc}>Choose the best plan that fits your needs. Enjoy premium features and seamless access with our subscription packages.</Text>
        <View style={{paddingTop: hp(5)}}>
          {offerings?.map((item) => (
            <PackageCard onPress={() => navigation.navigate('PackageDetail',{detail: item})} style={{marginBottom: hp(2)}} type={item.packageType === 'ANNUAL' ? 'Professional' : 'Standard'} package_name={item.packageType === 'ANNUAL' ? 'Yearly' : 'Monthly'} price={item.product.priceString} />
          ))}
        </View>
      </View>
    </Background>
  );
};

export default Packages;

const styles = StyleSheet.create({
  container: {
    padding: hp(1),
    paddingTop: 0,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  desc:{
    color: 'black',
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: hp(4),
    width: wp(80)
  }
});
