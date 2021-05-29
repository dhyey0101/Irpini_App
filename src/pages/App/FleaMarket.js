import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, TouchableHighlight } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { get_term_condition_market_placeAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Green_Star from './../../images/Green_Star.svg';
import HTML from "react-native-render-html";

const { width, height } = Dimensions.get('window');
// alert(width)
export default class FleaMarket extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            termAndCondition: ''
        }
    }
    closeModal = (visible) => {
        this.setState({ modalVisible: visible });
    };

    componentDidMount() {
        this.termAndCondition();
    }

    termAndCondition() {
        this.setState({ loader: true })
        get_term_condition_market_placeAction().then(function (responseJson) {
            // console.log(responseJson); 
            if (responseJson.status == 1) {
                this.setState({
                    termAndCondition: responseJson.result.term_condtion_market_place,
                    loader: false
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    render() {
        const { navigate } = this.props.navigation;
        const { modalVisible, loader, termAndCondition } = this.state;
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
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold'  }}>{t("Back")}</Text>
                            </Col>
                        </Row>
                    </Row> */}

                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Waste")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}> {t("Back")}</Text>
                            </View>
                        </View>
                    </Row>

                    <Row style={{ height: 60, marginHorizontal: 20 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("Flea Market")}</Text>
                        </Col>
                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Green_Star />
                        </Col> */}
                    </Row>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>
                    {/* <ScrollView> */}
                    <TouchableOpacity style={{ marginTop: 30, paddingVertical: 10 }} onPress={() => navigate("MarketPlaceAdsCategory")} >

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("Ads")}</Text>
                            </Col>
                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Green_Star />
                                </Col> */}
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => navigate("MarketPlaceCreateCategory")}>

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("Create Ad")}</Text>
                            </Col>
                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Green_Star />
                                </Col> */}
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => navigate("MarketPlaceMyAdvertList")}>

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <Row style={{ height: 50, paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>
                            <Col style={{ justifyContent: 'center', marginTop: 5 }}>
                                <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{t("My Ads")}</Text>
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
                    {/* Term and condition modal start */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    // onRequestClose={() => {
                    //   navigate('LocationScreen')
                    // }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', marginHorizontal: 20 }}>
                                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{t("Terms and conditions Flea market")}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.closeModal(false)}>
                                            <Image
                                                source={require("../../images/Cross-Icon.png")}
                                                style={{ width: 30, height: 30 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <ScrollView>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <HTML source={{ html: termAndCondition }} />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                    {/* Term and condition modal end */}

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
                marginLeft: width / 100 * 15,
            }
        })
    },
    centeredView: {
        shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1.22,
        elevation: 500,
        // width: Dimensions.get('window').width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(100,100,100, 0.8)",
    },
    modalView: {
        justifyContent: "center",
        marginVertical: "20%",
        borderRadius: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        marginHorizontal: 20,
        shadowColor: "#232324",
        shadowOffset: {
            width: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})