import React, { Component } from 'react';
import { Image, Platform, Dimensions, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ImageBackground, Alert, TouchableHighlight } from 'react-native';
import Swiper from 'react-native-swiper';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Bin from './../../images/Bin.svg'
import Logo from './../../images/logo.svg'
import { t } from '../../../locals';
import normalize from 'react-native-normalize';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import * as Location from "expo-location";
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions';
import * as FacebookAds from 'expo-ads-facebook';

// import { adMob,requestPermissionsAsync } from 'expo-ads-admob';
// import { getTrackingStatus,  requestTrackingPermission  } from 'react-native-tracking-transparency';

export default class Instuction extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
      permissionStatus: '',
      token: '',
    };
  };
  onSwipeRight() {
    this.props.navigation.navigate("SelectRole")
  }
  async componentDidMount() {
    // FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash);
    // console.log(FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash))
    Location.requestPermissionsAsync().then((permission) => {
      let status = permission.status;
      this.setState({
        permissionStatus: status
      })
      if (permission.status !== 'granted') {
        alert(t('Please give location permission'));
      } else {
        Location.getCurrentPositionAsync().then((pos) => {
          Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        });
      }
    });
    this.registerForPushNotifications();
    this.AskTrackingPermission();
  }

  async AskTrackingPermission() {
    // const request = async () => {
    try {
      const status = await FacebookAds.AdSettings.requestPermissionsAsync();
      // console.log(status);
    } catch (e) {
      console.log(e);
      // Alert.alert('Error', e?.toString?.() ?? e);
    }
    // }

  }

  /* for get device token */
  registerForPushNotifications = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    this.setState({ token: token.data });

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      // <ScrollView showsVerticalScrollIndicator={false}>

      <Swiper style={styles.wrappar}
        loop={false}
        // autoplay={true}
        // autoplayTimeout={5.5}
        activeDotColor={"#62bb46"}
        paginationStyle={{ marginBottom: 10 }}
      // onMomentumScrollEnd ={() => this.navigate()}
      >
        <View style={styles.slide1}>
          <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
            style={{ flex: 1 }}>
            {/* <StatusBar /> */}
            <Row style={styles.LogoRow}>
              <Col style={styles.LogoCol}>
                <Logo width={220} height={220} />
              </Col>
            </Row>
            <Row style={styles.BinRow}>
              <Col style={styles.BinCol}>
                <Bin />
              </Col>
            </Row>
            <Row>
              <Col style={styles.WelcomeRow}>
                <Text style={styles.textSlide1}>{t("Welcome!")}</Text>
              </Col>
            </Row>
          </LinearGradient>
        </View>

        <View style={styles.slide2}>
          <StatusBar />
          <View style={styles.containerStyle} >
            <View style={styles.sliderContainerStyle} >
              <Logo width={120} height={80} style={styles.headerLogo} />
            </View>
          </View>
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/City-Background.png')} style={styles.FirstImage} />

          </Row>
          <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 70, alignItems: 'center', }}>

            <View style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Select your municipality")}</Text>
              <Text style={styles.subtextSlide}>{t("Select your municipality to find out how separate collection works in your city")}</Text>
            </View>

          </View>
        </View>

        <View style={styles.slide2}>
          <StatusBar />
          <View style={styles.containerStyle} >
            <View style={styles.sliderContainerStyle} >
              <Logo width={120} height={80} style={styles.headerLogo} />
            </View>
          </View>
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/ThirdSlide.png')} style={styles.SecondImage} />
            {/* <Col style={styles.slide2Logo}>

            </Col> */}
          </Row>
          <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 70, alignItems: 'center', }}>

            <View style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Door-to-door collection")}</Text>
              <Text style={styles.subtextSlide}>{t("Select the type of waste and schedule a collection at your home")}</Text>
            </View>

          </View>
        </View>

        {/* <View style={styles.slide2}>
          <StatusBar />
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/ThirdSlide.png')} style={styles.ThirdImage} />
            <Col style={styles.slide2Logo}>
              <Logo width={120} height={120} />
            </Col>
          </Row>
          <Row>
            <Col style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Door-to-door collection")}</Text>
              <Text style={styles.subtextSlide}>{t("Select the type of waste and schedule a collection at your home")}</Text>
            </Col>
          </Row>
        </View> */}

        <View style={styles.slide2}>
          <StatusBar />
          <View style={styles.containerStyle} >
            <View style={styles.sliderContainerStyle} >
              <Logo width={120} height={80} style={styles.headerLogo} />
            </View>
          </View>

          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/Waste-Research-Background.png')} style={styles.CityImage} />

          </Row>
          <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 70, alignItems: 'center', }}>

            <View style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Waste research")}</Text>
              <Text style={styles.subtextSlide}>{t("Search for a type of waste to find out its disposal methods")}</Text>
            </View>

          </View>
        </View>

        {/* <View style={styles.slide2}>
          <StatusBar />
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/FourthSlide.png')} style={styles.ThirdImage} />
            <Col style={styles.slide2Logo}>
              <Logo width={120} height={120} />
            </Col>
          </Row>
          <Row>
            <Col style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Waste research")}</Text>
              <Text style={styles.subtextSlide}>{t("Search for a type of waste to find out its disposal methods")}</Text>
            </Col>
          </Row>
        </View> */}


        <View style={styles.slide2}>
          <StatusBar />
          <View style={styles.containerStyle} >
            <View style={styles.sliderContainerStyle} >
              <Logo width={120} height={80} style={styles.headerLogo} />
            </View>
          </View>
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/Calendar-Background.png')} style={styles.CityImage} />

          </Row>
          <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 70, alignItems: 'center', }}>

            <View style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Calendar")}</Text>
              <Text style={styles.subtextSlide}>{t("Discover daily pickups made in your area")}</Text>
            </View>

          </View>
        </View>


        {/* <View style={styles.slide2}>
          <StatusBar />
          <Row style={styles.splashScreenRow}>
            <Image source={require('../../images/FifthSlide.png')} style={styles.FifthImage} />
            <Col style={styles.slide2Logo}>
              <Logo width={120} height={120} />
            </Col>
          </Row>
          <Row>
            <Col style={styles.Slide2TextRow}>
              <Text style={styles.textSlide2}>{t("Calendar")}</Text>
              <Text style={styles.subtextSlide}>{t("Discover daily pickups made in your area")}</Text>
            </Col>
          </Row>
        </View> */}

        <View style={styles.slide2}>
          <StatusBar />
          <GestureRecognizer
            onSwipeLeft={() => this.onSwipeRight()}
            style={{
              flex: 1,
            }}
          >
            <View style={styles.containerStyle} >
              <View style={styles.sliderContainerStyle} >
                <Logo width={120} height={80} style={styles.headerLogo} />
              </View>
            </View>
            <Row style={styles.splashScreenRow}>
              <Image source={require('../../images/FifthSlide.png')} style={styles.CityImage} />
              {/* <Col style={styles.slide2Logo}> */}
              {/* <Text>Hello</Text> */}
              {/* </Col> */}
            </Row>
            <View style={{ position: 'absolute', alignSelf: 'flex-end', justifyContent: 'center', marginTop: "30%",}}>
              <TouchableOpacity onPress={() => navigate("SelectRole")} style={{ alignSelf: 'flex-end', justifyContent: 'center', marginTop: "80%", paddingHorizontal: 20 }}>
                <Image source={require('../../images/Arrow.png')} style={styles.ArrowImage} />
              </TouchableOpacity>
            </View>
            <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 70, alignItems: 'center', }}>
              <View style={styles.Slide2TextRow}>
                <Text style={styles.textSlide2}>{t("Reports")}</Text>
                <Text style={styles.subtextSlide}>{t("Report any problems or malfunctions")}</Text>
              </View>

            </View>
          </GestureRecognizer>
        </View>

        {/* <View style={styles.slide2}>
          <StatusBar />
          <GestureRecognizer
            onSwipeLeft={() => this.onSwipeRight()}
            style={{
              flex: 1,
            }}
          >
            <Row style={styles.splashScreenRow}>
              <Image source={require('../../images/SixthSlide.png')} style={styles.ThirdImage} />
              <Col style={styles.slide2Logo}>
                <Logo width={120} height={120} />
              </Col>
            </Row>
            <Row>
              <Col style={styles.Slide6TextRow}>
                <Text style={styles.textSlide2}>{t("Reports")}</Text>
                <Text style={styles.subtextSlide}>{t("Report any problems or malfunctions")}</Text>
              </Col>
            </Row>
          </GestureRecognizer>
        </View> */}

      </Swiper>
    )
  }
}

