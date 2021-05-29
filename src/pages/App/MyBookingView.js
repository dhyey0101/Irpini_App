import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, AsyncStorage, StyleSheet, View, RefreshControl, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import Logo from './../../images/logo.svg';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { view_bulky_waste_pickup_by_idAction } from '../../util/Action';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../locals';
import TextInput from 'react-native-material-textinput';
import DropdownAlert from 'react-native-dropdownalert';

export default class MyBookingView extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            myBookingView: '',
            product: ''
        }
    }

    componentDidMount() {

        const product = this.props.navigation.getParam("product");
        this.setState({
            product: product
        });
        this.myBookingView()
    }

    async myBookingView() {
        const id = this.props.navigation.getParam("id");


        this.setState({
            loader: true,
        });

        let customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        const myBookingViewData = {
            access_token: Token,
            current_user_id: customer_id,
            id: id
        };
        // console.log(myBookingViewData)
        view_bulky_waste_pickup_by_idAction(myBookingViewData).then(
            (responseJson) => {
                // console.log(responseJson)
                if (responseJson.status == 1) {
                    this.setState({
                        myBookingView: responseJson.result,
                        loader: false,
                    });
                    // console.log(this.state.myBookingView)
                } else {
                    this.setState({ loader: false });
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }
        );
    }

    render() {

        const { navigate } = this.props.navigation;
        const { product, loader, address, date, note, myBookingView, city_id } = this.state;
        if (!loader) {

            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>

                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("MyBooking")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Back")}</Text>
                            </View>
                        </View>
                    </Row>
                    {/* <ScrollView>
                    <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : null}> */}

                    <Row style={{ height: 50, marginHorizontal: 20, marginBottom: 10 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{product}</Text>
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
                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Common")}</Text>
                        </View>
                        <Row style={{ marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{myBookingView.city_name}</Text>
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

                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Address")}</Text>
                        </View>
                        <Row style={{ marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{myBookingView.pickup_address}</Text>
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

                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Note")}</Text>
                        </View>
                        <Row style={{ marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{myBookingView.note}</Text>
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

                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("What should we withdraw?")}</Text>
                        </View>
                        <Row style={{ marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{myBookingView.product}</Text>
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
                        {myBookingView.pickup_date == null || myBookingView.pickup_date == '' ? (
                            <View></View>
                        ) : (
                            <View>
                                <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                                    <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Pick up date")}</Text>
                                </View>
                                <Row style={{ marginHorizontal: 20, height: 30 }}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{myBookingView.pickup_date}</Text>
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
                            </View>
                        )}


                    </ScrollView>

                    {/* </KeyboardAvoidingView>
                    </ScrollView> */}
                    <DropdownAlert ref={ref => this.dropdown = ref} />
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
                height: '16%',
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
    DownArrow: {
        width: 15,
        height: 15
    },
    service_colls: {
        borderBottomWidth: 1,
        borderColor: '#65be44',
        marginHorizontal: 20,
        marginTop: 10
        // borderRadius: 30,
    },
})