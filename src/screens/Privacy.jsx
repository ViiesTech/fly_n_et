/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Background from '../utils/Background';
import Br from '../components/Br';
import {Pera, Small} from '../utils/Text';
import {Color} from '../utils/Colors';
import BackBtn from '../components/BackBtn';
import Wrapper from '../components/Wrapper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isIOS, removeHTMLTags} from '../utils/global';
import {api, errHandler} from '../utils/api';
import {DataContext} from '../utils/Context';
const Privacy = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);

  useEffect(() => {
    getPrivacy();
  }, []);

  const getPrivacy = async () => {
    try {
      const res = await api.get('/get-description/privacy_policy', {
        headers: {Authorization: `Bearer ${context?.token}`},
      });
      setContext({
        ...context,
        privacy: removeHTMLTags(res.data.description.privacy_policy),
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
          style={{textAlign: 'center'}}
          color={Color('homeBg')}
          heading
          font="bold">
          Privacy Policy
        </Pera>
        <Br space={4} />
        <Wrapper>
          {!context?.privacy ? (
            <View style={{alignItems: 'center'}}>
                <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
            </View>
          ) : (
            <Small
              style={{marginBottom: hp('2%')}}
              heading
              font="medium"
              color={Color('lightText')}>
              {context?.privacy}
            </Small>
          )}
        </Wrapper>
      </Background>
    </>
  );
};

export default Privacy;
