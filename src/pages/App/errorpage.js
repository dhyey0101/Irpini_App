import React, { Component } from 'react';
import { Image, Platform, Dimensions, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Bin from './../../images/Bin.svg'
import Logo from './../../images/logo.svg'
import { t } from '../../../locals';
import normalize from 'react-native-normalize';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export default class Instuction extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      routeName: "",
    };
  }
  componentDidMount() {

    var RouteName = this.props.navigation.getParam("route_name");
    // let PICKUPBOOKING = this.props.navigation.getParam("PICKUPBOOKING");
    this.setState({
      routeName: RouteName,
    });
    if (RouteName == "report") {
      setTimeout(() => {
        this.props.navigation.navigate("Report");
      }, 4000);
    } else if (RouteName == "request_form") {
      setTimeout(() => {
        this.props.navigation.navigate("RequestForm");
      }, 4000);
    } else if (RouteName == "create_ads") {
      setTimeout(() => {
        this.props.navigation.navigate("MarketPlaceMyAdvertList");
      }, 4000);
    } else if (RouteName == "delete_ads") {
      setTimeout(() => {
        this.props.navigation.navigate("MarketPlaceMyAdvertList");
      }, 4000);
    }
    else if (RouteName == "close_ads") {
      setTimeout(() => {
        this.props.navigation.navigate("MarketPlaceMyAdvertList");
      }, 4000);
    } else if (RouteName == "open_ads") {
      // setTimeout(() => {
      //   this.props.navigation.navigate("MarketPlaceMyAdvertList");
      // }, 4000);
    } else if (RouteName == "delete_report") {
      setTimeout(() => {
        this.props.navigation.navigate("AllComplainList");
      }, 4000);
    } else if (RouteName == "disable_report") {
      setTimeout(() => {
        this.props.navigation.navigate("AllComplainList");
      }, 4000);
    } else if (RouteName == "enable_report") {
      setTimeout(() => {
        this.props.navigation.navigate("AllComplainList");
      }, 4000);
    }
    // setTimeout(()=>{ this.props.navigation.navigate("RequestForm") }, 4000);
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
          style={{ flex: 1 }}>
          <Row style={styles.LogoRow}>
            <Col style={styles.LogoCol}>
              <Logo width={220} height={220} />
            </Col>
          </Row>
          <Row style={styles.BinRow}>

            <Image source={require('../../images/Sad.png')} style={styles.TruckImage} />
          </Row>
          <Row style={{ marginHorizontal: 30 }}>
            <Col style={styles.WelcomeRow}>
              <Text style={styles.textSlide1}>{t("Ops")}</Text>
              <Text style={styles.textSlide1}>{t("Something went wrong")}</Text>
              <Text style={styles.textSlide1}>{t("Try later")}</Text>
              {/* <Text style={styles.descriptionText}>
                {t("You are about to redirected to My Ads")}
              </Text> */}
            </Col>
          </Row>
        </LinearGradient>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  LogoRow: {
    height: 50,
    marginTop: "45%",

  },

  LogoCol: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  BinRow: {
    justifyContent: 'center',
    marginTop: "10%",
  },
  TruckImage: {
    width: 210,
    height: 210
  },
  WelcomeRow: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        // height: 70,
        // marginHorizontal: 20,
        // marginTop: "10%"
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        // height: 30,
        // marginHorizontal: 20,

      }
    })
  },
  textSlide1: {
    color: '#fff',
    fontSize: 28,
    fontFamily: "Roboto-Bold",
    textAlign: 'center'
  },
  descriptionText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 28,
    fontFamily: "Roboto-Medium",
    textAlign: 'center',
  },
})