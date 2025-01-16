import { Platform } from 'react-native';
import { Color } from './Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const drawerStyle = {
    backgroundColor: Color('drawerBg'),
    borderTopLeftRadius: hp('5%'),
    borderTopRightRadius: hp('5%'),
    borderWidth: 1,
    borderColor: Color('text'),
};

export const drawerInner = {
    height: hp('80%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
};

export function capitalize(str) {
    if (!str) {return '';}
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeHTMLTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

export const isIOS = Platform.OS === 'ios';

export function nauticalMilesToMeters(nauticalMiles) {
    const metersPerNauticalMile = 1852; // 1 nautical mile = 1852 meters
    return parseFloat(nauticalMiles * metersPerNauticalMile);
}

export function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}