const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
var window = Dimensions.get("window");
const styles = StyleSheet.create({
  headerLogo: {

  },
  LogoRow: {
    height: 50,
    marginTop: "45%"
  },

  LogoCol: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },

  BinRow: {
    justifyContent: 'center',
    marginTop: "10%"
  },

  BinCol: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#fff'
  },

  slide1: {
    flex: 1,
    justifyContent: 'center',

  },
  slide2: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  splashScreenRow: {
    ...Platform.select({
      ios: {
        // paddingTop: 30,
        // backgroundColor: "#62bb46",
        // height: 50
        height: Dimensions.get("window").height * 60 / 100,
      },
      android: {
        height: Dimensions.get("window").height * 60 / 100,
      }
    })
  },

  slide2Logo: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        // marginTop: -30, 
        width: '100%',
        alignItems: 'center',

      },
      android: {
        position: 'absolute',
        marginTop: -30,
        width: '100%',
        alignItems: 'center'
      }
    })
  },

  textSlide1: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold'
  },
  textSlide2: {
    color: '#62bb46',
    fontSize: 24,
    fontFamily: 'Roboto-Bold'
  },
  subtextSlide: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto-Light'
  },
  NavBar: {
    height: 90,
    marginTop: -25,
  },
  NavBarLogo: {
    height: 90,
    marginLeft: 115,
    position: 'absolute',
    justifyContent: 'center',
    marginTop: -10

  },
  WelcomeRow: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginTop: "10%"
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
      }
    })
  },
  NaveImage: {
    width: "100%",
  },
  CityImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  ArrowImage: {
    ...Platform.select({
      ios: {
        width: 100,
        height: 100,
      },
      android: {
        width: 100,
        height: 100
      }
    })
  },
  FirstImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  SecondImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  ThirdImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  FourthImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  FifthImage: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: '100%',
      },
      android: {
        width: Dimensions.get("window").width,
        height: '100%',
      }
    })
  },
  ThirdImage1: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: normalize(750),
        marginTop: -4
      },
      android: {
        marginTop: -4,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }
    })
  },
  FifthImage1: {
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width,
        height: normalize(750),
      },
      android: {
        marginTop: -4,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }
    })
  },
  Slide2TextRow: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%",
        marginTop: "10%",
        paddingTop: 90
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%",
        paddingTop: 30

      }
    })
  },
  Slide6TextRow: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: "80%",
        marginTop: "10%",
        paddingTop: 90
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: "80%",
        paddingTop: 30

      }
    })
  },
  containerStyle: {

    ...Platform.select({
      ios: {
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 4,
        justifyContent: 'flex-end',
        backgroundColor: '#EAFCFC',
      },
      android: {
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 5,
        justifyContent: 'flex-end',
        backgroundColor: '#EAFCFC',
      }
    })
  },
  sliderContainerStyle: {
    borderRadius: window.width,
    width: window.width * 2,
    height: window.width * 2,
    marginLeft: -(window.width / 2),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#6DBF43',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
})