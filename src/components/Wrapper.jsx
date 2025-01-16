import React from 'react';
import { View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Wrapper = ({ children, style, x }) => {
  const width = x ? (x * 5) : (1 * 5);
  return (
    <View style={{paddingHorizontal: wp(`${width}%`), ...style}}>
      {children}
    </View>
  );
};

export default Wrapper;
