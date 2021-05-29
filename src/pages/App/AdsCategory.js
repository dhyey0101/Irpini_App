import React, { Component } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, Dimensions, RefreshControl } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import {  getMarketPlaceCategories } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
const { width, height } = Dimensions.get('window');

export default class AdsCategory extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loader: false

        }
    }

    componentDidMount() {
        this.getMarketPlaceCategoriesAction();
    }
    async getMarketPlaceCategoriesAction() {
        
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const dataForGetMarketplaceCategories = {
            access_token: Token,
            current_user_id: customer_id,
        }
        this.setState({ loader: true })
        // console.log(dataForGetMarketplaceCategories)
        getMarketPlaceCategories(dataForGetMarketplaceCategories).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    categories: responseJson.result,
                    loader: false,
                });
                // console.log(this.state.categories);
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });
    }

    onRefresh() {
        this.setState({ loader: true });
        this.getMarketPlaceCategoriesAction();
    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            // <TouchableOpacity onPress={() => navigate("FavouriteList")}>
            <TouchableOpacity onPress={() => navigate("MarketPlaceAdsSubCategory", { category_id: item.category_id, category_name: item.category_name })}>
                
                <Row style={{ height: 60, paddingHorizontal: 20, alignItems:'center' }}>
                    <Col style={{ justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: "#333", fontSize: 20, fontFamily: "Roboto-Medium" }}>{item.category_name}</Text>
                    </Col>
                    <Col style={{ width: "15%", height:30, justifyContent:'center', alignItems:'center', backgroundColor:'#bebebe', borderRadius: 20 }}>
                        <Text numberOfLines={1} style={{ color: "#696767", fontSize: 20, fontFamily: "Roboto-Medium" }}>{item.product_count}</Text>
                    </Col>
                </Row>
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                    style={{marginLeft:"2%"}}
                >
                    <Row style={{ height: 2 }}>
                    </Row>
                </LinearGradient>
            </TouchableOpacity>
        );

    }
    render() {
        const { navigate } = this.props.navigation;
        const {loader} = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("FleaMarket")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold'  }}>{t("Flea Market")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("FleaMarket")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}> {t("Flea Market")}</Text>
                            </View>
                        </View>
                    </Row>
                    <Row style={{ height: 60, marginHorizontal: 20 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("Categories")}</Text>
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
                    <Row style={{height:40}}></Row>
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
                        data={this.state.categories}
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
                height: "95%",
                // marginTop:30
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
    header:{
        ...Platform.select({
            ios:{
                marginLeft: 40 
            },
            android:{
                marginLeft: 30
                // marginLeft: width/100*10,
            }
        })
        
    }
})