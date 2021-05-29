import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, TextInput, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { complaint_listAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
const { width, height } = Dimensions.get('window');

export default class AlertsList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            complainList: [],
            arrayholder: [],
            garbage_category_id: '',
            product_id: '',
            product_name: '',
            complain_id: ''


        }
    }

    componentDidMount() {
        // const garbage_category_id = this.props.navigation.getParam("garbage_category_id");
        // this.setState({category_id: garbage_category_id})
        this.complainList();


    }
    async complainList() {
        // const garbage_category_id = this.props.navigation.getParam("garbage_category_id");

        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const complainList = {
            access_token: Token,
            current_user_id: customer_id,

        }
        // console.log(complainList)
        this.setState({ loader: true })
        complaint_listAction(complainList).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    complainList: responseJson.result,
                    complain_id: responseJson.result.id,
                    arrayholder: responseJson.result,
                    loader: false,
                });

            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });
    }
    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            // <TouchableOpacity onPress={() => navigate("FavouriteList")}>
            <TouchableOpacity onPress={() => navigate("ComplainView", { complain_id: item.id })}>

                <Col style={{ paddingLeft: 20, paddingRight: 20, height: 60, marginBottom: 10 }}>
                    <Row style={{ alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 10, color: "#333" }}>{item.created_date}</Text>
                    </Row>
                    <Row style={{ alignItems: 'center', }}>
                        <Text numberOfLines={1} style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{item.title}</Text>
                    </Row>

                </Col>
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2, }}>
                    </Row>
                </LinearGradient>

            </TouchableOpacity>
        );

    }

    /** To search truck owner by name */
    SearchFilterFunction(text) {

        // the inserted text in textinput
        // const newData = this.state.cityList.filter(function (item) {
        // 	//applying filter for the inserted text in search bar
        // 	const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        // 	const textData = text.toUpperCase();
        // 	return itemData.indexOf(textData) > -1;
        // });

        let city = this.state.arrayholder
        let newData = city.filter((item) => {
            const itemData = item.complaint_description ? item.complaint_description.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            complainList: newData,
            // cityList: newData,
            search: text,
            // searchResult: 1,
            // selectedCity: "",
            // isCitySelected: 0,
            // selectedCityId: 0,
        });

    }

    onRefresh() {
        this.setState({ loader: true });
        this.complainList()
    }
    render() {
        const { navigate } = this.props.navigation;
        const { loader } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("Report")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Logo width={120} height={120} />
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <Logo width={120} height={120} style={styles.headerLogo} />
                            </View>
                        </View>
                    </Row>
                    <Row style={{ height: 50, marginTop: 30, marginBottom: 60 }}>
                        <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ padding: 2, marginRight: 20, marginLeft: 20, borderRadius: 8, borderColor: 'red', height: 80 }}>
                            <Row style={{ borderRadius: 8, backgroundColor: '#ffffff', justifyContent: 'center' }}>
                                <Col style={{ width: '80%', padding: 5, justifyContent: 'center' }}>
                                    <TextInput style={{ width: '100%', padding: 5, fontFamily: 'Roboto-Medium', fontSize: 16, color: '#62bb46' }}
                                        placeholder={t("Type")}
                                        placeholderTextColor='#62bb46'
                                        onChangeText={(text) => this.SearchFilterFunction(text)}
                                        value={this.state.search}>
                                    </TextInput>
                                </Col>
                                <Col style={{ width: '20%', padding: 5, justifyContent: 'center', }}>
                                    <Image source={require('../../images/surface2.png')} style={styles.searchIcon} />
                                </Col>
                            </Row>
                        </LinearGradient>
                    </Row>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>
                    <FlatList style={styles.FlatList}
                        // maxToRenderPerBatch={4}
                        onEndReachedThreshold={200}
                        // windowSize={15}
                        data={this.state.complainList}
                        renderItem={this.renderItem}
                        // initialNumToRender={4}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                        refreshControl={
                            <RefreshControl
                                colors={["#62bb46"]}
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
                    color="#62bb46"
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
        marginTop: 50,
        // marginTop: height - (height * 40) / 100,

    },

    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                // marginTop: 30,
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
                width: '100%',
                height: "88%",
            },
            android: {
                width: '100%',
                height: "95%"
            }
        })
    },
    searchIcon: {
        height: 50,
        width: 50
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
                marginLeft: width / 100 * 5,
            },
            android: {
                marginLeft: width / 100 * 5,
            }
        })

    }
})