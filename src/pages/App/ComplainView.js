import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { view_complaint_by_idAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Redirect_Arrow_Gray from './../../images/Redirect_Arrow_Gray.svg';

const { width, height } = Dimensions.get('window');

export default class ComplainView extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            complainView: [],
            loader: true,
            fromRoute: "",
            ImageLoading: true,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.complainView();
        });
        const fromRoute = this.props.navigation.getParam("from_route");
        this.setState({
            // category_name: category_name,
            // title: title,
            fromRoute: fromRoute,
        });


    }

    async complainView() {
        this.setState({ loader: true })
        const complain_id = this.props.navigation.getParam("complain_id");
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const complainViewData = {
            access_token: Token,
            current_user_id: customer_id,
            complaint_id: complain_id,
            complainImage: '',
        }

        let resopnse = await view_complaint_by_idAction(complainViewData, Token).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    complainView: responseJson.result,
                    complainImage: responseJson.result.complaint_photo,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.setState({
            fromRoute: ''
        })
    }

    _onLoadEndImage() {
        this.setState({
            ImageLoading: false
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { loader, complainView, fromRoute, complainImage } = this.state;
        // alert(loader)
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("AlertsList")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("List of alerts")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow}
                                    // onPress={() => navigate("AlertsList")}
                                    onPress={() => {
                                        if (fromRoute == "AllComplains") {
                                            navigate("AllComplainList");
                                        } else {
                                            // navigate to service order view screen
                                            navigate("AlertsList");
                                        }
                                    }}
                                >
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                {/* <Text style={styles.headerText}>{t("List of alerts")}</Text> */}
                                {fromRoute == "AllComplains" ? (
                                    <Text
                                        numberOfLines={1}
                                        style={styles.headerText}
                                    >

                                        {t("Back")}
                                    </Text>
                                ) : (
                                    <Text
                                        numberOfLines={1}
                                        style={styles.headerText}
                                    >
                                        {t("List of alerts")}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </Row>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                        {/* <Row style={{ height: 50, marginHorizontal: 20, alignItems: 'center' }}>
                        <Col style={{ justifyContent: 'center' }}> */}
                        <Text style={{ fontSize: 24, textAlign: 'center', fontFamily: "Roboto-Bold", color: "#62BB46" }}>{complainView.title} <Text style={{ fontSize: 10 }}>{complainView.created_date}</Text></Text>
                        {/* </Col>
                    </Row> */}
                    </View>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>
                    <ScrollView>
                        <Row style={{ justifyContent: 'center', marginTop: 20, }}>
                            <Image
                                onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                // onLoadStart={(e) => console.log('Load start')} 
                                // onLoadEnd={this._onLoadEndImage} 
                                // source={complainImage ? { uri: complainImage } : null}
                                // source={complainImage ? { uri: complainImage } : null}
                                source={{ uri: this.state.complainImage }}
                                style={styles.Image}
                            />
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                animating={this.state.ImageLoading}
                                size="small"
                                color="#65be44"
                            />
                        </Row>
                        <Row style={{ marginHorizontal: 20, marginTop: 10, backgroundColor: '#f8f8f8', paddingHorizontal: 10, marginTop: 20, borderRadius: 5, height: 150, paddingVertical: 10 }}>
                            <Text style={{ fontFamily: 'Roboto-Light', color: "#666666", fontSize: 16 }}>{complainView.complaint_description}</Text>
                        </Row>

                        <Row style={{ marginTop: 10, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Geographic coordinates")}</Text>
                        </Row>
                        <Row style={{ marginTop: 10, marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{complainView.latitude} {complainView.longitude}</Text>
                            </Col>
                            <TouchableOpacity style={{ alignItems: 'center', width: 50, paddingTop: 10 }} onPress={() => navigate("ComplainMapView", { latitude: complainView.latitude, longitude: complainView.longitude })}>
                                <Col>
                                    <Redirect_Arrow_Gray />
                                </Col>
                            </TouchableOpacity>
                        </Row>
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                            style={{ marginHorizontal: 20 }}
                        >
                            <Row style={{ height: 2, }}>
                            </Row>
                        </LinearGradient>
                        <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                            <Text style={{ color: "#666", fontFamily: 'Roboto-Regular' }}>{t("Common")}</Text>
                        </View>
                        <Row style={{ marginTop: 10, marginHorizontal: 20, height: 30 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#4D4D4D", fontFamily: 'Roboto-Medium' }}>{complainView.city_name}</Text>
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
                    </ScrollView>
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
// empty component
const EmptyComponent = ({ title }) => (

    <View style={styles.emptyContainer}>

        <Text style={styles.emptyText}>{title}</Text>

    </View>

);
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
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        // marginTop: height - (height * 40) / 100,

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
    FlatList: {
        ...Platform.select({
            ios: {
                width: '98%',
                height: "88%",
            },
            android: {
                width: '98%',
                height: "95%"
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
    header: {
        ...Platform.select({
            ios: {
                marginLeft: width / 100 * 7,
            },
            android: {
                marginLeft: width / 100 * 7,
            }
        })

    },
    Image: {
        alignItems: "center",
        justifyContent: "center",
        // height: 90,
        marginTop: 5,
        width: Dimensions.get("window").width * 80 / 100,
        // borderRadius: 100,
        // marginLeft: 10,
        height: Dimensions.get("window").height * 25 / 100,
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})