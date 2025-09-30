import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ArrowRight2} from 'iconsax-react-native';

const AndroidPackageCard = ({
  package_name,
  price,
  type,
  expiryDate,
  style,
  onPress,
  isActive,
}) => {

  alert(isActive)

  return (
    <TouchableOpacity onPress={onPress} style={[styles.packageStyle, style]}>
      {/* Left Side */}
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <View style={styles.circleView} />
          {/* <View style={{marginLeft: wp(2)}}> */}
          <Text style={[styles.textStyle, {fontWeight: 'bold'}]}>
            {package_name}
          </Text>
        </View>
        <View style={styles.rightRow}>
          <Text
            style={[styles.textStyle, {fontWeight: 'bold', fontSize: hp(2.5)}]}>
            {price}
          </Text>
          <ArrowRight2
            size={hp(2.5)}
            color={Color('text')}
            style={{marginTop: hp(0.5)}}
          />
        </View>
           
        {/* </View> */}
      </View>

      {/* Right Side */}
        <View style={styles.bottomRow}>
        <Text style={[styles.textStyle, {fontSize: hp(1.7)}]}>{type}</Text>
         {isActive && expiryDate && (
              <Text style={styles.activeText}>
                Active - Expires on {expiryDate}
              </Text>
            )} 
        </View>
      {/* <View style={styles.rightContainer}>
        <Text
          style={[styles.textStyle, {fontWeight: 'bold', fontSize: hp(2.5)}]}>
          {price}
        </Text>
        <ArrowRight2
          size={hp(2.5)}
          color={Color('text')}
          style={{marginTop: hp(0.5)}}
        />
      </View> */}
    </TouchableOpacity>
  );
};

export default AndroidPackageCard;

const styles = StyleSheet.create({
  packageStyle: {
    backgroundColor: Color('drawerBg'),
    padding: hp(2.5),
    width: wp(90),
    borderRadius: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignSelf: 'center',
    // alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  circleView: {
    height: hp(1.5),
    width: hp(1.5),
    marginTop: hp(0.3),
    borderWidth: 2,
    borderColor: Color('text'),
    borderRadius: 100,
  },
  textStyle: {
    color: Color('text'),
    fontSize: hp(1.8),
  },
  activeText: {
    color: 'white', // bright blue
    fontSize: hp(1.6),
    fontWeight: 'bold',
    // marginTop: hp(0.5),
  },
});