import React, { Component } from 'react';
import { Platform, TouchableHighlight, Dimensions, Animated, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { extend } from 'validate.js';
import Logo from './../../images/logo.svg';
import Category from './../../images/Category.svg';
import Map from './../../images/Map.svg';
import { t } from '../../../locals';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationEvents } from "react-navigation";
import BottomSheet from 'reanimated-bottom-sheet';

const { width, height } = Dimensions.get('window');

export default class Dashboard extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.sheetRef = React.createRef(null);
        this.state = {
            name: '',
            email: '',
            Create_password: '',
            Confirm_password: '',
            isChecked: false,
            validationError: '',
            passwordshow: true,
            loader: false,
            opacity: new Animated.Value(0),
            isOpen: false,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;

        this.onOpen();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.onOpen();
        });
    }
    async componentWillUnmount() {
        this.focusListener.remove();
    }
    onClose = () => {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
        }).start();
        this.sheetRef.current.snapTo(0);
        setTimeout(() => {
            this.setState({ isOpen: false });
        }, 50);
    };

    onOpen = () => {
        this.setState({ isOpen: true });
        this.sheetRef.current.snapTo(2);
        Animated.timing(this.state.opacity, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    renderBackDrop = () => (
        <Animated.View
            style={{
                opacity: this.state.opacity,
                backgroundColor: '#000',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
            <TouchableOpacity
                style={{
                    width: width,
                    height: height,
                    backgroundColor: 'transparent',
                }}
                activeOpacity={1}
                // onPress={this.onClose}
            />
        </Animated.View>
    );
    renderContent = () => {
        const { navigate } = this.props.navigation;
        const { garbage_category_id } = this.state;
        return (
            <View
                style={{
                    // backgroundColor: '#fff',
                    height: 550,
                }}
            >

                {/* <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient> */}
                
                    <Row style={styles.profileListRow}>
                        <Col style={{alignContent:'flex-end', width:'80%'}}>
                            {/* <Text style={[styles.text],{alignContent:'flex-end'}}>
                                {t('Close')}
                            </Text> */}
                            
                        </Col>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Waste'); }} style={styles.menuItemCloseBtn}>
                        <Col style={{alignContent:'flex-end', width:'20%'}}>
                            <Image
                                source={require("../../images/cross-white.png")}
                                style={{ width: 40, height: 40 }}
                            />
                        </Col>
                        </TouchableOpacity>
                    </Row>
                
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                {/* <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        > */}
                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('Profile'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Profile')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>
                {/* </LinearGradient> */}

                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('News'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('News')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>

                {/* Educational */}
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('Educational'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Educational')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>

                {/* Report */}
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('Segnalazioni'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Reports')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight> 

                {/* Flea Market */}
                {/* <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('FleaMarket'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Flea Market')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight> */}

                {/* Help Request */}
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('HelpRequest'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Help Request')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>

                {/* Who we are */}
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('AboutUs'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Who we are')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>

                {/* Logout */}
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>

                <TouchableHighlight underlayColor="#67BD44" onPress={() => this.logout()} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Logout')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>

            </View>
        )

    };

    logout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('token');
        // await AsyncStorage.removeItem('email');
        this.props.navigation.navigate('Auth');

    };
    
    // _onBlurr = () => {
    //     BackHandler.removeEventListener(
    //       "hardwareBackPress",
    //       this._handleBackButtonClick
    //     );
    //   };
    
    //   _onFocus = () => {
    //     BackHandler.addEventListener(
    //       "hardwareBackPress",
    //       this._handleBackButtonClick
    //     );
    //   };
    
    //   _handleBackButtonClick = () =>
    //     this.props.navigation.navigate("MainMenuScreen");

    render() {
        const { navigate } = this.props.navigation;
        var a = height - 550;
        var snap = height - a;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                 {/* <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                /> */}
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
                            </LinearGradient>
                        </TouchableOpacity>
                    </Col>
                </Col>
                {this.state.isOpen && this.renderBackDrop()}

                <BottomSheet
                    ref={this.sheetRef}
                    // snapPoints={[0, 240, 0]}
                    // borderRadius={10}
                    enabledContentGestureInteraction={false}
                    renderContent={this.renderContent}

                    snapPoints={[
                        ...Platform.select({
                            ios: [
                                '-10%',
                                height * 0.5,
                                snap,
                                height * 0.85,
                            ],
                            android: [
                                '-10%',
                                height * 0.5,
                                snap,
                                height * 0.85,
                            ]
                        })

                    ]}
                    initialSnap={0}
                    //   renderHeader={this.renderHeader}
                    //   renderContent={this.renderInner}
                    onCloseEnd={this.onClose}
                />

            </View>
        )
    }
}
const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
const styles = StyleSheet.create({
    headerContainer: {
        width: sWidth,
        height: 90,
        backgroundColor: '#fff'
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
                marginTop: sHeight * 0.20,
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
                marginTop: sHeight * 0.21,
                left: '18%',
                padding: 10
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.22,
                left: '18%',
                padding: 10
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
    text: {
        color: '#333333',
        marginLeft: 20,
        fontSize: 25,
        fontFamily: 'Roboto-Medium'
    },
    profileListRow: {
        marginLeft: 20,
        height: 40,
        marginTop: 10,
    },
    menuItem: {
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                textAlign: 'center',
                color: '#4C64FF',
                backgroundColor: '#ffffff'
            },
            android: {
                paddingVertical: 10,
                textAlign: 'center',
                color: '#4C64FF',
                backgroundColor: '#ffffff'
            }
        })
    },
    menuItemCloseBtn: {
        ...Platform.select({
            ios: {
                height:50,
                // paddingVertical: 10,
                // textAlign: 'center',
                color: '#4C64FF',
                marginBottom:20
            },
            android: {
                height:50,
                // padding: 10,
                // textAlign: 'center',
                color: '#4C64FF',
                backgroundColor:'transparent',
                opacity: 0.9,
                marginBottom:20
            }
        })
    },
})