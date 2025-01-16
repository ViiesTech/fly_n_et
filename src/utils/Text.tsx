import React from 'react';
import { Text } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color } from './Colors';

interface Props {
    children: any,
    style?: object,
    numberOfLines?: number,
    color?: any,
    font?: any,
    heading?: any,
    size?: any
}

const head: any = {
    'light': 'Manrope-Regular',
    'regular': 'Manrope-Regular',
    'bold': 'Manrope-Bold',
    'extraBold': 'Manrope-ExtraBold',
    'medium': 'Manrope-Medium',
};

const text: any = {
    'light': 'Montserrat-Light',
    'regular': 'Montserrat-Regular',
    'bold': 'Montserrat-Bold',
    'extraBold': 'Montserrat-ExtraBold',
    'medium': 'Montserrat-Medium',
};

export const Small = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('1.5%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const Pera = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('2%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H6 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('2.5%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H5 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('3%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H4 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('3.5%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H3 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('4%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H2 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('4.5%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};

export const H1 = ({color, children, numberOfLines, style, font, heading, size}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={{
            color: color || Color('text'),
            fontSize: size || hp('5%'),
            fontFamily: heading ? head[font] : text[font],
            ...style,
        }}>{children}</Text>
    );
};
