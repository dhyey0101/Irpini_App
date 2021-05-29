import React, { Component } from 'react';
import { Animated, TouchableHighlight, Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { garbage_category_listAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Green_Star from './../../images/Green_Star.svg';
import BottomSheet from 'reanimated-bottom-sheet';
import categoryIcons from './categoryIcons.js';
import { back } from 'react-native/Libraries/Animated/src/Easing';

const { width, height } = Dimensions.get('window');

export default class FevouriteList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.sheetRef = React.createRef(null);
        this.state = {
            favourite_product_Category: [],
            dataSource: [],
            garbage_category_list: [],
            garbage_category_id: '',
            categoryIcons: '',
            opacity: new Animated.Value(0),
            isOpen: false,
            selectedCategoryName: '',
            selectedCategoryImage: ''
        }
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
                onPress={this.onClose}
            />
        </Animated.View>
    );

    componentDidMount() {
        this.getgarbage_category_list();
    }
    async getgarbage_category_list() {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const requestData = {
            access_token: Token,
            current_user_id: customer_id
        }
        garbage_category_listAction(requestData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    garbage_category_list: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    onRefresh() {
        this.setState({ loader: true });
        this.getgarbage_category_list();
    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        // const sheetRef = React.createRef(null);
        return (
            <TouchableOpacity onPressOut={() => this.setState({ garbage_category_id: item.category_id, selectedCategoryName: item.category_name, selectedCategoryImage : item.cat_image })} onPress={() => this.onOpen()} style={{ width: '45%', margin: 10, alignItems: 'center' }}>
                {/* <TouchableOpacity onPressOut={() => this.setState({ garbage_category_id: item.category_id })} onPress={() => this.sheetRef.current.snapTo(1)} style={{ width: '45%', margin: 10, alignItems: 'center' }}> */}
                <Col style={styles.newsItemContainer}>
                    <Row style={{ height: 80, width: '100%', justifyContent: 'center' }}>
                        {/* <Image source={categoryIcons[item.cat_slug]} style={styles.ImageList} /> */}
                        <Image source={{ uri: item.cat_image}} style={styles.ImageList} />
                    </Row>
                    <Row style={{ height: 50, marginTop: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#1A1A1A", fontFamily: 'Roboto-Medium', fontSize: 15 }}>{item.category_name}</Text>
                    </Row>
                </Col>
            </TouchableOpacity>
        );
    }

    renderContent = () => {
        const { navigate } = this.props.navigation;
        const { garbage_category_id, selectedCategoryName, selectedCategoryImage } = this.state;
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    height: 450,
                }}
            >
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                // style={{ marginHorizontal: 20 }}
                >
                    <Row style={{ height: 2, }}>
                    </Row>
                </LinearGradient>
                <TouchableHighlight underlayColor="#67BD44" style={{ height: 80 }} onPress={() => { navigate("Information", { garbage_category_id: garbage_category_id, selectedCategoryName: selectedCategoryName, selectedCategoryImage: selectedCategoryImage }), this.sheetRef.current.snapTo(2) }}>
                    <Col style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#333", paddingVertical: 20 }}>{t("Information")}</Text>
                    </Col>
                </TouchableHighlight>
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                // style={{ marginHorizontal: 20 }}
                >
                    <Row style={{ height: 2, }}>

                    </Row>
                </LinearGradient>
                <TouchableHighlight underlayColor="#67BD44" style={{ height: 80 }} onPress={() => { navigate("Calendar", { garbage_category_id: garbage_category_id, selectedCategoryName: selectedCategoryName }), this.sheetRef.current.snapTo(2) }}>
                    <Col style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#333", paddingVertical: 20 }}>{t("Calendar")}</Text>
                    </Col>
                </TouchableHighlight>
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                // style={{ marginHorizontal: 20 }}
                >
                    <Row style={{ height: 2, }}>
                    </Row>
                </LinearGradient>
                <TouchableHighlight underlayColor="#67BD44" style={{ height: 80 }} onPress={() => { navigate("canceldate", { garbage_category_id: garbage_category_id }), this.sheetRef.current.snapTo(2) }}>
                    <Col style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#333", paddingVertical: 20 }}>{t("News from the municipality")}</Text>
                    </Col>
                </TouchableHighlight>
            </View>
        )

    };

    render() {
        // const sheetRef = React.createRef(null);
        const { navigate } = this.props.navigation;
        const { dataSource, loader, isOpen } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 102 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'flex-end', paddingVertical: 20, width: 80 }} onPress={() => navigate("Waste")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{isOpen ? this.state.selectedCategoryName: t("Waste categories")}</Text>
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
                                <Text style={styles.headerText}>{isOpen ? this.state.selectedCategoryName : t("Waste categories")}</Text>
                            </View>
                        </View>
                    </Row>
                    <Row style={styles.FlatListRow}>
                        <FlatList
                            // maxToRenderPerBatch={4}
                            // columnWrapperStyle={{justifyContent: 'space-between'}}
                            onEndReachedThreshold={200}
                            // windowSize={15}
                            numColumns={2}
                            data={this.state.garbage_category_list}
                            renderItem={this.renderItem}
                            // initialNumToRender={4}
                            keyExtractor={(item) => item.category_id.toString()}
                            ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                            refreshControl={
                                <RefreshControl
                                    colors={["#65be44"]}
                                    refreshing={this.state.loading}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        />
                    </Row>
                    {this.state.isOpen && this.renderBackDrop()}

                    <BottomSheet
                        ref={this.sheetRef}
                        // snapPoints={[0, 240, 0]}
                        // borderRadius={10}
                        enabledContentGestureInteraction={false}
                        renderContent={this.renderContent}

                        snapPoints={[
                            '-10%',
                            height * 0.5,
                            height * 0.35,
                            height * 0.85,
                        ]}
                        initialSnap={0}
                        //   renderHeader={this.renderHeader}
                        //   renderContent={this.renderInner}
                        onCloseEnd={this.onClose}
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
    emptyContainer: {

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
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 30,
                alignSelf: 'center',
                width: '100%',
                alignItems: 'center',
                // marginLeft: 50,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                // marginLeft: 50,
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
    newsItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // margin:15,
        // marginRight:50,
        // padding: 10,
        height: 150,
        backgroundColor: "white",
        shadowColor: "#333333",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.2,
        shadowRadius: 6.22,
        elevation: 5,
    },
    ImageList: {
        alignItems: "center",
        justifyContent: "center",
        // height: 90,
        width: 80,
        // borderRadius: 100,
        // marginLeft: 10,
        height: 80,
    },
    header: {
        ...Platform.select({
            ios: {
                marginLeft: width / 100 * 12,
            },
            android: {
                marginLeft: width / 100 * 12,
            }
        })

    },
    FlatListRow:{
        ...Platform.select({
            ios:{

            },
            android:{
                paddingVertical: "10%"
            }
        })
    }
})


