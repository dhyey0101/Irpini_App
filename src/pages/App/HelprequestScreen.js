import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { view_product_by_idAction, user_request_mail_supportAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Green_Star from './../../images/Green_Star.svg';
import Redirect_Arrow_Gray from './../../images/Redirect_Arrow_Gray.svg';
import DropdownAlert from 'react-native-dropdownalert';


const { width, height } = Dimensions.get('window');

export default class HelprequestScreen extends Component {
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
            message: ''
        }
    }
    componentDidMount() {
        // this.ViewProduct();
    }
    // async ViewProduct() {
    //     const category_id = this.props.navigation.getParam("category_id");
    //     const product_id = this.props.navigation.getParam("product_id");
    //     const product_name = this.props.navigation.getParam("product_name");

    //     let customer_id = await AsyncStorage.getItem('userid');
    //     let Token = await AsyncStorage.getItem('token');
    //     const viewProductData = {
    //         access_token: Token,
    //         current_user_id: customer_id,
    //         product_id: product_id,
    //         category_id: category_id
    //     }
    //     this.setState({ loader: true })
    //     view_product_by_idAction(viewProductData, Token).then((responseJson) => {
    //         if (responseJson.status == 1) {
    //             this.setState({
    //                 dataSource: responseJson.result,
    //                 loader: false,
    //             });
    //         } else {
    //             this.setState({ loader: false });
    //             // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //         }
    //     });
    // }
    async SendMessage() {
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const messageData = {
            access_token: Token,
            current_user_id: customer_id,
            message: this.state.message,
        }
        // console.log(messageData)
        this.setState({ loader: true })
        user_request_mail_supportAction(messageData, Token).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    loader: false,
                    message:''
                });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            }
        });
    }


    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, loader, message } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("HelpRequest")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Fill in the form")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("HelpRequest")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Fill in the form")}</Text>
                            </View>
                        </View>
                    </Row>
                    <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "height" : null}>
                        <ScrollView>
                            <Row style={{ height: 50, marginHorizontal: 20 }}>
                                <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#333", fontSize: 24, fontFamily: "Roboto-Bold", color: "#62BB46" }}>{t("Write us your problem")}</Text>
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

                            <Row style={{ marginHorizontal: 20, marginTop: 20, height: 60 }}>
                                <Text style={{ fontSize: 16, fontFamily: "Roboto-Light", color: "#666666" }}>{t("Fill out and submit the form, we will solve your problem as soon as possible")}</Text>
                            </Row>
                            <Row style={{ marginHorizontal: 20, height: 20 }}>
                                <Col style={{ width: 40 }}>
                                    <Image
                                        style={{ height: 25, width: 25 }}
                                        source={require("../../images/Pen.png")}
                                    />
                                </Col>
                                <Col>
                                    <Text style={{ fontSize: 20, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("FILL IN THE FORM")}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginHorizontal: 20 }}>
                                <TextInput style={{ backgroundColor: 'red', width: "100%", height: 250, marginTop: 20, backgroundColor: '#f8f8f8', textAlign: 'justify',textAlignVertical: "top",paddingLeft:15,paddingTop:15 }}
                                    placeholder={t("Write your message here")}
                                    placeholderTextColor={"#65be44"}
                                    multiline
                                    numberOfLines={4}
                                    value={message}
                                    onChangeText={(message) => this.setState({message:message})}
                                >
                                </TextInput>

                                <Col style={{ justifyContent: 'center', alignItems:'center', marginLeft: "80%", bottom: 10, position: "absolute" }}>
                                    <TouchableOpacity style={{padding:25}} onPress={() => this.SendMessage()}>
                                        <Redirect_Arrow_Gray />
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
                marginLeft: 25
            },
            android: {
                marginLeft: 18
            }
        })

    }
})