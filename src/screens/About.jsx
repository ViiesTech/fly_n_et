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

const About = ({navigation}) => {
  const {context, setContext} = useContext(DataContext);

  // useEffect(() => {
  //   getAbout();
  // }, []);

  // const getAbout = async () => {
  //   try {
  //     const res = await api.get('/get-description/about_app', {
  //       headers: { Authorization: `Bearer ${context?.token}` },
  //     });

  //     setContext({
  //       ...context,
  //       about: removeHTMLTags(res.data?.description?.about_app),
  //     });
  //   } catch (err) {
  //     await errHandler(err, null, navigation);
  //   }
  // };

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
          About App
        </Pera>
        <Br space={4} />
        <Wrapper>
          {/* {!context?.about ? (
            <View style={{alignItems: 'center'}}>
                <ActivityIndicator size={hp('5%')} color={Color('shadow')} />
            </View>
          ) : (
            <Small
              style={{ marginBottom: hp('2%') }}
              heading
              font="medium"
              color={Color('lightText')}>
              {context?.about}
            </Small>
          )} */}
          <Small
            style={{marginBottom: hp('2%')}}
            heading
            size={hp(1.9)}
            color={Color('shadow')}>
            {`Attention Pilots!

Introducing the ultimate app to enhance your flight planning experience. This app helps you seamlessly integrate meal stops into your flight itinerary, with an up-to-date, real-time database of restaurants near airports. Park your plane and enjoy a quick walk to a quality meal – no need to go off course!

Key Features:
• Fly-Eat-Back: Efficiently plan your flight with easy navigation to and back from airports with great dining options.
• Point-to-Point Search: Find airports with top-rated restaurants on your route.
• CFI/CFII Database: Access a growing network of CFI’s and CFII’s to connect with when needed.

We’re continuously improving the database to ensure that pilots and instructors can stay connected.

Whether you’re planning your next stop or connecting with a CFI/CFII, this app will make your flying experience more efficient, exciting, and adventurous.


`}
          </Small>
        </Wrapper>
      </Background>
    </>
  );
};

export default About;
