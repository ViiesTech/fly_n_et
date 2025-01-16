/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Color } from '../utils/Colors';
import { Pera } from '../utils/Text';

const DOB = ({dob, setDob}) => {
    const [ day, setDay ] = useState('');
    const [ month, setMonth ] = useState('');
    const [ year, setYear ] = useState('');
    const daysRef = useRef(null);
    const monthsRef = useRef(null);
    const yearRef = useRef(null);
    const viewStyle = {
        backgroundColor: Color('drawerBg'),
        borderWidth: 1,
        borderColor: Color('lightGray'),
        padding: hp('1%'),
        paddingHorizontal: wp('3%'),
        borderRadius: hp('5%'),
        flexGrow: 1,
    };
    const inputStyle = {
        color: Color('text'),
        height: hp('3.5%'),
        flexGrow: 1,
        paddingVertical: 0,
        fontFamily: 'Inter_18pt-Medium',
        textAlign: 'center',
    };

    useEffect(() => {
        if (dob?.length > 0) {
            const date = dob.split('-');
            setYear(date[0]);
            setMonth(date[1]);
            setDay(date[2]);
        }
    }, [dob]);

    useEffect(() => {
        if (day.length > 0 && month.length > 0 && year.length > 0) {
            setDob(`${year}-${month}-${day}`);
        }
    }, [day, month, year]);

    const onDaysChange = (days) => {
        if (days.length === 2) {
            monthsRef.current.focus();
        }
        setDay(days);
    };

    const onMonthsChange = (days) => {
        if (days.length === 2) {
            yearRef.current.focus();
        }
        setMonth(days);
    };

    const onYearsChange = (days) => {
        if (days.length === 4) {
            Keyboard.dismiss();
        }
        setYear(days);
    };

    return (
        <>
            <Pera style={{marginBottom: hp('0.5%'), paddingLeft: wp('1%')}}>Date of Birth</Pera>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}
            >
                <View style={viewStyle}>
                    <TextInput
                        keyboardType="numeric"
                        style={inputStyle}
                        defaultValue={day}
                        onChangeText={onDaysChange}
                        placeholder="DD"
                        ref={daysRef}
                        placeholderTextColor={Color('borderColor')}
                    />
                </View>
                <View style={viewStyle}>
                    <TextInput
                        keyboardType="numeric"
                        style={inputStyle}
                        defaultValue={month}
                        onChangeText={onMonthsChange}
                        ref={monthsRef}
                        placeholder="MM"
                        placeholderTextColor={Color('borderColor')}
                    />
                </View>
                <View style={viewStyle}>
                    <TextInput
                        keyboardType="numeric"
                        style={inputStyle}
                        defaultValue={year}
                        onChangeText={onYearsChange}
                        ref={yearRef}
                        placeholder="YYYY"
                        placeholderTextColor={Color('borderColor')}
                    />
                </View>
            </View>
        </>
    );
};

export default DOB;
