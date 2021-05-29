import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { view_product_by_idAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Green_Star from './../../images/Green_Star.svg';

const { width, height } = Dimensions.get('window');

export default class Help extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            favourite_product_Category: [],
            dataSource: []
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, loader } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("Waste")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Help Request")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Sidemenu")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Help Request")}</Text>
                            </View>
                        </View>
                    </Row>

                    <Row style={{ height: 50, marginHorizontal: 20 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("Do you need help?")}</Text>
                        </Col>
                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Green_Star />
                        </Col> */}
                    </Row>
                    {/* <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>

                    <TouchableOpacity style={{ marginTop: 30, paddingVertical: 10 }} onPress={() => navigate("SupportNumber")}>

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("Green number")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => navigate("EmailScreen")}>

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("Email")}</Text>
                            </Col>
                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Green_Star />
                                </Col> */}
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => navigate("HelprequestScreen")}>

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>
                            <Col style={{ justifyContent: 'center', marginTop: 5 }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("Fill in the form")}</Text>
                            </Col>
                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Green_Star />
                                </Col> */}
                        </Row>
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                    </TouchableOpacity>
                    {/* </ScrollView> */}
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#65be44"
                />
            );
        }
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
                marginTop: 30,
                width: '100%',
                alignItems: 'center',
                marginLeft: 50
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 50
            }
        })
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    Image: {
        alignItems: "center",
        justifyContent: "center",
        // height: 90,
        marginTop: 5,
        width: Dimensions.get("window").width * 80 / 100,
        // borderRadius: 100,
        // marginLeft: 10,
        height: Dimensions.get("window").height * 30 / 100,
    },
    header: {
        ...Platform.select({
            ios: {
                marginLeft: 30
            },
            android: {
                marginLeft: 20
            }
        })

    }
})