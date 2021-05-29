import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { favorite_product_list_by_category_idAction, add_favorite_productAction, view_product_by_idAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Profile from './Profile';

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
            loader: false,
            isfavourite: 0,
            dataSource: [],
            product_id: '',
        }
    }

    componentDidMount() {
        this.setState({ loader: true })
        const selectedCategoryName = this.props.navigation.getParam("category_name");
        const selectedCategoryImage = this.props.navigation.getParam("selectedCategoryImage");
        this.setState({ 
            selectedCategoryName: selectedCategoryName,
            selectedCategoryImage: selectedCategoryImage           
        });
        this.favouriteProductCategory();
        this.setState({ loader: false })
    }
    async favouriteProductCategory() {
        this.setState({ loader: true })

        const category_id = this.props.navigation.getParam("category_id");
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const favourite_product_Category = {
            access_token: Token,
            current_user_id: customer_id,
            category_id: category_id
        }
        favorite_product_list_by_category_idAction(favourite_product_Category, Token).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    category_name: responseJson.result.favorite_products,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });
    }

    async favourite(product_id) {

        this.setState({ loader: true })

        const { navigate } = this.props.navigation;

        const { isfavourite } = this.state;
        this.setState({ isfavourite: !isfavourite })

        const category_id = this.props.navigation.getParam("category_id");
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const favouriteData = {
            access_token: Token,
            current_user_id: customer_id,
            product_id: product_id,
            category_id: category_id
        }
        // console.log(favouriteData)
        add_favorite_productAction(favouriteData).then((responseJson) => {
            if (responseJson.status == 1) {
                this.setState({
                    // isfavourite: responseJson.result.favorite_status,
                    loader: false,
                });
                navigate("Profile");
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });

    }
    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const category_id = this.props.navigation.getParam("category_id");
        const { isfavourite } = this.state;
        return (
            // <TouchableOpacity onPress={() => navigate("FavouriteList")}>
            <TouchableOpacity onPress={() => navigate("FavouriteProductDescription", { category_id: category_id, product_id: item.product_id, product_name: item.product_name })}>
                <Row style={{ height: 60, paddingHorizontal: 20 }}>
                    <Col style={{ justifyContent: 'center', width: "90%" }}>
                        <Text numberOfLines={1} style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{item.product_name}</Text>
                    </Col>
                    <TouchableOpacity onPress={() => this.favourite(item.product_id)}>
                        <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Image source={require('../../images/Star.png')} style={{ width: 30, height: 30 }} />
                        </Col>
                    </TouchableOpacity>
                </Row>
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

    render() {
        const { navigate } = this.props.navigation;
        const { loader, selectedCategoryImage, selectedCategoryName } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("Profile")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Favorites")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Profile")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Favorites")}</Text>
                            </View>
                        </View>
                    </Row>
                    <Row style={styles.seconddiv}>

                        <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 28, fontFamily: "Roboto-Bold", color: "#62BB46" }}>{selectedCategoryName}</Text>
                        </Col>
                        <Col style={{ alignItems: 'flex-end', width: 50 }}>
                            {/* <Plastic_Bottle_2 /> */}
                            <Image source={{ uri: selectedCategoryImage}} style={{ width: 70, height: 70 }} />
                            
                        </Col>
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
                        data={this.state.category_name}
                        renderItem={this.renderItem}
                        // initialNumToRender={4}
                        keyExtractor={(item) => item.product_id.toString()}
                        ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                    // refreshControl={
                    //     <RefreshControl
                    //         colors={["#d62326"]}
                    //         refreshing={this.state.loading}
                    //         onRefresh={this.onRefresh.bind(this)}
                    //     />
                    // }
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
        width: sWidth,
        height: 90,
        backgroundColor: '#fff'
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
    seconddiv: {
        ...Platform.select({
            ios: {
                height: 90,
                marginTop: 30,
            },
            android: {
                height: 90,
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
                marginLeft: 40
            },
            android: {
                marginLeft: 30
            }
        })

    }
})