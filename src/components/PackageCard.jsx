import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Color } from '../utils/Colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ArrowRight2 } from 'iconsax-react-native';

const PackageCard = ({ package_name, price, type, style, onPress, isActive, date,disabled }) => {
  console.log('isActive ===>',isActive)
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.packageStyle, style]}>
      
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <View style={styles.circleView} />
          <Text style={styles.packageTitle}>{package_name} Package</Text>
        </View>

        <View style={styles.rightRow}>
          <Text style={styles.priceText}>{price}</Text>
          <ArrowRight2 size={hp('2.5%')} color={Color('text')} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.packageType}>{type}</Text>
        {isActive && date && (
          <Text style={styles.activeText}>Active – Expires on {date}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default PackageCard;

const styles = StyleSheet.create({
  packageStyle: {
    backgroundColor: Color('drawerBg'),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    width: wp(85),
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: hp(1),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  circleView: {
    height: hp(1.8),
    width: hp(1.8),
    borderWidth: 2,
    borderColor: Color('text'),
    borderRadius: 100,
  },
  packageTitle: {
    color: Color('text'),
    fontSize: hp(2),
    fontWeight: '600',
  },
  packageType: {
    color: Color('text'),
    fontSize: hp(1.7),
    // marginTop: hp(0.5),
  },
  activeText: {
    color: 'white',
    fontSize: hp(1.5),
    // marginTop: hp(0.3),
  },
  priceText: {
    color: Color('text'),
    fontWeight: '700',
    fontSize: hp(2.4),
  },
  bottomRow: {
    // marginTop: hp(0.8),
  },
})
