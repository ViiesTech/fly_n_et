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

// export function haversine(lat1, lon1, lat2, lon2){
//   const R = 3440.065; // Radius of the Earth in nautical miles
//   const toRad = angle => angle * (Math.PI / 180);
//   let dLat = toRad(lat2 - lat1);
//   let dLon = toRad(lon2 - lon1);
//   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//           Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in nautical miles
// }

// export function midpoint(lat1, lon1, lat2, lon2) {
//   const toRad = angle => (angle * Math.PI) / 180;
//   const toDeg = angle => (angle * 180) / Math.PI;

//   let dLon = toRad(lon2 - lon1);

//   lat1 = toRad(lat1);
//   lat2 = toRad(lat2);
//   lon1 = toRad(lon1);

//   let Bx = Math.cos(lat2) * Math.cos(dLon);
//   let By = Math.cos(lat2) * Math.sin(dLon);

//   let midLat = Math.atan2(
//     Math.sin(lat1) + Math.sin(lat2),
//     Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
//   );
//   let midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

//   return {
//     latitude: toDeg(midLat),
//     longitude: toDeg(midLon),
//   };
// }

export const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180; // Latitude in radians
  const φ2 = (point2.latitude * Math.PI) / 180; // Latitude in radians
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180; // Difference in latitudes
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180; // Difference in longitudes

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
};

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
