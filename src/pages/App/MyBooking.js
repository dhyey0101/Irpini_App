import React, { Component } from 'react';
import { ActivityIndicator, FlatList, AsyncStorage, StyleSheet, View, RefreshControl, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import Logo from './../../images/logo.svg';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { get_own_bulky_waste_pickup_listAction } from '../../util/Action';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../locals';

export default class MyBooking extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            myBookingList: [],
            arrayholder: [],
            myBooking_category_id: '',
            product_id: '',
            product_name: '',
        }
    }

    componentDidMount() {
        this.myBookinglist()
    }

    onRefresh() {
        this.setState({ loader: true, myBookingList: [], });
        this.myBookinglist();
    }

    async myBookinglist() {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        const myBookingData = {
            access_token: Token,
            current_user_id: customer_id,
        };
        // console.log(myBookingData)
        get_own_bulky_waste_pickup_listAction(myBookingData).then(
            (responseJson) => {
                // console.log(responseJson)
                if (responseJson.status == 1) {
                    this.setState({
                        myBookingList: responseJson.result,
                        loader: false,
                    });
                    // console.log(this.state.myBookingList)
                } else {
                    this.setState({ loader: false });
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }
        );
    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate("MyBookingView",{id: item.id, product: item.product});
                }}
                style={{ width: '100%' }}
            >
                <Row style={{ height: 60, paddingHorizontal: 20 }}>
                    <Col style={{ justifyContent: "center", }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: "#333",
                                fontSize: 25,
                                fontFamily: "Roboto-Medium",
                            }}
                        >
                            {item.product}
                        </Text>
                    </Col>
                    <Col style={{ paddingTop: 5 }}>
                        {item.pickup_status == "0" ? (
                            <Text
                                style={{
                                    color: "#edda1b",
                                    fontSize: 15,
                                    fontFamily: "Roboto-Medium",
                                    justifyContent: "flex-end",
                                    textAlign: "right",
                                }}
                            >
                                {t("WAITING")}
                            </Text>
                        ) : item.pickup_status == "1" ? (
                            <Text
                                style={{
                                    color: "#edda1b",
                                    fontSize: 15,
                                    fontFamily: "Roboto-Medium",
                                    justifyContent: "flex-end",
                                    textAlign: "right",
                                }}
                            >
                                {t("UNDER PROCESSING")}
                            </Text>
                        ) : item.pickup_status == "2" ? (
                            <Text
                                style={{
                                    color: "#2ba717",
                                    fontSize: 15,
                                    fontFamily: "Roboto-Medium",
                                    justifyContent: "flex-end",
                                    textAlign: "right",
                                }}
                            >
                                {t("COMPLETED")}
                            </Text>
                        
                        ) : item.pickup_status == "3" ? (
                            <Text
                                style={{
                                    color: "#edda1b",
                                    fontSize: 15,
                                    fontFamily: "Roboto-Medium",
                                    justifyContent: "flex-end",
                                    textAlign: "right",
                                }}
                            >
                                {t("TAKING IN CHARGE")}
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    color: "#ed0015",
                                    fontSize: 15,
                                    fontFamily: "Roboto-Medium",
                                    justifyContent: "flex-end",
                                    textAlign: "right",
                                }}
                            >
                                {t("CANCELED")}
                            </Text>
                        )}
                    </Col>
                </Row>
                <LinearGradient
                    colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={{marginLeft:'2%'}}
                >
                    <Row style={{ height: 2 }}></Row>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    render() {
        const { navigate } = this.props.navigation;
        const { Role, isChecked, name, email, Create_password, Confirm_password, loader, termAndCondition, modalVisible } = this.state
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Withdrawal")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Logo width={120} height={120} style={styles.headerLogo} />
                            </View>
                        </View>
                    </Row>
                    <Row style={{ height: 50, marginHorizontal: 20, marginBottom: 10 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 24, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("My reservations")}</Text>
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
                    <LinearGradient style={{marginTop: 30}}
                        colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                        start={{ x: 0.0, y: 1.0 }}
                        end={{ x: 1.0, y: 1.0 }}
                    >
                        <Row style={{ height: 2 }}></Row>
                    </LinearGradient>
                    <FlatList
                        style={styles.FlatList}
                        // maxToRenderPerBatch={4}
                        onEndReachedThreshold={200}
                        // windowSize={15}
                        data={this.state.myBookingList}
                        renderItem={this.renderItem}
                        // initialNumToRender={4}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={
                            <EmptyComponent title={t("Data not available")} />
                        }
                        refreshControl={
                            <RefreshControl
                                colors={["#65be44"]}
                                refreshing={this.state.loading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#65be44"
                />
            )
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
    FlatList: {
        ...Platform.select({
            ios: {
                width: "98%",
                height: "88%",
            },
            android: {
                width: "98%",
                height: "95%",
                // marginTop:30
            },
        }),
    },
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
                zIndex: 1
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

        ...Platform.select({
            ios: {
                marginTop: sHeight * 0.15,
                fontSize: 25,
                fontWeight: 'bold',
                color: '#fff'
            },
            android: {
                marginTop: sHeight * 0.143,
                fontSize: 25,
                fontWeight: 'bold',
                color: '#fff'
            }
        })
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
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        // marginTop: height - (height * 40) / 100,
    },
})
