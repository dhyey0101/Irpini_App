import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, TextInput, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Platform, Modal, Animated } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { own_complaint_listAction, disableReport, enableReport, deleteReport } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import BottomSheet from 'reanimated-bottom-sheet';
// import Modal from 'react-native-modal';


const { width, height } = Dimensions.get('window');

export default class AllComplainList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };

  constructor(props) {
    super(props);
    this.sheetRef = React.createRef(null);
    this.sheetRef2 = React.createRef(null);
    this.state = {
      loader: false,
      AllcomplainList: [],
      arrayholder: [],
      garbage_category_id: '',
      product_id: '',
      product_name: '',
      complain_id: '',
      modalVisible: false,
      currentSelectedAddID: "",
      currentSelectedAddTitle: "",
      currentSelectedAddStatus: "",
      opacity: new Animated.Value(0),
      isOpen: false,
      isOpenStatusChange: false,

    }
  }

  setModalVisible = (id, title, status, visible) => {
    this.setState({
      currentSelectedAddID: id,
      currentSelectedAddTitle: title,
      currentSelectedAddStatus: status,
    });
    this.setState({ modalVisible: visible });
  };

  closeModal = (visible) => {
    this.setState({ modalVisible: visible });
  };

  navigateToViewScreen = () => {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("ComplainView", { title: this.state.currentSelectedAddTitle, complain_id: this.state.currentSelectedAddID, from_route: 'AllComplains' })

  };

  componentDidMount() {
    // const garbage_category_id = this.props.navigation.getParam("garbage_category_id");
    // this.setState({category_id: garbage_category_id})
    this.AllcomplainList();


  }
  async AllcomplainList() {
    // const garbage_category_id = this.props.navigation.getParam("garbage_category_id");
    this.setState({ loader: true })
    let customer_id = await AsyncStorage.getItem('userid');
    let Token = await AsyncStorage.getItem('token');
    const AllcomplainList = {
      access_token: Token,
      current_user_id: customer_id,

    }

    own_complaint_listAction(AllcomplainList).then((responseJson) => {
      // console.log(responseJson)
      if (responseJson.status == 1) {
        this.setState({
          AllcomplainList: responseJson.result,
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
    // console.log(item)
    return (
      // <TouchableOpacity onPress={() => navigate("FavouriteList")}>
      // <TouchableOpacity onPress={() => { this.setModalVisible(true); }}>
      <TouchableOpacity
        onPress={() => {
          this.setModalVisible(item.id, item.title, item.complaint_status, true);
        }}
      >

        <Col style={{ paddingLeft: 20, paddingRight: 20, height: 60, marginBottom: 10 }}>
          <Row style={{ alignItems: 'center' }}>
            <Col>
              <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 10, color: "#333" }}>{item.created_date}</Text>
            </Col>
            {item.complaint_status == 0 ? (
              <Col style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 12, color: "#17A517" }}>{t("OPEN")}</Text>
              </Col>
            ) : (
              <Col style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 12, color: "#B52912" }}>{t("CLOSE")}</Text>
              </Col>
            )}

          </Row>
          <Col>
            <Text numberOfLines={1} style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium" }}>{item.title}</Text>
          </Col>

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
      AllcomplainList: newData,
      // cityList: newData,
      search: text,
      // searchResult: 1,
      // selectedCity: "",
      // isCitySelected: 0,
      // selectedCityId: 0,
    });

  }

  onRefresh() {
    this.setState({ loader: true, currentSelectedAddID: '', currentSelectedAddTitle: '', currentSelectedAddStatus: "", AllcomplainList: [] });
    this.AllcomplainList()
  }

  async deleteAdsAction() {
    this.setState({ loader: true });
    let customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    const dataForGetMarketplaceCategories = {
      access_token: Token,
      current_user_id: customer_id,
      complaint_id: this.state.currentSelectedAddID
    };

    deleteReport(dataForGetMarketplaceCategories).then(
      (responseJson) => {
        if (responseJson.status == 1) {
          this.setState({
            loader: false,
            currentSelectedAddID: ''
          });
          this.onRefresh();
          // this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
          this.props.navigation.navigate('SuccessPageDeleteMessage');
        } else {
          this.onRefresh();
          this.setState({ loader: false, currentSelectedAddID: '' });
          // this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
          this.props.navigation.navigate('errorpage', { route_name: 'delete_report' });
        }
      }
    );
  }

  async changeActiveStatusOfMyAd() {
    this.setState({ loader: true });
    let customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    const dataForGetMarketplaceCategories = {
      access_token: Token,
      current_user_id: customer_id,
      complaint_id: this.state.currentSelectedAddID
    };
    // console.log(this.state.currentSelectedAddStatus)
    // console.log(dataForGetMarketplaceCategories)
    if (this.state.currentSelectedAddStatus == "0") {
      // console.log("disavle API")
      disableReport(dataForGetMarketplaceCategories).then(
        (responseJson) => {
          // console.log(responseJson)
          if (responseJson.status == 1) {
            this.setState({
              loader: false,
              currentSelectedAddID: '',
            });

            // this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            this.props.navigation.navigate("SuccessPageDisableMessage");
            this.onRefresh();
          } else {

            this.setState({ loader: false, currentSelectedAddID: '' });
            // this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            this.props.navigation.navigate('errorpage', { route_name: 'disable_report' });
            this.onRefresh();
          }
        }
      );
    } else {
      // console.log("enable API")
      enableReport(dataForGetMarketplaceCategories).then(
        (responseJson) => {
          // console.log(responseJson)
          if (responseJson.status == 1) {
            this.setState({
              loader: false,
              currentSelectedAddID: '',
            });

            // this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            this.props.navigation.navigate('SuccessPageEnableMessage');
            this.onRefresh();
          } else {

            this.setState({ loader: false, currentSelectedAddID: '' });
            // this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            this.props.navigation.navigate('errorpage', { route_name: 'enable_report' });
            this.onRefresh();
          }
        }
      );
    }

  }

  // bottom sheet code

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
    this.setState({ modalVisible: false });
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


  onCloseStatusChange = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
    this.sheetRef2.current.snapTo(0);
    setTimeout(() => {
      this.setState({ isOpenStatusChange: false });
    }, 50);
  };

  onOpenStatusChange = () => {
    this.setState({ modalVisible: false });
    this.setState({ isOpenStatusChange: true });
    this.sheetRef2.current.snapTo(2);
    Animated.timing(this.state.opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  renderBackDropStatusChange = () => (
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
        onPress={this.onCloseStatusChange}
      />
    </Animated.View>
  );


  renderContent = () => {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          backgroundColor: '#fff',
          height: 300,
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
        <Row style={{ height: 70 }}>
          <Col style={{ justifyContent: 'center', paddingHorizontal: 20, width: '80%' }}>
            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#67BD44", paddingVertical: 20 }}>{t("Cancel report")}</Text>
          </Col>
          <Col style={{ justifyContent: 'center', paddingHorizontal: 20, width: '20%' }}>
            <Image
              source={require("../../images/Delete-Green.png")}
              style={{ width: 30, height: 30 }}
            />
          </Col>
        </Row>
        <LinearGradient
          colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
          start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
        // style={{ marginHorizontal: 20 }}
        >
          <Row style={{ height: 2, }}>

          </Row>
        </LinearGradient>

        <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 70,
            // marginTop:'10%',
            // marginBottom:'3%'
          }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              color: "#9f9f9f",
              fontSize: 23,
              fontFamily: "Roboto-Light",
            }}
          >
            {t("Are you sure?")}
          </Text>
        </Row>

        <Row
          style={{
            marginBottom: "60%",
            justifyContent: "center",
            // alignItems: "center",
            // height:60

          }}
        >
          <TouchableOpacity onPress={() => this.deleteAdsAction()} style={{
            ...Platform.select({
              android: {
                height: 70
              }
            })
          }}>
            <Text
              // style={{
              //   borderWidth: 1,
              //   borderColor: "#7cd36d",
              //   paddingVertical: 20,
              //   paddingHorizontal: 40,
              //   borderRadius: 40,
              //   width: "100%",
              //   textAlign: "center",
              //   color: "#666666",
              //   fontSize: 28,
              //   fontFamily: "Roboto-Medium",
              // }}

              style={{
                ...Platform.select({
                  ios: {
                    borderWidth: 1,
                    borderColor: "#7cd36d",
                    paddingVertical: 20,
                    paddingHorizontal: 40,
                    borderRadius: 40,
                    width: "100%",
                    color: "#666666",
                    textAlign: "center",
                    fontSize: 28,
                    height: 70,
                    fontFamily: "Roboto-Medium",
                  },
                  android: {
                    borderWidth: 1,
                    borderColor: "#7cd36d",
                    paddingVertical: 20,
                    paddingHorizontal: 40,
                    borderRadius: 60,
                    width: "100%",
                    textAlign: "center",
                    color: "#666666",
                    fontSize: 28,
                    fontFamily: "Roboto-Medium",
                  }
                })
              }}
            >
              {t("CONFIRMATION")}
            </Text>
          </TouchableOpacity>
        </Row>
      </View>
    )

  };

  renderContentStatusChange = () => {
    const { navigate } = this.props.navigation;
    const { currentSelectedAddStatus } = this.state;
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
        <Row style={{ height: 70 }}>
          {
            currentSelectedAddStatus == "0" ? (<Col style={{ justifyContent: 'center', paddingHorizontal: 20, width: '80%' }}>
              <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#67BD44", paddingVertical: 20 }}>{t("Close report")}</Text>
            </Col>) : (<Col style={{ justifyContent: 'center', paddingHorizontal: 20, width: '80%' }}>
              <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 25, color: "#67BD44", paddingVertical: 20 }}>{t("Open report")}</Text>
            </Col>)
          }

          <Col style={{ justifyContent: 'center', paddingHorizontal: 20, width: '20%' }}>
            <Image
              source={require("../../images/Cross-Green.png")}
              style={{ width: 30, height: 30 }}
            />
          </Col>
        </Row>
        <LinearGradient
          colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
          start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
        // style={{ marginHorizontal: 20 }}
        >
          <Row style={{ height: 2, }}>

          </Row>
        </LinearGradient>

        <Row
          style={{
            marginBottom: "50%",
            // marginTop: "15%",
            justifyContent: "center",
            alignItems: "center",
            // height:60,
          }}
        >
          <TouchableOpacity onPress={() => this.changeActiveStatusOfMyAd()}
          // style={{ paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}
          >
            <Text
              // style={{
              //   borderWidth: 1,
              //   borderColor: "#7cd36d",
              //   paddingVertical: 20,
              //   paddingHorizontal: 40,
              //   borderRadius: 40,
              //   width: "100%",
              //   textAlign: "center",
              //   color: "#666666",
              //   fontSize: 28,
              //   fontFamily: "Roboto-Medium",
              // }}

              style={{
                ...Platform.select({
                  ios: {
                    borderWidth: 1,
                    borderColor: "#7cd36d",
                    paddingVertical: 20,
                    paddingHorizontal: 40,
                    borderRadius: 40,
                    width: "100%",
                    color: "#666666",
                    fontSize: 28,
                    fontFamily: "Roboto-Medium",
                  },
                  android: {
                    borderWidth: 1,
                    borderColor: "#7cd36d",
                    paddingVertical: 20,
                    paddingHorizontal: 40,
                    borderRadius: 60,
                    width: "100%",
                    textAlign: "center",
                    color: "#666666",
                    fontSize: 28,
                    fontFamily: "Roboto-Medium",
                  }
                })
              }}
            >
              {t("CONFIRMATION")}
            </Text>
          </TouchableOpacity>
        </Row>
      </View>
    )

  };



  render() {
    const { navigate } = this.props.navigation;
    const { loader, modalVisible, currentSelectedAddStatus, currentSelectedAddTitle } = this.state;
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
            data={this.state.AllcomplainList}
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
                <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                  style={{ justifyContent: 'center', alignItems: 'center' }}>

                  <Row style={styles.Title}>

                    {/* <Col style={{ width: "25%" }}></Col> */}
                    <Col
                      style={{ justifyContent: "center", width: "80%" }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "#fff",
                          fontSize: 25,
                          fontFamily: "Roboto-Medium",

                        }}

                      >
                        {this.state.currentSelectedAddTitle}
                      </Text>
                    </Col>

                    <Col style={{ width: "20%", justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => this.closeModal(false)}>
                        <Image
                          source={require("../../images/Cross-Icon.png")}
                          style={{ width: 30, height: 30 }}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>

                </LinearGradient>
                <LinearGradient
                  colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                >
                  <Row style={{ height: 2 }}></Row>
                </LinearGradient>
                <TouchableOpacity onPress={() => this.navigateToViewScreen()}>
                  <Row style={{ height: 60, paddingHorizontal: 20 }}>

                    <Col style={{ justifyContent: "center", width: "80%" }}>
                      <Text
                        style={{
                          color: "#999999",
                          fontSize: 25,
                          fontFamily: "Roboto-Medium",
                        }}
                      >
                        {t("See reporting")}
                      </Text>
                    </Col>
                    <Col style={{ justifyContent: "center", width: "20%" }}>
                      <Image
                        source={require("../../images/Eye-Icon.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </Col>

                  </Row>
                </TouchableOpacity>

                <LinearGradient
                  colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                >
                  <Row style={{ height: 2 }}></Row>
                </LinearGradient>


                <TouchableOpacity onPress={() => this.onOpen()}>
                  <Row style={{ height: 60, paddingHorizontal: 20 }}>
                    <Col style={{ justifyContent: "center", width: "80%" }}>
                      <Text
                        style={{
                          color: "#999999",
                          fontSize: 25,
                          fontFamily: "Roboto-Medium",
                        }}
                      >
                        {t("Cancel report")}
                      </Text>
                    </Col>
                    <Col style={{ justifyContent: "center", width: "20%" }}>
                      <Image
                        source={require("../../images/Delete-Icon.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>

                <LinearGradient
                  colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                >
                  <Row style={{ height: 2 }}></Row>
                </LinearGradient>

                <TouchableOpacity onPress={() => this.onOpenStatusChange()} style={{ height: 60, backgroundColor: '#fff' }}>
                  <Row style={{ height: 60, paddingHorizontal: 20, backgroundColor: '#fff' }}>
                    {
                      currentSelectedAddStatus == "0" ? (<Col style={{ justifyContent: "center", width: "80%" }}>
                        <Text
                          style={{
                            color: "#999999",
                            fontSize: 25,
                            fontFamily: "Roboto-Medium",
                          }}
                        >
                          {t("Close report")}
                        </Text>
                      </Col>) : (<Col style={{ justifyContent: "center", width: "80%" }}>
                        <Text
                          style={{
                            color: "#999999",
                            fontSize: 25,
                            fontFamily: "Roboto-Medium",
                          }}
                        >
                          {t("Open report")}
                        </Text>
                      </Col>)
                    }

                    <Col style={{ justifyContent: "center", width: "20%" }}>
                      <Image
                        source={require("../../images/Cross-Icon.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>
                <LinearGradient
                  colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                >
                  <Row style={{ height: 2 }}></Row>
                </LinearGradient>
              </View>
            </View>
          </Modal>

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

          {this.state.isOpenStatusChange && this.renderBackDropStatusChange()}

          <BottomSheet
            ref={this.sheetRef2}
            // snapPoints={[0, 240, 0]}
            // borderRadius={10}
            enabledContentGestureInteraction={false}
            renderContent={this.renderContentStatusChange}

            snapPoints={[
              '-10%',
              height * 0.5,
              height * 0.35,
              height * 0.85,
            ]}
            initialSnap={0}
            onCloseEnd={this.onCloseStatusChange}
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

  },
  centeredView: {
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.5,
    shadowRadius: 1.22,
    elevation: 500,
    // width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: "rgba(100,100,100, 0.8)",
  },
  modalView: {

    // flexDirection: 'column',

    // borderRadius: 20,
    justifyContent: "center",
    top: '25%',
    marginBottom: '15%',
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: "#fff",
    // alignItems: "center",
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height/2,
    shadowColor: "#232324",
    // height: '60%',
    shadowOffset: {
      width: 0,
      // height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  // Title: {
  //     ...Platform.select({
  //         ios: {
  //             top: 10,
  //             width: '100%',
  //             height: '10%',
  //         },
  //         android: {
  //             // top: 10,
  //             width: '100%',
  //             height: 50,
  //             backgroundColor: '#62bb46'
  //         }
  //     })
  // },

  Title: {
    ...Platform.select({
      ios: {
        // width: "100%",
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: "#62bb46",
      },
      android: {
        // width: "100%",
        paddingHorizontal: 20,
        height: 60,
        // backgroundColor: "#62bb46",
      },
    }),
  },
})