import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Color } from '../utils/Colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowRight2 } from 'iconsax-react-native';

const PackageCard = ({package_name,price,type,style,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.packageStyle,style]}>
      <View style={{flexDirection: 'row',gap: 10}}>
        <View style={styles.circleView} />
        <View>
        <Text style={[styles.textStyle,{fontWeight: 'bold'}]}>{package_name} Package</Text>
        <Text style={[styles.textStyle,{fontSize: hp(1.7)}]}>{type}</Text>
        </View>
        </View>
        <View style={{flexDirection: 'row',gap: 15}}>
          <Text style={[styles.textStyle,{fontWeight: 'bold',fontSize: hp(2.6)}]}>${price}</Text>
        <ArrowRight2 style={{marginTop: hp(0.4)}} size={hp('2.5%')} color={Color('text')} />
        </View>
    </TouchableOpacity>
  )
}

export default PackageCard;

const styles = StyleSheet.create({
  packageStyle:{
    backgroundColor: Color('drawerBg'),
    padding: hp(2.5),
    width: wp(85),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  circleView:{
    height: hp(1.5),
    width: hp(1.5),
    marginTop: hp(0.3),
    borderWidth: 2,
    borderColor: Color('text'),
    borderRadius: 100,
  },
  textStyle:{
    color: Color('text'),
    fontSize: hp(1.8)
  }
})