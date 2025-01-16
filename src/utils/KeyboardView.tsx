/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

interface Props {
    children: any
}

const KeyboardView = ({ children }: Props) => {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={0}>
            {children}
        </KeyboardAvoidingView>
    );
};

export default KeyboardView;
