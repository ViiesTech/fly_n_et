import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Color} from '../utils/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Small} from '../utils/Text';
import {Eye, EyeSlash} from 'iconsax-react-native';
import { responsiveHeight } from '../utils/global';

const Input = ({
  mode,
  label,
  style,
  inputStyle,
  textAlign,
  multiline,
  keyboardType,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const lightModeStyle =
    mode === 'light'
      ? {
          borderColor: Color('lightText'),
        }
      : {};
  return (
    <>
      <View style={[styles.input, lightModeStyle, style]}>
        {label && (
          <Small
            font="regular"
            style={styles.label}
            color={mode === 'light' ? Color('shadow') : Color('text')}>
            {label}
          </Small>
        )}
        <TextInput
          keyboardType={keyboardType}
          multiline={multiline}
          secureTextEntry={isPasswordVisible}
          textAlignVertical={textAlign}
          style={[
            styles.inputField,
            inputStyle,
            {color: mode === 'light' ? Color('shadow') : Color('text')},
          ]}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
            {isPasswordVisible ? (
              <Eye color={Color('inputSearch')} size={18} />
            ) : (
              <EyeSlash color={Color('inputSearch')} size={18} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Color('lightGray'),
    borderRadius: hp('50%'),
    position: 'relative',
  },
  inputField: {
    borderRadius: hp('50%'),
    paddingHorizontal: wp('5%'),
    fontFamily: 'Montserrat-Regular',
    height: hp('4%'),
    marginTop: hp('1.5%'),
    paddingVertical: 0,
  },
  label: {
    position: 'absolute',
    top: hp('.3%'),
    left: wp('5%'),
    fontSize: hp('1.2%'),
  },
    icon: {
    position: 'absolute',
    right: wp('4%'),
    top: responsiveHeight(2),
    transform: [{ translateY: -hp('1%') }],
    padding: 4,
  },
  
});
