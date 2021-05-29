import React, { Component } from 'react';
import { ScrollView, Modal, FlatList, TextInput, ActivityIndicator, RefreshControl, Platform, TouchableHighlight, Dimensions, Animated, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { extend } from 'validate.js';
import Logo from './../../images/logo.svg';
import Category from './../../images/Category.svg';
import Map from './../../images/Map.svg';
import { t } from '../../../locals';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from 'reanimated-bottom-sheet';
import { complaint_listAction, get_term_and_condition_reportingAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import HTML from "react-native-render-html";


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
            isOpen: true,
            Role: '',
            modalVisible: true,
            popupData: '',
            complainList: [],
            arrayholder: [],
            garbage_category_id: '',
            product_id: '',
            product_name: '',
            complain_id: ''
        }
    }
    closeModal = (visible) => {
        this.setState({ modalVisible: visible });
    };
    async componentDidMount() {
        const { navigation } = this.props;
        let Role = await AsyncStorage.getItem('role');
        this.setState({ Role: Role })

        if (Role == "corporate") {
            this.onOpen();
        }
        this.complainList();
        this.focusListener = navigation.addListener("didFocus", () => {
            if (Role == "corporate") {
                this.onOpen();
            }
        });
        this.popup();
    }
    async componentWillUnmount() {
        this.focusListener.remove();
    }
    popup() {
        this.setState({ loader: true })
        get_term_and_condition_reportingAction().then(function (responseJson) {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    popupData: responseJson.result.wpnc_term_and_condition_reporting,
                    loader: false
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async complainList() {
        // const garbage_category_id = this.props.navigation.getParam("garbage_category_id");

        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const complainList = {
            access_token: Token,
            current_user_id: customer_id,

        }
        this.setState({ loader: true })
        complaint_listAction(complainList).then((responseJson) => {
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
            <TouchableOpacity onPress={() => navigate("ComplainView", { complain_id: item.id, date: item.created_date })}>

                <Col style={{ paddingLeft: 20, paddingRight: 20, height: 60, marginBottom: 10 }}>
                    <Row style={{ alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 10, color: "#333" }}>{item.created_date}</Text>
                    </Row>
                    <Row style={{ alignItems: 'center', }}>
                        <Text numberOfLines={1} style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{item.complaint_description}</Text>
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
        const { garbage_category_id, } = this.state;
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    height: 550,
                }}
            >
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
                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('CreateReport'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('Create a report')}
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

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('AlertsList'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('List of alerts')}
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

                <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('AllComplainList'); }} style={styles.menuItem}>
                    <Row style={styles.profileListRow}>
                        <Col>
                            <Text style={styles.text}>
                                {t('My recommendations')}
                            </Text>
                        </Col>
                    </Row>
                </TouchableHighlight>
            </View>
        )

    };
    render() {
        const { navigate } = this.props.navigation;
        const { Role, loader, modalVisible, popupData } = this.state;

        var a = height - 215;
        var snap = height - a;
        if (Role == 'corporate') {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <StatusBar />
                    {/* <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <Logo width={120} height={120} style={styles.headerLogo} />
                            </View>
                        </View>
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
                                        <View style={{ alignItems: 'center', marginBottom: 10, width: "100%" }}>
                                            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{t("Reports")}</Text>
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
                        color="#62bb46"
                    />
                )
            }
        }
    }
}
const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
// empty component
const EmptyComponent = ({ title }) => (

    <View style={styles.emptyContainer}>

        <Text style={styles.emptyText}>{title}</Text>

    </View>

);
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
                height: '13%',
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