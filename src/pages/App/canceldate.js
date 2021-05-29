import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, StatusBar, FlatList, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarList, Calendar } from 'react-native-calendars';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { t } from '../../../locals';
import { schedule_list_by_category_idAction } from './../../util/Action';


export default class CalendarScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            selectedDate: [],
            canceledDate: [],
            loader: false

        }
    }
    onRefresh() {
        this.setState({ loader: true });
    }
    componentDidMount() {
        this.CalendarInfo();
    }

    async CalendarInfo() {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        const category_id = this.props.navigation.getParam("garbage_category_id");
        let Token = await AsyncStorage.getItem('token');
        const calenderData = {
            current_user_id: customer_id,
            category_id: category_id,
            access_token: Token,
        }
        // console.log(calenderData)
        var response = schedule_list_by_category_idAction(calenderData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    selectedDate: responseJson.result,
                    canceledDate: responseJson.cancel_schedule,
                    loader: false
                });

            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;

        return (
            <View>
                <Col style={{ marginLeft: 30, marginRight: 30, marginTop: 10 }}>
                    <Row style={{ width: "70%" }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Medium', color: '#62bb46' }}>{item.title}</Text>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Light', color: '#666666' }}>{item.description}</Text>
                    </Row>
                </Col>

            </View>
        );

    }
    render() {
        const { navigate } = this.props.navigation;
        const { selectedDate, canceledDate, loader } = this.state;


        var votes = {};

        selectedDate.forEach((selectedDate, key) => {
            var productID = selectedDate;
            votes[productID] = {
                selected: true, selectedColor: '#65be44', disableTouchEvent: true
            }
        });
        canceledDate.forEach((canceledDate, key) => {
            var productID = canceledDate.cancle_date;
            votes[productID] = {
                selected: true, selectedColor: '#c2272d'
            }
        });
        if (!loader) {
            return (

                <View style={styles.container}>
                    {/* <Text style={{ textAlign: 'center'}}>Comingsoon..</Text> */}
                    {/* <Row style={styles.NavBar}>
                    <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                    <Row style={styles.slide2Logo}>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10, width: 50, }} onPress={() => navigate("CategoryList")}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Back_Arrow width={15} height={15} />
                            </Col>
                        </TouchableOpacity>
                        <Col>
                            <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Multi-material calendar")}</Text>
                        </Col>
                    </Row>
                </Row> */}

                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("CategoryList")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("News from the municipality")}</Text>
                            </View>
                        </View>
                    </Row>
                    <FlatList style={styles.FlatList}
                        // maxToRenderPerBatch={4}
                        onEndReachedThreshold={200}
                        // windowSize={15}
                        data={canceledDate}
                        renderItem={this.renderItem}
                        // initialNumToRender={4}
                        // keyExtractor={(item) => item.category_id.toString()}
                        ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
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
    container: {
        // flex: 1,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 45,
                width: '100%',
                alignItems: 'center',
                marginLeft: 50
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 40,
                height: 50,
                width: '100%',
                marginLeft: 50
            }
        })
    },
    NavBar: {
        ...Platform.select({
            ios: {
                // marginTop: 60,
                height: 102,

            },
            android: {
                marginTop: 30,
                height: 102
            }
        })
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20%",
        // marginTop: height - (height * 40) / 100,

    },
    emptyText: {
        // flex: 1,
        justifyContent: "center",
        fontSize: 23,
        alignItems: 'center',
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

})