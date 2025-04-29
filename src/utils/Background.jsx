/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import KeyboardView from './KeyboardView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigation} from '@react-navigation/native';
import {Color} from './Colors';
import {isIOS} from './global';
import Orientation from 'react-native-orientation-locker';

// const { width, height } = Dimensions.get('screen');

const Background = ({
  translucent,
  bgColor,
  statusBarColor,
  barStyle,
  children,
  noBackground,
  noScroll,
  detectScrollEnd,
  onScrollEnd,
  Auth,
  refreshing,
  onRefresh,
}) => {
  const [width, setScreenWidth] = useState(Dimensions.get('window').width);
  const [height, setScreenHeight] = useState(Dimensions.get('window').height);
  useEffect(() => {
    if (Auth) {
      hasToken();
    }
  }, []);
  const hasToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Splash'}],
      });
    }
  };
  const scrollEnd = () => {
    if (detectScrollEnd) {
      onScrollEnd();
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
    };

    // Listen for orientation changes
    Orientation.addOrientationListener(updateDimensions);

    // Listen for dimension changes (e.g. on rotation)
    const dimensionSubscription = Dimensions.addEventListener('change', updateDimensions);

    // Cleanup both listeners
    return () => {
      Orientation.removeOrientationListener(updateDimensions);
      dimensionSubscription?.remove(); // modern API
    };
  }, []);


  return (
    <>
      <StatusBar
        translucent={translucent}
        backgroundColor={statusBarColor || 'transparent'}
        barStyle={barStyle || 'light-content'}
      />
      <SafeAreaView
        style={[
          styles.safeAreaView,
          {backgroundColor: isIOS ? statusBarColor : 'transparent'},
        ]}>
        {!noBackground && (
          <Image
            source={require('../assets/images/bg.png')}
            style={[styles.backgroundImage, {width: width, height: height}]}
          />
        )}
        <View
          style={[
            styles.content,
            {
              backgroundColor: noBackground
                ? bgColor || Color('text')
                : 'transparent',
            },
          ]}>
          <KeyboardView>
            {noScroll ? (
              children
            ) : (
              <View>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  onScrollEndDrag={e => {
                    const {contentOffset, contentSize, layoutMeasurement} =
                      e.nativeEvent;
                    const end =
                      contentOffset.y + layoutMeasurement.height >=
                      contentSize.height - 20;
                    if (end) {
                      scrollEnd();
                    }
                  }}
                  refreshControl={
                    onRefresh ? (
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    ) : undefined
                  }>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Keyboard.dismiss();
                    }}>
                    <View>{children}</View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </View>
            )}
          </KeyboardView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Background;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  content: {
    zIndex: 1,
    flex: 1,
  },
});
