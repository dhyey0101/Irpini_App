import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { extend } from 'validate.js';
import Logo from './../../images/logo.svg';
import Category from './../../images/Category.svg';
import Map from './../../images/Map.svg';
import { t } from '../../../locals';
import { LinearGradient } from 'expo-linear-gradient';
const window = Dimensions.get("window");
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

export default class Dashboard extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            Create_password: '',
            Confirm_password: '',
            isChecked: false,
            validationError: '',
            passwordshow: true,
            loader: false,
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (

            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar />
                {/* <Row style={{ marginTop: -20, height: 120 }}>
                    <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                    <Col style={styles.slide2Logo}>
                        <Logo width={120} height={120} />
                    </Col>
                </Row> */}
                <Row style={styles.headerContainer}>
                    <View style={styles.top_background}>
                        <View style={styles.top_content}>
                            <Logo width={120} height={120} style={styles.headerLogo} />
                        </View>
                    </View>
                </Row>

                <Col style={{ justifyContent: 'space-around', alignItems: "center" }}>

                    <Col style={{ width: "90%" }}>
                        <TouchableOpacity onPress={() => navigate("CategoryList", { Role: "Person" })}>
                            <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 40 }}>
                                <Image source={require('./../../images/Category.png')} style={{ width: 150, height: 150 }} />
                                <Text style={{ fontSize: 20, fontFamily: "Roboto-Regular", color: "#fff", margin: 10 }}>{t("Categories")}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Col>

                    <Col style={{ width: "90%" }}>
                        <TouchableOpacity onPress={() => navigate("Map")}>
                            <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 40 }}>
                                <Image source={require('./../../images/Map.png')} style={{ width: 150, height: 150 }} />
                                <Text style={{ fontSize: 20, fontFamily: "Roboto-Regular", color: "#fff", margin: 10 }}>{t("Maps")}</Text>
                                <Text style={{ fontSize: 20, fontFamily: "Roboto-Regular", color: "#fff",  }}>{t("Special waste")}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Col>
                </Col>
            </View>
        )
    }
}


const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
const styles = StyleSheet.create({
    headerContainer: {
        ...Platform.select({
            ios: {
                width: sWidth,
                // height: 90,
                height: '17%',
            },
            android: {
                width: sWidth,
                // height: 90,
                height: '12%',
            }
        })
    },
    top_background: {
        ...Platform.select({
            ios: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.87,
                paddingTop: sHeight * 1.7,
            },
            android: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.90,
                paddingTop: sHeight * 1.7,
            }
        })


    },
    top_content: {
        paddingTop: sHeight * 0.02,
        width: sWidth,
        height: sHeight * 0.3,
        alignItems: 'center',
    },
    headerLogo: {
        marginTop: sHeight * 0.15,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        ...Platform.select({
            ios: {
                marginTop: sHeight * 0.22,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            },
            android: {
                marginTop: sHeight * 0.21,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            }
        })
    },
    headerBackArrow: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: sHeight * 0.215,
                left: '18%',
                padding: 20,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.21,
                left: '18%',
                padding: 20
            }
        })
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                // marginTop: -30, 
                width: '100%',
                alignItems: 'center'
            },
            android: {
                position: 'absolute',
                // marginTop: -30,
                width: '100%',
                alignItems: 'center'
            }
        })
    },
})