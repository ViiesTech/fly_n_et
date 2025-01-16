/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import { Pera, Small } from '../utils/Text';
import { Color } from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isIOS, removeHTMLTags } from '../utils/global';
import { api, errHandler } from '../utils/api';
import { DataContext } from '../utils/Context';
const Terms = ({ navigation }) => {
  const { context, setContext } = useContext(DataContext);

  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = async () => {
    try {
      const res = await api.get('/get-description/terms', {
        headers: { Authorization: `Bearer ${context?.token}` },
      });
      setContext({
        ...context,
        terms: removeHTMLTags(res.data?.description?.terms),
      });
    } catch (err) {
      await errHandler(err, null, navigation);
    }
  };
  return (
    <>
      <BackBtn navigation={navigation} />
      <Background
        bgColor={Color('sidebarBg')}
        statusBarColor={Color('sidebarBg')}
        barStyle="dark-content"
        noBackground
        translucent={false}>
        <Br space={isIOS ? 0.5 : 2.5} />
        <Pera
          style={{ textAlign: 'center' }}
          color={Color('homeBg')}
          heading
          font="bold">
          Terms & Conditions
        </Pera>
        <Br space={4} />
        <Wrapper>
          {!context?.terms ? (
            <View style={{alignItems: 'center'}}>
                <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
            </View>
          ) : (
            <>
              <Small
                style={{ marginBottom: hp('2%') }}
                heading
                font="medium"
                color={Color('lightText')}>
                {context?.terms}
              </Small>
              <Br space={4} />
            </>
          )}
        </Wrapper>
      </Background>
    </>
  );
};

export default Terms;
