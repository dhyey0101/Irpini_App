import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { view_product_by_idAction, get_collection_serviceAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';

import HTML from "react-native-render-html";
const { width, height } = Dimensions.get('window');

export default class FevouriteList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            favourite_product_Category: [],
            dataSource: [],
            isfavourite: 0,
            modalVisible: true,
            popupData: ''
        }
    }
    closeModal = (visible) => {
        this.setState({ modalVisible: visible });
    };
    componentDidMount() {
        this.popup();
    }

    popup() {
        this.setState({ loader: true })
        get_collection_serviceAction().then(function (responseJson) {
            console.log(responseJson); 
            if (responseJson.status == 1) {
                this.setState({
                    popupData: responseJson.result.wpnc_collection_service,
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
        const { dataSource, loader, isfavourite, modalVisible, popupData } = this.state;

        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Waste")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Bulky withdrawal")}</Text>
                            </View>
                        </View>
                    </Row>
                    <Row style={{ height: 50, marginHorizontal: 20, marginBottom: 10 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 24, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("Book your retreat!")}</Text>
                        </Col>
                    </Row>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>
                    <ScrollView> 

                    <Row style={{ marginTop: 20, justifyContent: 'center', height: 150, marginBottom: 10 }}>
                        {/* <LinearGradient colors={['rgba(57, 181, 74,0.8)', 'rgba(140,198,63,0.8)']} style={{ borderRadius: 75 }}> */}
                        <Col style={{ height: 150, width: 150, borderRadius: 75, justifyContent: 'center', alignItems: "center" }}>
                            {/* <Image source={require('../../images/Truck.png')} style={styles.TruckImage} /> */}
                            <Image source={require('../../images/Truck.gif')} style={{ height: "100%", width: "100%" }} />
                        </Col>
                        {/* </LinearGradient> */}
                    </Row>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', height: 100, marginHorizontal: 30 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 15, color: "#666" }}>
                            {t("If you book through app, please do not call for avoid duplication, disservices problems in managing the reservation, which in that case it might sre delays")}
                        </Text>
                    </Row>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: "5%", height: 50 }} onPress={() => navigate("RequestForm")}>
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                            style={{ marginHorizontal: 20, borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", height: 80 }}
                        >

                            <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium", textAlign: 'center' }}>{t("BOOK")}</Text>
                            </Row>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%", height: 50 ,marginBottom:20}} onPress={() => navigate("MyBooking")}>
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                            style={{ marginHorizontal: 20, borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", height: 80 }}
                        >

                            <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#fff", fontSize: 25, fontFamily: "Roboto-Medium", textAlign: 'center' }}>{t("MY BOOKINGS")}</Text>
                            </Row>
                        </LinearGradient>
                    </TouchableOpacity>
                    </ScrollView>
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
                                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{t("Methods of using the collection service")}</Text>
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
                                        <HTML source={{ html: popupData }} />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
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
                marginTop: 40,
                width: '100%',
                alignItems: 'center',
                marginLeft: 70
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 65
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
    TruckImage: {
        width: 100,
        height: 100
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